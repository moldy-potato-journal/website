# Content System

This content system is intentionally narrow: the GitHub content repository stores only publication content.

## Core Rules

- GitHub repository connection details are hardcoded in application code.
- The content repository does not store site settings, navigation, or integration setup.
- The root `index.json` is the only required entry point.
- Directory nodes use `index.json`.
- Individual content records use `metadata.json`.
- The root `index.json` contains basic homepage-facing metadata and pointers to deeper content indexes.

## What Lives In Code

These values belong in the app codebase, not in the content repository:

- content repository owner and repo name
- default branch
- submission branch prefix
- journal branch prefix
- GitHub Discussions category conventions

See:

- `lib/content-source.ts`

## What Lives In The Content Repository

Only publication data:

- root content index
- journal index
- article index
- individual journal records
- individual article records
- article source files, where each article chooses either Markdown or PDF

## Root Index Contract

The root `index.json` should contain:

- `version`
- `homepage.title`
- `homepage.description`
- `homepage.featuredJournalId`
- `homepage.featuredArticleIds`
- `sections.journals.path`
- `sections.articles.path`

The root file is not meant to duplicate the full site configuration. It acts as the homepage entry node plus a router to deeper content nodes.

## Publishing Workflow

### Standalone article

1. A contributor opens a PR against the content repository.
2. The PR adds or edits one article folder under `articles/`.
3. If accepted as a standalone piece, it merges into `main`.

### Journal issue

1. A contributor opens a PR against the content repository.
2. Accepted issue-bound work can be merged into a branch such as `journal/spring-issue-01`.
3. The issue editor updates `journals/<issue-handle>/metadata.json`.
4. When the issue is complete, that branch merges back into `main`.

## Suggested Repository Shape

```text
index.json
articles/
  index.json
  index.category.json
  article-handle/
    metadata.json
    body.md or paper.pdf
journals/
  index.json
  issue-handle/
    metadata.json
```

## Why This Shape

- small enough to reason about
- stable for GitHub-based publishing
- easy to fetch from Next.js
- easy to migrate later if richer tooling is needed

## Article Content Type

Each article record should use a single `content` object.

- `content.type` is either `markdown` or `pdf`
- `content.path` points to the chosen source file

This means one article chooses one primary source representation. The intended frontend behavior is:

- render Markdown inline when `type` is `markdown`
- offer a PDF-oriented reader or download action when `type` is `pdf`

## Article Numbering

Each article record should also include `articleNumber`.

Format:

- `yy-number`
- `yy` is the last two digits of the publication year
- `number` must use at least two digits
- `number` is not capped at two digits, so values such as `26-01`, `26-12`, and `26-105` are all valid

Examples:

- `26-01`
- `26-02`
- `26-120`

## Article Identity

For article records, `id` should be the same value as `articleNumber`.

- article metadata uses `id === articleNumber`
- article list indexes bind `id`, `articleNumber`, and `path`
- no extra article handle is required

The resulting semantics are:

- `index.json` means directory index
- `metadata.json` means single record metadata
- `articleNumber` means article identity

## Article Categories

If you want categories to be explicit in the content graph rather than inferred at render time,
`articles/index.json` can point to a dedicated category index.

- `articles/index.json` may include `categoriesPath`
- `articles/index.category.json` stores the ordered category list
- each category entry declares its `title` and `articleIds`

This lets the application render one card per declared category, in a stable order,
without depending on incidental grouping logic.
