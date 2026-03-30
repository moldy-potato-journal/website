export const CONTENT_SYSTEM_VERSION = "1.0.0"

export type GithubRepositoryPointer = {
    provider: "github"
    owner: string
    repo: string
    url: string
    defaultBranch: string
}

export type RootContentIndex = {
    version: string
    homepage: {
        title: string
        description: string
        featuredJournalId: string
        featuredArticleIds: string[]
    }
}

export type InformationContent = {
    homepage: {
        frontMatter: {
            briefs: ReadonlyArray<{
                label: string
                title: string
                body: string
            }>
            submission: {
                title: string
                body: string
            }
        }
    }
}

export type JournalIndex = {
    featured: string
    items: string[]
}

export type JournalIssueIndex = {
    items: JournalEntryPointer[]
}

export type JournalEntryPointer = {
    entryNumber: string
    title: string
    summary: string
    authors: string[]
    tags: string[]
    pages: {
        start: number
        end: number
    }
}

export type ArticleIndex = {
    featured?: string
    items: string[]
}

export type ArticleCategoryEntry = {
    id: string
    title: string
    articleIds: string[]
}

export type ArticleCategoryIndex = {
    items: ArticleCategoryEntry[]
}

export type DiscussionReference = {
    provider: "github-discussions"
    category: string
    discussionNumber?: number
    discussionUrl?: string
}

export type ArticleContent = {
    type: "markdown" | "pdf"
    path: string
}

export type ArticleRecord = {
    kind: "article"
    id: string
    articleNumber: string
    title: string
    summary: string
    category: string
    status: "draft" | "published"
    publishDate?: string
    authors: string[]
    tags: string[]
    discussion?: DiscussionReference
    content: ArticleContent
}

export type JournalRecord = {
    kind: "journal"
    id: string
    issue: string
    title: string
    issueLabel: string
    summary: string
    status: "draft" | "published"
    publishDate?: string
    discussion?: DiscussionReference
    coverImage?: string
}

export const CONTENT_ROOT_FILES = {
    index: "index.json",
    information: "information.json",
    journalsIndex: "journals/index.json",
    articlesIndex: "articles/index.json",
} as const
