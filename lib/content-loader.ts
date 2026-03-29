import {
  type ArticleCategoryIndex,
  type ArticleIndex,
  type ArticleEntryPointer,
  type ArticleRecord,
  CONTENT_ROOT_FILES,
  CONTENT_SYSTEM_VERSION,
  type JournalIndex,
  type JournalRecord,
  type RootContentIndex,
} from "@/lib/content-schema"
import {
  CONTENT_BRANCH_POLICY,
  CONTENT_REPOSITORY,
  getContentRawUrl,
} from "@/lib/content-source"
import {
  briefs as fallbackBriefs,
  standaloneArticles as fallbackArticles,
} from "@/lib/home-content"
import { isValidArticleNumber } from "@/lib/article-number"
import { siteConfig } from "@/lib/site"

export type HomeBrief = {
  label: string
  title: string
  body: string
}

export type HomeJournal = {
  id: string
  handle: string
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
  summary: string
  category: string
  href: string
  contentType: "markdown" | "pdf"
}

export type HomePageData = {
  title: string
  description: string
  briefs: HomeBrief[]
  submission: {
    title: string
    body: string
    repoUrl: string
    branchPrefix: string
    submitHref: string
    guidelinesHref: string
  }
  latestJournal: HomeJournal
  articles: HomeArticle[]
}

export type ArticlesPageData = {
  title: string
  description: string
  hottestArticles: HomeArticle[]
  latestArticle: HomeArticle
  latestArticleAbstract: string
  groupedArticles: Array<{
    category: string
    items: HomeArticle[]
  }>
}

export type ArticlePageData = {
  siteTitle: string
  article: HomeArticle & {
    authors: string[]
    publishDate?: string
    tags: string[]
    discussionUrl?: string
    rawContentUrl: string
    body?: string
  }
}

export type ArticleNotFoundPageData = {
  recommendedArticles: HomeArticle[]
}

