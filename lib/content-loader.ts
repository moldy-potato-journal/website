import { access, readFile } from "node:fs/promises"
import path from "node:path"

import {
    type ArticleCategoryIndex,
    type ArticleIndex,
    type ArticleRecord,
    type InformationContent,
    CONTENT_ROOT_FILES,
    CONTENT_SYSTEM_VERSION,
    type JournalEntryPointer,
    type JournalIndex,
    type JournalIssueIndex,
    type JournalRecord,
    type RootContentIndex,
} from "@/lib/content-schema"
import {
    CONTENT_BRANCH_POLICY,
    CONTENT_REPOSITORY,
    getContentRawUrl,
} from "@/lib/content-source"
import {
    compareJournalIssues,
    isValidJournalIssue,
    toJournalIssueCode,
} from "@/lib/journal-issue"
import {
    briefs as fallbackBriefs,
    contentInformation as fallbackContentInformation,
    staticCopy,
    standaloneArticles as fallbackArticles,
} from "@/lib/home-content"
import {
    compareArticleNumbers,
    isValidArticleNumber,
} from "@/lib/article-number"
import { siteConfig } from "@/lib/site"

export type HomeBrief = {
    label: string
    title: string
    body: string
}

export type HomeJournal = {
    id: string
    issue: string
    issueCode: string
    title: string
    issueLabel: string
    summary: string
    href: string
    archiveHref: string
    entries: string[]
}

export type HomeArticle = {
    id: string
    articleNumber: string
    title: string
    description: string
    category: string
    href: string
    contentType: "markdown" | "pdf"
}

export type HomePageData = {
    title: string
    description: string
    frontMatter: {
        title: string
        description: string
    }
    briefs: HomeBrief[]
    submission: {
        title: string
        body: string
        repoUrl: string
        branchPrefix: string
        submitHref: string
        guidelinesHref: string
    }
    archiveTotals: {
        standaloneArticles: number
        journalIssues: number
        journalArticles: number
    }
    latestJournal: HomeJournal
    latestJournalContentsDescription: string
    articlesSection: {
        title: string
        description: string
    }
    articles: HomeArticle[]
}

export type ArticlesPageData = {
    title: string
    description: string
    categoryPageDescription: string
    missingCategoryDescription: string
    recentArticles: HomeArticle[]
    hottestArticles: HomeArticle[]
    latestArticle: HomeArticle
    latestArticleAbstract: string
    hotArticlesTitle: string
    categoriesInformation: {
        sectionDescription: string
        unavailableTitle: string
        unavailableDescription: string
        categoryViewDescription: string
    }
    groupedArticles: Array<{
        category: string
        items: HomeArticle[]
    }>
}

export type ArticlePageData = {
    siteTitle: string
    article: HomeArticle & {
        abstract: string
        authors: string[]
        publishDate?: string
        tags: string[]
        discussionUrl?: string
        rawContentUrl: string
        body?: string
    }
}

export type ArticleNotFoundPageData = {
    pageDescription: string
    headerTitle: string
    headerDescription: string
    recommendationsTitle: string
    recommendationsDescription: string
    recommendedArticles: HomeArticle[]
}

export type JournalIssueEntry = {
    index: number
    entryNumber: string
    title: string
    summary: string
    authors: string[]
    tags: string[]
    pageStart: number
    pageEnd: number
    href: string
}

export type JournalsPageData = {
    pageDescription: string
    contentsDescription: string
    latestJournal: HomeJournal
    journals: HomeJournal[]
}

export type JournalIssuePageData = {
    siteTitle: string
    journal: HomeJournal & {
        publishDate?: string
        discussionUrl?: string
        articleCount: number
    }
    entries: JournalIssueEntry[]
}

export type JournalIssueArticlePageData = {
    siteTitle: string
    journal: JournalIssuePageData["journal"]
    entry: JournalIssueEntry
    journalArticlePdfUrl: string
    journalArticlePdfViewerUrl: string
}

export type SiteInformation = InformationContent

type RawArticleRecord = Omit<ArticleRecord, "description" | "abstract"> & {
    description?: string
    abstract?: string
    summary?: string
}

