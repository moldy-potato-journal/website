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
import { staticCopy } from "@/lib/home-content"
import {
    compareArticleNumbers,
    isValidArticleNumber,
} from "@/lib/article-number"

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
        cache: "force-cache",
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
        cache: "force-cache",
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
    return fetchJson<InformationContent>(CONTENT_ROOT_FILES.information)
}

async function loadArticleRecords() {
    const articleIndex = await fetchJson<ArticleIndex>(
        CONTENT_ROOT_FILES.articlesIndex
    )
    const articleRecords = await Promise.all(
        articleIndex.items.map((articleNumber) =>
            fetchJson<RawArticleRecord>(
                getArticleMetadataPath(articleNumber)
            ).then(normalizeArticleRecord)
        )
    )

    return {
        articleIndex,
        articleRecords,
    }
}

async function loadJournalResources() {
    const journalIndex = await fetchJson<JournalIndex>(
        CONTENT_ROOT_FILES.journalsIndex
    )
    const journalResources = await Promise.all(
        journalIndex.items.map((issue) => loadJournalIssueResources(issue))
    )

    return {
        journalIndex,
        journalResources,
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

export async function loadHomePageData(): Promise<HomePageData | null> {
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
        return null
    }
}

export async function loadArticlesPageData(): Promise<ArticlesPageData | null> {
    try {
        const rootIndex = await fetchJson<RootContentIndex>(
            CONTENT_ROOT_FILES.index
        )

        if (rootIndex.version !== CONTENT_SYSTEM_VERSION) {
            throw new Error(`Unsupported content version: ${rootIndex.version}`)
        }

        const { articleRecords } = await loadArticleRecords()
        const articleCategoryIndex = await fetchJson<ArticleCategoryIndex>(
            getArticleCategoryIndexPath()
        ).catch(() => undefined)

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
        return null
    }
}

export async function loadJournalsPageData(): Promise<JournalsPageData | null> {
    try {
        const { journalResources } = await loadJournalResources()

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
        return null
    }
}

export async function loadArticleStaticParams(): Promise<
    Array<{ articleNumber: string }>
> {
    try {
        const { articleIndex } = await loadArticleRecords()

        return articleIndex.items.map((articleNumber) => ({
            articleNumber,
        }))
    } catch {
        return []
    }
}

export async function loadJournalIssueStaticParams(): Promise<
    Array<{ issue: string }>
> {
    try {
        const { journalIndex } = await loadJournalResources()

        return journalIndex.items.map((issue) => ({
            issue,
        }))
    } catch {
        return []
    }
}

export async function loadJournalEntryStaticParams(
    issue?: string
): Promise<Array<{ issue: string; article: string }>> {
    try {
        const { journalResources } = await loadJournalResources()
        const matchingResources = issue
            ? journalResources.filter(
                  (resource) => resource.journal.issue === issue
              )
            : journalResources

        return matchingResources.flatMap(({ journal, issueIndex }) =>
            issueIndex.items.map((entry) => ({
                issue: journal.issue,
                article: entry.entryNumber,
            }))
        )
    } catch {
        return []
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
        return null
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
        return null
    }
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
        return null
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
        recommendedArticles:
            articlesPageData?.hottestArticles.slice(0, 3) ?? [],
    }
}
