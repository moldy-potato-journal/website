import type { GithubRepositoryPointer } from "@/lib/content-schema"

export const CONTENT_REPOSITORY: GithubRepositoryPointer = {
  provider: "github",
  owner: "moldy-potato-journal",
  repo: "content",
  url: "https://github.com/moldy-potato-journal/content",
  defaultBranch: "main",
}

export const CONTENT_RAW_BASE_URL = `https://raw.githubusercontent.com/${CONTENT_REPOSITORY.owner}/${CONTENT_REPOSITORY.repo}/${CONTENT_REPOSITORY.defaultBranch}`

export function getContentRawUrl(path: string) {
  return `${CONTENT_RAW_BASE_URL}/${path.replace(/^\.\//, "")}`
}

export const CONTENT_DISCUSSION_CATEGORIES = {
  journal: "Journals",
  article: "Articles",
} as const

export const CONTENT_BRANCH_POLICY = {
  submissionBaseBranch: "main",
  submissionBranchPrefix: "submission/",
  journalBranchPrefix: "journal/",
} as const