function normalizePath(path: string) {
    return path.replace(/^\.\//, "")
}

const LOCAL_CONTENT_ROOT = path.join(process.cwd(), "content-sample")

function isDevelopmentMode() {
    return process.env.NODE_ENV === "development"
}

async function hasLocalContentFile(pathName: string) {
    try {
        await access(path.join(LOCAL_CONTENT_ROOT, normalizePath(pathName)))
        return true
    } catch {
        return false
    }
}

function toRawContentUrl(pathName: string) {
    if (isDevelopmentMode()) {
        return `/api/content/${normalizePath(pathName)}`
    }

    return getContentRawUrl(normalizePath(pathName))
}

async function fetchJson<T>(pathName: string): Promise<T> {
    if (isDevelopmentMode() && (await hasLocalContentFile(pathName))) {
        const fileContents = await readFile(
            path.join(LOCAL_CONTENT_ROOT, normalizePath(pathName)),
            "utf8"
        )

        return JSON.parse(fileContents) as T
    }

    const response = await fetch(toRawContentUrl(pathName), {
        next: { revalidate: 300 },
        headers: {
            Accept: "application/json",
        },
    })

    if (!response.ok) {
        throw new Error(
            `Failed to fetch content at ${pathName}: ${response.status}`
        )
    }

    return response.json() as Promise<T>
}

async function fetchText(pathName: string): Promise<string> {
    if (isDevelopmentMode() && (await hasLocalContentFile(pathName))) {
        return readFile(
            path.join(LOCAL_CONTENT_ROOT, normalizePath(pathName)),
            "utf8"
        )
    }

    const response = await fetch(toRawContentUrl(pathName), {
        next: { revalidate: 300 },
        headers: {
            Accept: "text/plain",
        },
    })

    if (!response.ok) {
        throw new Error(
            `Failed to fetch content at ${pathName}: ${response.status}`
        )
    }

    return response.text()
}

async function loadRootIndex() {
    const rootIndex = await fetchJson<RootContentIndex>(
        CONTENT_ROOT_FILES.index
    )

    if (rootIndex.version !== CONTENT_SYSTEM_VERSION) {
        throw new Error(`Unsupported content version: ${rootIndex.version}`)
    }

    return rootIndex
}

export async function loadInformationContent(): Promise<SiteInformation> {
    try {
        return await fetchJson<InformationContent>(
            CONTENT_ROOT_FILES.information
        )
    } catch {
        return fallbackContentInformation
    }
}

async function loadContentIndexes() {
    const [journalIndex, articleIndex] = await Promise.all([
        fetchJson<JournalIndex>(CONTENT_ROOT_FILES.journalsIndex),
        fetchJson<ArticleIndex>(CONTENT_ROOT_FILES.articlesIndex),
    ])

    return {
        journalIndex,
        articleIndex,
    }
}

function getArticleMetadataPath(articleNumber: string) {
    return `articles/${articleNumber}/metadata.json`
}

function getArticleCategoryIndexPath() {
    return "articles/index.category.json"
}

function getJournalIssueIndexPath(issue: string) {
    return `journals/${issue}/index.json`
}

function getJournalMetadataPath(issue: string) {
    return `journals/${issue}/metadata.json`
}

function getJournalEntryPdfPath(issue: string, entryNumber: string) {
    return `journals/${issue}/${entryNumber}.pdf`
}

function normalizeArticleRecord(article: RawArticleRecord): ArticleRecord {
    return {
        ...article,
        description: article.description ?? article.summary ?? "",
        abstract:
            article.abstract ?? article.summary ?? article.description ?? "",
    }
}

function formatFallbackArticleNumber(index: number) {
    return `26-${String(index + 1).padStart(2, "0")}`
}

function sortFallbackArticlesByPublishDate() {
    return fallbackArticles
        .map((article, index) => ({
            ...article,
            articleNumber: formatFallbackArticleNumber(index),
        }))
        .sort((left, right) => {
            const publishDateDifference =
                Date.parse(right.publishDate) - Date.parse(left.publishDate)

            if (publishDateDifference !== 0) {
                return publishDateDifference
            }

            return compareArticleNumbers(
                left.articleNumber,
                right.articleNumber
            )
        })
}

function sortJournalsByPublicationDate<
    T extends { publishDate?: string; issue: string },
>(items: T[]) {
    return [...items].sort((left, right) => {
        const leftValue = left.publishDate ? Date.parse(left.publishDate) : 0
        const rightValue = right.publishDate ? Date.parse(right.publishDate) : 0

        if (rightValue !== leftValue) {
            return rightValue - leftValue
        }

        return compareJournalIssues(right.issue, left.issue)
    })
}

function getFallbackHomePageData(): HomePageData {
    const sortedFallbackArticles = sortFallbackArticlesByPublishDate()
    const fallbackIssue = "26-3"
    const information = fallbackContentInformation

    return {
        title: siteConfig.name,
        description: siteConfig.description,
        frontMatter: {
            title: staticCopy.homepage.frontMatter.title,
            description: staticCopy.homepage.frontMatter.description,
        },
        briefs: fallbackBriefs.map((brief) => ({ ...brief })),
        submission: {
            title: information.homepage.frontMatter.submission.title,
            body: information.homepage.frontMatter.submission.body,
            repoUrl: CONTENT_REPOSITORY.url,
            branchPrefix: CONTENT_BRANCH_POLICY.submissionBranchPrefix,
            submitHref: `${CONTENT_REPOSITORY.url}/compare`,
            guidelinesHref: CONTENT_REPOSITORY.url,
        },
        archiveTotals: {
            standaloneArticles: fallbackArticles.length,
            journalIssues: 1,
            journalArticles: 3,
        },
        latestJournal: {
            id: "MPJ-26-3",
            issue: fallbackIssue,
            issueCode: toJournalIssueCode(fallbackIssue),
            title: "Issue 3",
            issueLabel: toJournalIssueCode(fallbackIssue),
            summary:
                "A first issue on film rot, campus screenings, and late-night notebook criticism.",
            href: `/journals/${fallbackIssue}`,
            archiveHref: "/journals",
            entries: [
                "Against clean restoration",
                "The corridor shot as student cinema theology",
                "Viewing diary: five rainy screenings",
            ],
        },
        latestJournalContentsDescription:
            staticCopy.homepage.latestJournal.contentsDescription,
        articlesSection: {
            title: staticCopy.homepage.standaloneArticles.title,
            description: staticCopy.homepage.standaloneArticles.description,
        },
        articles: sortedFallbackArticles.map((article) => ({
            id: article.articleNumber,
            articleNumber: article.articleNumber,
            title: article.title,
            description: article.description,
            category: article.category,
            href: `/articles/${article.articleNumber}`,
            contentType: article.contentType,
        })),
    }
}

function toHomeArticle(article: ArticleRecord): HomeArticle {
    if (!isValidArticleNumber(article.articleNumber)) {
        throw new Error(`Invalid article number: ${article.articleNumber}`)
    }

    return {
        id: article.id,
        articleNumber: article.articleNumber,
        title: article.title,
        description: article.description,
        category: article.category,
        href: `/articles/${article.articleNumber}`,
        contentType: article.content.type,
    }
}

function toHomeJournal(journal: JournalRecord, entries: string[]): HomeJournal {
    if (!isValidJournalIssue(journal.issue)) {
        throw new Error(`Invalid journal issue: ${journal.issue}`)
    }

    return {
        id: journal.id,
        issue: journal.issue,
        issueCode: toJournalIssueCode(journal.issue),
        title: journal.title,
        issueLabel: journal.issueLabel,
        summary: journal.summary,
        href: `/journals/${journal.issue}`,
        archiveHref: "/journals",
        entries,
    }
}

function toJournalIssueEntry(
    entry: JournalEntryPointer,
    issue: string,
    index: number
): JournalIssueEntry {
    return {
        index,
        entryNumber: entry.entryNumber,
        title: entry.title,
        summary: entry.summary,
        authors: entry.authors,
        tags: entry.tags,
        pageStart: entry.pages.start,
        pageEnd: entry.pages.end,
        href: `/journals/${issue}/${entry.entryNumber}`,
    }
}

async function loadJournalIssueResources(issue: string) {
    const issueIndex = await fetchJson<JournalIssueIndex>(
        getJournalIssueIndexPath(issue)
    )
    const journal = await fetchJson<JournalRecord>(
        getJournalMetadataPath(issue)
    )

    return {
        journal,
        issueIndex,
    }
}

function sortArticlesByPublicationDate<
    T extends {
        publishDate?: string
        articleNumber: string
    },
>(items: T[]) {
    return [...items].sort((left, right) => {
        const leftValue = left.publishDate ? Date.parse(left.publishDate) : 0
        const rightValue = right.publishDate ? Date.parse(right.publishDate) : 0

        if (rightValue !== leftValue) {
            return rightValue - leftValue
        }

        return compareArticleNumbers(left.articleNumber, right.articleNumber)
    })
}

function buildGroupedArticlesFromRecords(
    publishedArticles: ArticleRecord[],
    categoryIndex?: ArticleCategoryIndex
) {
    if (categoryIndex) {
        return categoryIndex.items
            .map((category) => {
                const items = category.articleIds
                    .map((articleId) =>
                        publishedArticles.find(
                            (article) => article.id === articleId
                        )
                    )
                    .filter((article): article is ArticleRecord =>
                        Boolean(article)
                    )
                    .map(toHomeArticle)

                return {
                    category: category.title,
                    items,
                }
            })
            .filter((group) => group.items.length > 0)
    }

    const groupedMap = new Map<string, HomeArticle[]>()

    for (const article of publishedArticles) {
        const category = article.category || "Uncategorised"
        const currentItems = groupedMap.get(category) ?? []
        currentItems.push(toHomeArticle(article))
        groupedMap.set(category, currentItems)
    }

    return Array.from(groupedMap.entries()).map(([category, items]) => ({
        category,
        items,
    }))
}

function buildBriefs(
    journal: JournalRecord,
    journalCount: number,
    articleCount: number
): HomeBrief[] {
    return [
        {
            label: "Latest Release",
            title: `${journal.issueLabel} is now live`,
            body: journal.summary,
        },
        {
            label: "Call for Papers",
            title: "Submissions are open through GitHub",
            body: `Submit a pull request to ${CONTENT_REPOSITORY.owner}/${CONTENT_REPOSITORY.repo} under the ${CONTENT_BRANCH_POLICY.submissionBranchPrefix} branch convention.`,
        },
        {
            label: "Archive State",
            title: `${journalCount} journal issue${journalCount === 1 ? "" : "s"} and ${articleCount} article${articleCount === 1 ? "" : "s"}`,
            body: "The root index highlights featured work and points to the deeper journal and article indexes.",
        },
    ]
}

export async function loadHomePageData(): Promise<HomePageData> {
    try {
        const [rootIndex, information] = await Promise.all([
            fetchJson<RootContentIndex>(CONTENT_ROOT_FILES.index),
            loadInformationContent(),
        ])

        if (rootIndex.version !== CONTENT_SYSTEM_VERSION) {
            throw new Error(`Unsupported content version: ${rootIndex.version}`)
        }

        const [journalIndex, articleIndex] = await Promise.all([
            fetchJson<JournalIndex>(CONTENT_ROOT_FILES.journalsIndex),
            fetchJson<ArticleIndex>(CONTENT_ROOT_FILES.articlesIndex),
        ])
        const [journalResourcePairs, articleRecords] = await Promise.all([
            Promise.all(
                journalIndex.items.map((issue) =>
                    loadJournalIssueResources(issue)
                )
            ),
            Promise.all(
                articleIndex.items.map((articleNumber) =>
                    fetchJson<RawArticleRecord>(
                        getArticleMetadataPath(articleNumber)
                    ).then(normalizeArticleRecord)
                )
            ),
        ])
        const publishedJournalResources = journalResourcePairs.filter(
            ({ journal }) => journal.status === "published"
        )
        const publishedArticles = articleRecords.filter(
            (article) => article.status === "published"
        )
        const standaloneArticlesCount = publishedArticles.length
        const journalArticleCount = publishedJournalResources.reduce(
            (count, resource) => count + resource.issueIndex.items.length,
            0
        )

        const featuredIssue =
            publishedJournalResources.find(
                ({ journal }) =>
                    journal.id === rootIndex.homepage.featuredJournalId
            )?.journal.issue ??
            publishedJournalResources.find(
                ({ journal }) => journal.id === journalIndex.featured
            )?.journal.issue ??
            journalIndex.items[0]

        if (!featuredIssue) {
            throw new Error("No journal entries found in content index")
        }

        const featuredJournalResource =
            await loadJournalIssueResources(featuredIssue)
        const featuredJournal = featuredJournalResource.journal

        const latestArticles = sortArticlesByPublicationDate(
            publishedArticles
        ).slice(0, 6)

        return {
            title: rootIndex.homepage.title,
            description: rootIndex.homepage.description,
            frontMatter: {
                title: staticCopy.homepage.frontMatter.title,
                description: staticCopy.homepage.frontMatter.description,
            },
            briefs:
                information.homepage.frontMatter.briefs.length > 0
                    ? information.homepage.frontMatter.briefs.map((brief) => ({
                          ...brief,
                      }))
                    : buildBriefs(
                          featuredJournal,
                          journalIndex.items.length,
                          articleIndex.items.length
                      ),
            submission: {
                title: information.homepage.frontMatter.submission.title,
                body: information.homepage.frontMatter.submission.body,
                repoUrl: CONTENT_REPOSITORY.url,
                branchPrefix: CONTENT_BRANCH_POLICY.submissionBranchPrefix,
                submitHref: `${CONTENT_REPOSITORY.url}/compare`,
                guidelinesHref: CONTENT_REPOSITORY.url,
            },
            archiveTotals: {
                standaloneArticles: standaloneArticlesCount,
                journalIssues: publishedJournalResources.length,
                journalArticles: journalArticleCount,
            },
            latestJournal: {
                id: featuredJournal.id,
                issue: featuredJournal.issue,
                issueCode: toJournalIssueCode(featuredJournal.issue),
                title: featuredJournal.title,
                issueLabel: featuredJournal.issueLabel,
                summary: featuredJournal.summary,
                href: `/journals/${featuredJournal.issue}`,
                archiveHref: "/journals",
                entries: featuredJournalResource.issueIndex.items.map(
                    (entry) => entry.title
                ),
            },
            latestJournalContentsDescription:
                staticCopy.homepage.latestJournal.contentsDescription,
            articlesSection: {
                title: staticCopy.homepage.standaloneArticles.title,
                description: staticCopy.homepage.standaloneArticles.description,
            },
            articles: latestArticles.map((article) => ({
                ...toHomeArticle(article),
            })),
        }
    } catch {
        return getFallbackHomePageData()
    }
}

function getFallbackArticlesPageData(): ArticlesPageData {
    const home = getFallbackHomePageData()
    const sortedFallbackArticles = sortFallbackArticlesByPublishDate()
    const hottestArticles = home.articles.slice(0, 2)
    const latestArticle = home.articles[0]
    const groupedMap = new Map<string, HomeArticle[]>()

    for (const article of home.articles) {
        const currentItems = groupedMap.get(article.category) ?? []
        currentItems.push(article)
        groupedMap.set(article.category, currentItems)
    }

    const groupedArticles = Array.from(groupedMap.entries()).map(
        ([category, items]) => ({
            category,
            items,
        })
    )

    return {
        title: home.title,
        description: staticCopy.articles.pageDescription,
        categoryPageDescription:
            staticCopy.articles.selectedCategoryDescription,
        missingCategoryDescription:
            staticCopy.articles.missingCategoryDescription,
        recentArticles: home.articles.slice(0, 6),
        hottestArticles,
        latestArticle,
        latestArticleAbstract: sortedFallbackArticles[0]?.abstract ?? "",
        hotArticlesTitle: staticCopy.articles.spotlight.hotArticlesTitle,
        categoriesInformation: {
            sectionDescription:
                staticCopy.articles.categories.sectionDescription,
            unavailableTitle: staticCopy.articles.categories.unavailableTitle,
            unavailableDescription:
                staticCopy.articles.categories.unavailableDescription,
            categoryViewDescription:
                staticCopy.articles.categories.categoryViewDescription,
        },
        groupedArticles,
    }
}

const FALLBACK_JOURNAL_ISSUE = "26-3"
const FALLBACK_JOURNAL_ENTRY_POINTERS: JournalEntryPointer[] = [
    {
        entryNumber: "1",
        title: "Against clean restoration",
        summary:
            "A short argument for leaving visible damage, noise, and material history in the frame.",
        authors: ["Editorial Desk"],
        tags: ["restoration", "materiality", "criticism"],
        pages: { start: 1, end: 6 },
    },
    {
        entryNumber: "2",
        title: "The corridor shot as student cinema theology",
        summary:
            "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
        authors: ["Editorial Desk"],
        tags: ["student cinema", "space", "mise-en-scene"],
        pages: { start: 7, end: 12 },
    },
    {
        entryNumber: "3",
        title: "Viewing diary: five rainy screenings",
        summary:
            "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
        authors: ["Editorial Desk"],
        tags: ["viewing diary", "programming", "criticism"],
        pages: { start: 13, end: 18 },
    },
] as const

function getFallbackJournalEntries(): JournalIssueEntry[] {
    return FALLBACK_JOURNAL_ENTRY_POINTERS.map((entry, index) =>
        toJournalIssueEntry(entry, FALLBACK_JOURNAL_ISSUE, index)
    )
}

function getFallbackJournalIssuePageData(
    issue: string
): JournalIssuePageData | null {
    if (issue !== FALLBACK_JOURNAL_ISSUE) {
        return null
    }

    const entries = getFallbackJournalEntries()

    return {
        siteTitle: siteConfig.name,
        journal: {
            ...getFallbackHomePageData().latestJournal,
            publishDate: "2026-03-30",
            discussionUrl: undefined,
            articleCount: entries.length,
        },
        entries,
    }
}

function getFallbackJournalIssueArticlePageData(
    issue: string,
    articleEntry: string
): JournalIssueArticlePageData | null {
    const issuePageData = getFallbackJournalIssuePageData(issue)

    if (!issuePageData) {
        return null
    }

    const entryIndex = Number(articleEntry)

    if (!Number.isInteger(entryIndex) || entryIndex < 1) {
        return null
    }

    const entry = issuePageData.entries[entryIndex - 1]

    if (!entry) {
        return null
    }

    return {
        siteTitle: siteConfig.name,
        journal: issuePageData.journal,
        entry,
        journalArticlePdfUrl: getContentRawUrl(
            getJournalEntryPdfPath(FALLBACK_JOURNAL_ISSUE, entry.entryNumber)
        ),
        journalArticlePdfViewerUrl: `${getContentRawUrl(getJournalEntryPdfPath(FALLBACK_JOURNAL_ISSUE, entry.entryNumber))}#page=1`,
    }
}

export async function loadArticlesPageData(): Promise<ArticlesPageData> {
    try {
        const rootIndex = await fetchJson<RootContentIndex>(
            CONTENT_ROOT_FILES.index
        )

        if (rootIndex.version !== CONTENT_SYSTEM_VERSION) {
            throw new Error(`Unsupported content version: ${rootIndex.version}`)
        }

        const articleIndex = await fetchJson<ArticleIndex>(
            CONTENT_ROOT_FILES.articlesIndex
        )
        const articleCategoryIndex = await fetchJson<ArticleCategoryIndex>(
            getArticleCategoryIndexPath()
        ).catch(() => undefined)
        const articleRecords = await Promise.all(
            articleIndex.items.map((articleNumber) =>
                fetchJson<RawArticleRecord>(
                    getArticleMetadataPath(articleNumber)
                ).then(normalizeArticleRecord)
            )
        )

        const publishedArticles = sortArticlesByPublicationDate(
            articleRecords.filter((article) => article.status === "published")
        )

        if (publishedArticles.length === 0) {
            throw new Error("No published articles found")
        }

        const featuredArticles = rootIndex.homepage.featuredArticleIds
            .map((articleId) =>
                publishedArticles.find((article) => article.id === articleId)
            )
            .filter((article): article is ArticleRecord => Boolean(article))

        const hottestArticles = (
            featuredArticles.length > 0 ? featuredArticles : publishedArticles
        )
            .slice(0, 3)
            .map(toHomeArticle)

        const latestArticle = publishedArticles[0]

        return {
            title: rootIndex.homepage.title,
            description: staticCopy.articles.pageDescription,
            categoryPageDescription:
                staticCopy.articles.selectedCategoryDescription,
            missingCategoryDescription:
                staticCopy.articles.missingCategoryDescription,
            recentArticles: publishedArticles.slice(0, 6).map(toHomeArticle),
            hottestArticles,
            latestArticle: toHomeArticle(latestArticle),
            latestArticleAbstract: latestArticle.abstract,
            hotArticlesTitle: staticCopy.articles.spotlight.hotArticlesTitle,
            categoriesInformation: {
                sectionDescription:
                    staticCopy.articles.categories.sectionDescription,
                unavailableTitle:
                    staticCopy.articles.categories.unavailableTitle,
                unavailableDescription:
                    staticCopy.articles.categories.unavailableDescription,
                categoryViewDescription:
                    staticCopy.articles.categories.categoryViewDescription,
            },
            groupedArticles: buildGroupedArticlesFromRecords(
                publishedArticles,
                articleCategoryIndex
            ),
        }
    } catch {
        return getFallbackArticlesPageData()
    }
}

export async function loadJournalsPageData(): Promise<JournalsPageData> {
    try {
        const { journalIndex } = await loadContentIndexes()
        const journalResources = await Promise.all(
            journalIndex.items.map((issue) => loadJournalIssueResources(issue))
        )

        const publishedJournals = sortJournalsByPublicationDate(
            journalResources
                .map((resource) => resource.journal)
                .filter((journal) => journal.status === "published")
        )

        if (publishedJournals.length === 0) {
            throw new Error("No published journals found")
        }

        const journals = publishedJournals.map((journal) =>
            toHomeJournal(
                journal,
                journalResources
                    .find((resource) => resource.journal.id === journal.id)
                    ?.issueIndex.items.map((entry) => entry.title) ?? []
            )
        )

        return {
            pageDescription: staticCopy.journals.pageDescription,
            contentsDescription: staticCopy.journals.contentsDescription,
            latestJournal: journals[0],
            journals,
        }
    } catch {
        const fallbackJournal = getFallbackHomePageData().latestJournal

        return {
            pageDescription: staticCopy.journals.pageDescription,
            contentsDescription: staticCopy.journals.contentsDescription,
            latestJournal: fallbackJournal,
            journals: [fallbackJournal],
        }
    }
}

export async function loadJournalIssuePageData(
    issue: string
): Promise<JournalIssuePageData | null> {
    try {
        const rootIndex = await loadRootIndex()
        const { journalIndex } = await loadContentIndexes()
        const hasIssue = journalIndex.items.includes(issue)

        if (!hasIssue) {
            return null
        }

        const { journal, issueIndex } = await loadJournalIssueResources(issue)

        if (journal.status !== "published") {
            return null
        }

        const entries = issueIndex.items.map((entry, index) =>
            toJournalIssueEntry(entry, issue, index)
        )

        return {
            siteTitle: rootIndex.homepage.title,
            journal: {
                ...toHomeJournal(
                    journal,
                    entries.map((entry) => entry.title)
                ),
                publishDate: journal.publishDate,
                discussionUrl: journal.discussion?.discussionUrl,
                articleCount: entries.length,
            },
            entries,
        }
    } catch {
        return getFallbackJournalIssuePageData(issue)
    }
}

export async function loadJournalIssueArticlePageData(
    issue: string,
    articleEntry: string
): Promise<JournalIssueArticlePageData | null> {
    try {
        const issuePageData = await loadJournalIssuePageData(issue)

        if (!issuePageData) {
            return null
        }

        const entryIndex = Number(articleEntry)

        if (!Number.isInteger(entryIndex) || entryIndex < 1) {
            return null
        }

        const entry = issuePageData.entries[entryIndex - 1]

        if (!entry) {
            return null
        }
        const { journalIndex } = await loadContentIndexes()
        const hasIssue = journalIndex.items.includes(issue)

        if (!hasIssue) {
            return null
        }

        const journalArticlePdfUrl = toRawContentUrl(
            getJournalEntryPdfPath(issue, entry.entryNumber)
        )

        return {
            siteTitle: issuePageData.siteTitle,
            journal: issuePageData.journal,
            entry,
            journalArticlePdfUrl,
            journalArticlePdfViewerUrl: `${journalArticlePdfUrl}#page=1`,
        }
    } catch {
        return getFallbackJournalIssueArticlePageData(issue, articleEntry)
    }
}

function getFallbackArticlePageData(
    articleNumber: string
): ArticlePageData | null {
    if (articleNumber === "26-01") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-01",
                articleNumber,
                title: "Against clean restoration",
                description:
                    "A short argument for leaving visible damage, noise, and material history in the frame.",
                abstract:
                    "A short argument for leaving visible damage, noise, and material history in the frame.",
                category: "Film Analysis",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-17",
                tags: ["restoration", "materiality", "criticism"],
                rawContentUrl: getContentRawUrl("articles/26-01/body.md"),
                body: "# Against clean restoration\n\nVisible damage is sometimes part of the record. Scratches, instability, and noise can document the life of a print rather than merely interrupt it.",
            },
        }
    }

    if (articleNumber === "26-02") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-02",
                articleNumber,
                title: "The corridor shot as student cinema theology",
                description:
                    "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
                abstract:
                    "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
                category: "Student Film",
                href: `/articles/${articleNumber}`,
                contentType: "pdf",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-18",
                tags: ["student cinema", "space", "mise-en-scene"],
                rawContentUrl: getContentRawUrl("articles/26-02/paper.pdf"),
            },
        }
    }

    if (articleNumber === "26-03") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-03",
                articleNumber,
                title: "Viewing diary: five rainy screenings",
                description:
                    "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
                abstract:
                    "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
                category: "Film Analysis",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-19",
                tags: ["viewing diary", "programming", "criticism"],
                rawContentUrl: getContentRawUrl("articles/26-03/body.md"),
                body: "# Viewing diary: five rainy screenings\n\nRain changed the queue before it changed the film. Umbrellas arrived first, then damp coats, then the hush that makes a mediocre screening feel briefly necessary.",
            },
        }
    }

    if (articleNumber === "26-04") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-04",
                articleNumber,
                title: "The tripod as moral problem in the first-year short",
                description:
                    "A note on why static framing in student productions often signals anxiety rather than control.",
                abstract:
                    "A note on why static framing in student productions often signals anxiety rather than control.",
                category: "Student Film",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-20",
                tags: ["student film", "framing", "pedagogy"],
                rawContentUrl: getContentRawUrl("articles/26-04/body.md"),
                body: "# The tripod as moral problem in the first-year short\n\nMany early films confuse stillness with seriousness. The locked frame becomes less an aesthetic decision than a promise not to make a visible mistake.",
            },
        }
    }

    if (articleNumber === "26-05") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-05",
                articleNumber,
                title: "Cafeteria realism and the mid-budget campus feature",
                description:
                    "How institutional interiors become an accidental style in films made with borrowed locations.",
                abstract:
                    "How institutional interiors become an accidental style in films made with borrowed locations.",
                category: "Student Film",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-21",
                tags: ["student film", "location", "production design"],
                rawContentUrl: getContentRawUrl("articles/26-05/body.md"),
                body: "# Cafeteria realism and the mid-budget campus feature\n\nThe cafeteria appears not because it is symbolically dense, but because it is available, fluorescent, and already blocked for movement. The resulting realism is logistical before it is artistic.",
            },
        }
    }

    if (articleNumber === "26-06") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-06",
                articleNumber,
                title: "Why the rehearsal take sometimes belongs in the final cut",
                description:
                    "On rough delivery, unfinished timing, and the documentary pressure of performance before polish.",
                abstract:
                    "On rough delivery, unfinished timing, and the documentary pressure of performance before polish.",
                category: "Student Film",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-22",
                tags: ["performance", "student film", "editing"],
                rawContentUrl: getContentRawUrl("articles/26-06/body.md"),
                body: "# Why the rehearsal take sometimes belongs in the final cut\n\nA rehearsal take can retain the uncertainty that later, cleaner performances lose. What looks unfinished may in fact be the most legible record of risk.",
            },
        }
    }

    if (articleNumber === "26-07") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-07",
                articleNumber,
                title: "Projection booth notes after the late campus screening",
                description:
                    "A small record of lamp heat, misthreading, and the strange authority of whoever stays after the audience leaves.",
                abstract:
                    "A small record of lamp heat, misthreading, and the strange authority of whoever stays after the audience leaves.",
                category: "Exhibition Notes",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-23",
                tags: ["exhibition", "projection", "campus screening"],
                rawContentUrl: getContentRawUrl("articles/26-07/body.md"),
                body: "# Projection booth notes after the late campus screening\n\nThe booth acquires authority only after the audience leaves. During projection it is merely technical; afterward it becomes interpretive, full of explanations for dust, scratches, timing, and near-failure.",
            },
        }
    }

    if (articleNumber === "26-08") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-08",
                articleNumber,
                title: "Hiss, room tone, and the ethics of cleaned dialogue",
                description:
                    "Why over-cleaned student audio can erase the environment that made a scene believable in the first place.",
                abstract:
                    "Why over-cleaned student audio can erase the environment that made a scene believable in the first place.",
                category: "Sound Studies",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-24",
                tags: ["sound", "dialogue", "post-production"],
                rawContentUrl: getContentRawUrl("articles/26-08/body.md"),
                body: "# Hiss, room tone, and the ethics of cleaned dialogue\n\nNoise reduction often removes the room before it removes the problem. The resulting speech may be more intelligible, but it can become curiously unplaced, as if spoken nowhere.",
            },
        }
    }

    if (articleNumber === "26-09") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-09",
                articleNumber,
                title: "Box labels, mildew, and the politics of minor preservation",
                description:
                    "On handwritten tape labels, damp shelving, and the practical labour behind keeping non-canonical film culture legible.",
                abstract:
                    "On handwritten tape labels, damp shelving, and the practical labour behind keeping non-canonical film culture legible.",
                category: "Archive Notes",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-25",
                tags: ["archive", "preservation", "labour"],
                rawContentUrl: getContentRawUrl("articles/26-09/body.md"),
                body: "# Box labels, mildew, and the politics of minor preservation\n\nMinor archives survive through maintenance rather than prestige. A clear label, a dry shelf, and a volunteer who remembers where the tape was moved can matter more than institutional grandeur.",
            },
        }
    }

    if (articleNumber === "26-10") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-10",
                articleNumber,
                title: "Festival mornings and the first-badge feature",
                description:
                    "A note on exhausted premieres, apologetic Q-and-As, and the ambition that clings to low-budget debuts.",
                abstract:
                    "A note on exhausted premieres, apologetic Q-and-As, and the ambition that clings to low-budget debuts.",
                category: "Festival Notes",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-26",
                tags: ["festival", "debuts", "reception"],
                rawContentUrl: getContentRawUrl("articles/26-10/body.md"),
                body: "# Festival mornings and the first-badge feature\n\nMorning festival slots can feel punitive, yet they also reveal which films can survive without hype. A debut shown to a tired room often discloses its structure more honestly than an evening premiere.",
            },
        }
    }

    if (articleNumber === "26-11") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-11",
                articleNumber,
                title: "Camcorder sunsets and the family film as accidental cinema",
                description:
                    "How domestic recordings turn weather, waiting, and repetition into forms of unplanned style.",
                abstract:
                    "How domestic recordings turn weather, waiting, and repetition into forms of unplanned style.",
                category: "Amateur Media",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-27",
                tags: ["amateur media", "camcorder", "domestic image"],
                rawContentUrl: getContentRawUrl("articles/26-11/body.md"),
                body: "# Camcorder sunsets and the family film as accidental cinema\n\nThe family video keeps filming long after the event has technically ended. In that surplus duration, weather and hesitation become the real subject.",
            },
        }
    }

    if (articleNumber === "26-12") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-12",
                articleNumber,
                title: "When the actor outruns the frame",
                description:
                    "A short piece on performances that exceed the camera setup built to contain them.",
                abstract:
                    "A short piece on performances that exceed the camera setup built to contain them.",
                category: "Performance",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-28",
                tags: ["performance", "framing", "blocking"],
                rawContentUrl: getContentRawUrl("articles/26-12/body.md"),
                body: "# When the actor outruns the frame\n\nSome performances expose the poverty of a setup by moving faster than the shot was designed to think. The result is not merely bad coverage; it is a mismatch between energy and form.",
            },
        }
    }

    if (articleNumber === "26-13") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-13",
                articleNumber,
                title: "Notebook from the under-attended weekday screening",
                description:
                    "Sparse attendance, loud radiators, and the peculiar intimacy of watching a film with six strangers.",
                abstract:
                    "Sparse attendance, loud radiators, and the peculiar intimacy of watching a film with six strangers.",
                category: "Screening Reports",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-29",
                tags: ["screening", "audience", "notebook"],
                rawContentUrl: getContentRawUrl("articles/26-13/body.md"),
                body: "# Notebook from the under-attended weekday screening\n\nLow attendance changes the ethics of spectatorship. Every cough enters the mix, and the social embarrassment of leaving early becomes part of the evening's form.",
            },
        }
    }

    if (articleNumber === "26-14") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-14",
                articleNumber,
                title: "Video essay without voiceover: a note on arrangement",
                description:
                    "What happens when critical montage has to think through cuts, rhythm, and juxtaposition instead of explanatory speech.",
                abstract:
                    "What happens when critical montage has to think through cuts, rhythm, and juxtaposition instead of explanatory speech.",
                category: "Video Essay",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-30",
                tags: ["video essay", "montage", "form"],
                rawContentUrl: getContentRawUrl("articles/26-14/body.md"),
                body: "# Video essay without voiceover: a note on arrangement\n\nWithout narration, criticism has to migrate into sequencing. The argument is no longer said over the image; it emerges from the pressure one clip places on the next.",
            },
        }
    }

    if (articleNumber === "26-15") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-15",
                articleNumber,
                title: "After the projector jam: notes from an interrupted matinee",
                description:
                    "A small account of delay, apology, and the audience behaviour that emerges when a screening briefly stops being a screening.",
                abstract:
                    "A small account of delay, apology, and the audience behaviour that emerges when a screening briefly stops being a screening.",
                category: "Exhibition Notes",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-03-31",
                tags: ["exhibition", "audience", "projection"],
                rawContentUrl: getContentRawUrl("articles/26-15/body.md"),
                body: "# After the projector jam: notes from an interrupted matinee\n\nThe interruption changed the audience before it changed the screening. People began by looking at the booth, then at each other, and only later back toward the blank screen.\n\nFor a few minutes the event became social in a different register. The room was no longer organised by the film alone, but by the shared embarrassment of waiting politely for machinery to recover.",
            },
        }
    }

    if (articleNumber === "26-16") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-16",
                articleNumber,
                title: "Lav mic rustle and the fantasy of invisible recording",
                description:
                    "On clothing noise, close bodies, and the way low-budget dialogue recording reveals more proximity than the image does.",
                abstract:
                    "On clothing noise, close bodies, and the way low-budget dialogue recording reveals more proximity than the image does.",
                category: "Sound Studies",
                href: `/articles/${articleNumber}`,
                contentType: "pdf",
                authors: ["Editorial Desk"],
                publishDate: "2026-04-01",
                tags: ["sound", "dialogue", "recording"],
                rawContentUrl: getContentRawUrl("articles/26-16/paper.pdf"),
            },
        }
    }

    if (articleNumber === "26-17") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-17",
                articleNumber,
                title: "Festival catalogue adjectives and the language of minor prestige",
                description:
                    "A reading of how small festivals describe difficult films when they want seriousness without scaring off the audience.",
                abstract:
                    "A reading of how small festivals describe difficult films when they want seriousness without scaring off the audience.",
                category: "Festival Notes",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-04-02",
                tags: ["festival", "language", "reception"],
                rawContentUrl: getContentRawUrl("articles/26-17/body.md"),
                body: "# Festival catalogue adjectives and the language of minor prestige\n\nFestival writing often wants to sound selective without sounding forbidding. It therefore leans on a familiar vocabulary of rigour, intimacy, and urgency.\n\nThese adjectives do not merely describe films. They also position the festival itself as tasteful, attentive, and slightly braver than the market surrounding it.",
            },
        }
    }

    if (articleNumber === "26-18") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-18",
                articleNumber,
                title: "Second screening notebook: ten people, one broken subtitle file",
                description:
                    "A brief record of awkward pauses, improvised translation, and the collective patience of a room that chooses to stay.",
                abstract:
                    "A brief record of awkward pauses, improvised translation, and the collective patience of a room that chooses to stay.",
                category: "Screening Reports",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-04-03",
                tags: ["screening", "subtitles", "audience"],
                rawContentUrl: getContentRawUrl("articles/26-18/body.md"),
                body: "# Second screening notebook: ten people, one broken subtitle file\n\nOnce the subtitles failed, the audience began reading each other instead. Shrugs, whispered summaries, and half-remembered vocabulary replaced the official text.\n\nWhat followed was less accessible and oddly more communal. The screening survived because the room agreed, without saying so, to do some of the work itself.",
            },
        }
    }

    if (articleNumber === "26-19") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-19",
                articleNumber,
                title: "MiniDV birthdays and the accidental theory of zooming in too late",
                description:
                    "How domestic camera mistakes become a style of lateness, hesitation, and emotional correction.",
                abstract:
                    "How domestic camera mistakes become a style of lateness, hesitation, and emotional correction.",
                category: "Amateur Media",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-04-04",
                tags: ["amateur media", "MiniDV", "domestic image"],
                rawContentUrl: getContentRawUrl("articles/26-19/body.md"),
                body: "# MiniDV birthdays and the accidental theory of zooming in too late\n\nThe late zoom is one of the home video camera's most revealing mistakes. It shows recognition happening after the moment has already begun to pass.\n\nWhat looks clumsy is also a record of care catching up with itself. The operator notices emotion slightly too late, and the image hurries to compensate.",
            },
        }
    }

    if (articleNumber === "26-20") {
        return {
            siteTitle: siteConfig.name,
            article: {
                id: "26-20",
                articleNumber,
                title: "Fog machine notes for the impossible warehouse scene",
                description:
                    "On borrowed industrial space, cheap atmosphere, and the technical labour required to make thin resources look deliberate.",
                abstract:
                    "On borrowed industrial space, cheap atmosphere, and the technical labour required to make thin resources look deliberate.",
                category: "Production Notes",
                href: `/articles/${articleNumber}`,
                contentType: "markdown",
                authors: ["Editorial Desk"],
                publishDate: "2026-04-05",
                tags: ["production", "atmosphere", "low-budget"],
                rawContentUrl: getContentRawUrl("articles/26-20/body.md"),
                body: "# Fog machine notes for the impossible warehouse scene\n\nAtmosphere is often cheaper than architecture. A warehouse becomes cinematic not by being transformed completely, but by being partially obscured.\n\nThe fog machine therefore does technical and ideological work at once. It hides shortage while advertising intention, letting low-budget production masquerade as visual conviction.",
            },
        }
    }

    return null
}

