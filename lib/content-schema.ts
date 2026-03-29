export const CONTENT_SYSTEM_VERSION = "1.0.0"

export type GithubRepositoryPointer = {
  provider: "github"
  owner: string
  repo: string
  url: string
  defaultBranch: string
}

export type ContentEntryPointer = {
  id: string
  handle: string
  path: string
}

export type ArticleEntryPointer = {
  id: string
  articleNumber: string
  path: string
}

export type RootContentIndex = {
  version: string
  homepage: {
    title: string
    description: string
    featuredJournalId: string
    featuredArticleIds: string[]
  }
  sections: {
    journals: {
      path: string
    }
    articles: {
      path: string
    }
  }
}

export type JournalIndex = {
  featured: string
  items: ContentEntryPointer[]
}

export type ArticleIndex = {
  featured?: string
  categoriesPath?: string
  items: ArticleEntryPointer[]
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
  handle: string
  title: string
  issueLabel: string
  summary: string
  status: "draft" | "published"
  publishDate?: string
  articleIds: string[]
  discussion?: DiscussionReference
  coverImage?: string
}

export const CONTENT_ROOT_FILES = {
  index: "index.json",
  journalsIndex: "journals/index.json",
  articlesIndex: "articles/index.json",
} as const