function normalizePath(path: string) {
  return path.replace(/^\.\//, "")
}

function toRawContentUrl(path: string) {
  return getContentRawUrl(normalizePath(path))
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(toRawContentUrl(path), {
    next: { revalidate: 300 },
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch content at ${path}: ${response.status}`)
  }

  return response.json() as Promise<T>
}

async function fetchText(path: string): Promise<string> {
  const response = await fetch(toRawContentUrl(path), {
    next: { revalidate: 300 },
    headers: {
      Accept: "text/plain",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch content at ${path}: ${response.status}`)
  }

  return response.text()
}

function findEntryById<T extends { id: string }>(
  items: readonly T[],
  id: string
) {
  return items.find((item) => item.id === id)
}

function formatFallbackArticleNumber(index: number) {
  return `26-${String(index + 1).padStart(2, "0")}`
}

function getFallbackHomePageData(): HomePageData {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
    briefs: [...fallbackBriefs],
    submission: {
      title: "Submit via GitHub Pull Request",
      body: "Contributors can propose new writing through pull requests to the content repository. Journal-bound pieces may be collected on dedicated journal branches before publication.",
      repoUrl: CONTENT_REPOSITORY.url,
      branchPrefix: CONTENT_BRANCH_POLICY.submissionBranchPrefix,
      submitHref: `${CONTENT_REPOSITORY.url}/compare`,
      guidelinesHref: CONTENT_REPOSITORY.url,
    },
    latestJournal: {
      id: "fallback-journal",
      handle: "spring-issue-01",
      title: siteConfig.issue,
      issueLabel: siteConfig.issue,
      summary:
        "A first issue on film rot, campus screenings, and late-night notebook criticism.",
      href: "/journals",
      archiveHref: "/journals",
      entries: [
        "On damp cellars and damaged reels",
        "Three arguments for the campus screening room",
        "Notebook: melodrama after midnight",
      ],
    },
    articles: fallbackArticles.map((article, index) => ({
      id: formatFallbackArticleNumber(index),
      articleNumber: formatFallbackArticleNumber(index),
      title: article.title,
      summary: article.summary,
      category: article.category,
      href: `/articles/${formatFallbackArticleNumber(index)}`,
      contentType: "markdown",
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
    summary: article.summary,
    category: article.category,
    href: `/articles/${article.articleNumber}`,
    contentType: article.content.type,
  }
}

function sortByPublishDateDescending<T extends { publishDate?: string }>(
  items: T[]
) {
  return [...items].sort((left, right) => {
    const leftValue = left.publishDate ? Date.parse(left.publishDate) : 0
    const rightValue = right.publishDate ? Date.parse(right.publishDate) : 0

    return rightValue - leftValue
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
            publishedArticles.find((article) => article.id === articleId)
          )
          .filter((article): article is ArticleRecord => Boolean(article))
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
    const category = article.category || "Uncategorized"
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
    const rootIndex = await fetchJson<RootContentIndex>(
      CONTENT_ROOT_FILES.index
    )

    if (rootIndex.version !== CONTENT_SYSTEM_VERSION) {
      throw new Error(`Unsupported content version: ${rootIndex.version}`)
    }

    const [journalIndex, articleIndex] = await Promise.all([
      fetchJson<JournalIndex>(rootIndex.sections.journals.path),
      fetchJson<ArticleIndex>(rootIndex.sections.articles.path),
    ])

    const featuredJournalPointer =
      findEntryById(journalIndex.items, rootIndex.homepage.featuredJournalId) ??
      findEntryById(journalIndex.items, journalIndex.featured) ??
      journalIndex.items[0]

    if (!featuredJournalPointer) {
      throw new Error("No journal entries found in content index")
    }

    const featuredJournal = await fetchJson<JournalRecord>(
      featuredJournalPointer.path
    )

    const journalArticlePointers = featuredJournal.articleIds
      .map((articleId) => findEntryById(articleIndex.items, articleId))
      .filter((item): item is ArticleEntryPointer => Boolean(item))

    const journalArticles = await Promise.all(
      journalArticlePointers.map((pointer) =>
        fetchJson<ArticleRecord>(pointer.path)
      )
    )

    const featuredArticlePointers = rootIndex.homepage.featuredArticleIds
      .map((articleId) => findEntryById(articleIndex.items, articleId))
      .filter((item): item is ArticleEntryPointer => Boolean(item))

    const featuredArticles = await Promise.all(
      featuredArticlePointers.map((pointer) =>
        fetchJson<ArticleRecord>(pointer.path)
      )
    )

    return {
      title: rootIndex.homepage.title,
      description: rootIndex.homepage.description,
      briefs: buildBriefs(
        featuredJournal,
        journalIndex.items.length,
        articleIndex.items.length
      ),
      submission: {
        title: "Submit through GitHub pull requests",
        body: "Open a PR against the content repository. Standalone articles can merge to main, while issue-bound pieces can be accumulated on a journal branch before release.",
        repoUrl: CONTENT_REPOSITORY.url,
        branchPrefix: CONTENT_BRANCH_POLICY.submissionBranchPrefix,
        submitHref: `${CONTENT_REPOSITORY.url}/compare`,
        guidelinesHref: CONTENT_REPOSITORY.url,
      },
      latestJournal: {
        id: featuredJournal.id,
        handle: featuredJournal.handle,
        title: featuredJournal.title,
        issueLabel: featuredJournal.issueLabel,
        summary: featuredJournal.summary,
        href: "/journals",
        archiveHref: "/journals",
        entries: journalArticles.map((article) => article.title),
      },
      articles: featuredArticles.map((article) => ({
        ...toHomeArticle(article),
      })),
    }
  } catch {
    return getFallbackHomePageData()
  }
}

function getFallbackArticlesPageData(): ArticlesPageData {
  const home = getFallbackHomePageData()
  const hottestArticles = home.articles.slice(0, 2)
  const latestArticle = home.articles[0]
  const groupedArticles = [
    {
      category: "Film Analysis",
      items: home.articles.filter((article) => article.category === "Film Analysis"),
    },
    {
      category: "Student Film",
      items: home.articles.filter((article) => article.category === "Student Film"),
    },
  ].filter((group) => group.items.length > 0)

  return {
    title: home.title,
    description: home.description,
    hottestArticles,
    latestArticle,
    latestArticleAbstract: latestArticle.summary,
    groupedArticles,
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
      rootIndex.sections.articles.path
    )
    const articleCategoryIndex = articleIndex.categoriesPath
      ? await fetchJson<ArticleCategoryIndex>(articleIndex.categoriesPath)
      : undefined
    const articleRecords = await Promise.all(
      articleIndex.items.map((pointer) =>
        fetchJson<ArticleRecord>(pointer.path)
      )
    )

    const publishedArticles = sortByPublishDateDescending(
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
      description: rootIndex.homepage.description,
      hottestArticles,
      latestArticle: toHomeArticle(latestArticle),
      latestArticleAbstract: latestArticle.summary,
      groupedArticles: buildGroupedArticlesFromRecords(
        publishedArticles,
        articleCategoryIndex
      ),
    }
  } catch {
    return getFallbackArticlesPageData()
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
        summary:
          "A short argument for leaving visible damage, noise, and material history in the frame.",
        category: "Film Analysis",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-29",
        tags: ["restoration", "materiality", "criticism"],
        rawContentUrl: getContentRawUrl(
          "articles/against-clean-restoration/body.md"
        ),
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
        summary:
          "On why low-budget filmmakers keep returning to hallways, thresholds, and fluorescent suspense.",
        category: "Student Film",
        href: `/articles/${articleNumber}`,
        contentType: "pdf",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-29",
        tags: ["student cinema", "space", "mise-en-scene"],
        rawContentUrl: getContentRawUrl(
          "articles/the-corridor-shot-as-student-cinema-theology/paper.pdf"
        ),
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
        summary:
          "Fragments on atmosphere, boredom, weather, and the accidental rhythms of programming.",
        category: "Film Analysis",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-28",
        tags: ["viewing diary", "programming", "criticism"],
        rawContentUrl: getContentRawUrl("articles/viewing-diary-five-rainy-screenings/body.md"),
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
        summary:
          "A note on why static framing in student productions often signals anxiety rather than control.",
        category: "Student Film",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-27",
        tags: ["student film", "framing", "pedagogy"],
        rawContentUrl: getContentRawUrl("articles/the-tripod-as-moral-problem/body.md"),
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
        summary:
          "How institutional interiors become an accidental style in films made with borrowed locations.",
        category: "Student Film",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-26",
        tags: ["student film", "location", "production design"],
        rawContentUrl: getContentRawUrl("articles/cafeteria-realism/body.md"),
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
        summary:
          "On rough delivery, unfinished timing, and the documentary pressure of performance before polish.",
        category: "Student Film",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-25",
        tags: ["performance", "student film", "editing"],
        rawContentUrl: getContentRawUrl("articles/why-the-rehearsal-take/body.md"),
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
        summary:
          "A small record of lamp heat, misthreading, and the strange authority of whoever stays after the audience leaves.",
        category: "Exhibition Notes",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-24",
        tags: ["exhibition", "projection", "campus screening"],
        rawContentUrl: getContentRawUrl("articles/projection-booth-notes/body.md"),
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
        summary:
          "Why over-cleaned student audio can erase the environment that made a scene believable in the first place.",
        category: "Sound Studies",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-23",
        tags: ["sound", "dialogue", "post-production"],
        rawContentUrl: getContentRawUrl("articles/hiss-room-tone/body.md"),
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
        summary:
          "On handwritten tape labels, damp shelving, and the practical labour behind keeping non-canonical film culture legible.",
        category: "Archive Notes",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-22",
        tags: ["archive", "preservation", "labour"],
        rawContentUrl: getContentRawUrl("articles/box-labels-mildew/body.md"),
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
        summary:
          "A note on exhausted premieres, apologetic Q-and-As, and the ambition that clings to low-budget debuts.",
        category: "Festival Notes",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-21",
        tags: ["festival", "debuts", "reception"],
        rawContentUrl: getContentRawUrl("articles/festival-mornings/body.md"),
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
        summary:
          "How domestic recordings turn weather, waiting, and repetition into forms of unplanned style.",
        category: "Amateur Media",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-20",
        tags: ["amateur media", "camcorder", "domestic image"],
        rawContentUrl: getContentRawUrl("articles/camcorder-sunsets/body.md"),
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
        summary:
          "A short piece on performances that exceed the camera setup built to contain them.",
        category: "Performance",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-19",
        tags: ["performance", "framing", "blocking"],
        rawContentUrl: getContentRawUrl("articles/actor-outruns-the-frame/body.md"),
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
        summary:
          "Sparse attendance, loud radiators, and the peculiar intimacy of watching a film with six strangers.",
        category: "Screening Reports",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-18",
        tags: ["screening", "audience", "notebook"],
        rawContentUrl: getContentRawUrl("articles/weekday-screening-notebook/body.md"),
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
        summary:
          "What happens when critical montage has to think through cuts, rhythm, and juxtaposition instead of explanatory speech.",
        category: "Video Essay",
        href: `/articles/${articleNumber}`,
        contentType: "markdown",
        authors: ["Editorial Desk"],
        publishDate: "2026-03-17",
        tags: ["video essay", "montage", "form"],
        rawContentUrl: getContentRawUrl("articles/video-essay-without-voiceover/body.md"),
        body: "# Video essay without voiceover: a note on arrangement\n\nWithout narration, criticism has to migrate into sequencing. The argument is no longer said over the image; it emerges from the pressure one clip places on the next.",
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
      rootIndex.sections.articles.path
    )
    const articlePointer = articleIndex.items.find(
      (item) => item.articleNumber === articleNumber
    )

    if (!articlePointer) {
      return null
    }

    const article = await fetchJson<ArticleRecord>(articlePointer.path)
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
    recommendedArticles: articlesPageData.hottestArticles.slice(0, 3),
  }
}