export async function loadArticlePageData(
    articleNumber: string
): Promise<ArticlePageData | null> {
    try {
        const rootIndex = await fetchJson<RootContentIndex>(
            CONTENT_ROOT_FILES.index
        )

        if (rootIndex.version !== CONTENT_SYSTEM_VERSION) {
            throw new Error(`Unsupported content version: ${rootIndex.version}`)
        }

        const articleIndex = await fetchJson<ArticleIndex>(
            CONTENT_ROOT_FILES.articlesIndex
        )
        const hasArticle = articleIndex.items.includes(articleNumber)

        if (!hasArticle) {
            return null
        }

        const article = await fetchJson<RawArticleRecord>(
            getArticleMetadataPath(articleNumber)
        ).then(normalizeArticleRecord)
        const homeArticle = toHomeArticle(article)
        const rawContentUrl = toRawContentUrl(article.content.path)

        const body =
            article.content.type === "markdown"
                ? await fetchText(article.content.path)
                : undefined

        return {
            siteTitle: rootIndex.homepage.title,
            article: {
                ...homeArticle,
                abstract: article.abstract,
                authors: article.authors,
                publishDate: article.publishDate,
                tags: article.tags,
                discussionUrl: article.discussion?.discussionUrl,
                rawContentUrl,
                body,
            },
        }
    } catch {
        return getFallbackArticlePageData(articleNumber)
    }
}

export async function loadArticleNotFoundPageData(): Promise<ArticleNotFoundPageData> {
    const articlesPageData = await loadArticlesPageData()

    return {
        pageDescription: staticCopy.articles.notFound.pageDescription,
        headerTitle: staticCopy.articles.notFound.headerTitle,
        headerDescription: staticCopy.articles.notFound.headerDescription,
        recommendationsTitle: staticCopy.articles.notFound.recommendationsTitle,
        recommendationsDescription:
            staticCopy.articles.notFound.recommendationsDescription,
        recommendedArticles: articlesPageData.hottestArticles.slice(0, 3),
    }
}
