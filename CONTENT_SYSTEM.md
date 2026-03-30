# Content System

This content system is intentionally narrow: the GitHub content repository stores only publication content.

## Core Rules

- GitHub repository connection details are hardcoded in application code.
- The content repository does not store site settings, navigation, or integration setup.
- The root `index.json` is the only required entry point.
- Directory nodes use `index.json`.
- Individual content records use `metadata.json`.
- The root `index.json` contains only homepage-facing metadata.

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
- standalone article source files, where each article chooses either Markdown or PDF
- issue PDF files for journal releases

## Root Index Contract

The root `index.json` should contain:

- `version`
- `homepage.title`
- `homepage.description`
- `homepage.featuredJournalId`
- `homepage.featuredArticleIds`

The root file is not meant to duplicate the full site configuration. It acts as
the homepage entry node only. Deeper indexes are loaded from fixed conventional
paths.

## Publishing Workflow

### Standalone article

1. A contributor opens a PR against the content repository.
2. The PR adds or edits one article folder under `articles/`.
3. If accepted as a standalone piece, it merges into `main`.

### Journal issue

1. A contributor opens a PR against the content repository.
2. Accepted issue-bound work can be merged into a branch such as `journal/26-3`.
3. The issue editor updates `journals/<issue>/metadata.json`.
4. When the issue is complete, that branch merges back into `main`.

## Suggested Repository Shape

```text
index.json
articles/
  index.json
  index.category.json
  26-01/
    metadata.json
    body.md or paper.pdf
journals/
  index.json
  26-3/
    index.json
    metadata.json
    1.pdf
    2.pdf
```

## Why This Shape

- small enough to reason about
- stable for GitHub-based publishing
- easy to fetch from Next.js
- easy to migrate later if richer tooling is needed

## Journal Issue Numbering

Each journal record should include an `issue` field.

Format:

- `yy-issueNumber`
- `yy` is the last two digits of the publication year
- `issueNumber` can stay unpadded

Examples:

- `26-1`
- `26-3`

The public issue code shown in the interface is prefixed as:

- `MPJ-26-3`

The journal route omits the prefix and uses the shorter issue segment:

- `/journals/26-3`
- `/journals/26-3/13`

In the second route, `13` means the thirteenth article inside that issue rather
than the standalone article number.

## Journal Entry Semantics

Standalone articles and journal entries are separate systems.

- standalone articles live under `articles/`
- journal entries live inside a journal record under `journals/<issue>/metadata.json`
- journal entries are indexed by `journals/<issue>/index.json`
- journal entries do not point back to standalone article records
- journal entries are always read through the issue PDF
- journal entry routes point to a numbered entry inside the issue, not to an `articleNumber`

Each journal issue folder should include:

- `metadata.json`
- `index.json`
- one PDF per entry, stored directly in the journal folder as `[number].pdf`

The issue `index.json` should include only `items`.

Each journal entry in that issue index should include:

- `entryNumber`
- `title`
- `summary`
- `authors`
- `tags`
- `pages.start`
- `pages.end`

The frontend should treat `/journals/26-3/13` as:

- issue `26-3`
- entry `13`
- a dedicated PDF file for that journal entry

## Article Content Type

Each article record should use a single `content` object.

- `content.type` is either `markdown` or `pdf`
- `content.path` points to the chosen source file

This means one article chooses one primary source representation. The intended frontend behaviour is:

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
- article list indexes store article numbers only
- no extra article handle is required
- article folder names should also use `articleNumber`

The resulting semantics are:

- `index.json` means directory index
- `metadata.json` means single record metadata
- `articleNumber` means article identity

## Article Categories

If you want categories to be explicit in the content graph rather than inferred at render time,
use the conventional `articles/index.category.json`.

- `articles/index.category.json` stores the ordered category list
- each category entry declares its `title` and `articleIds`

This lets the application render one card per declared category, in a stable order,
without depending on incidental grouping logic.

## Article Folder Naming

Article directories should use `articleNumber` as the folder name.

Examples:

- `articles/26-01/metadata.json`
- `articles/26-02/paper.pdf`

This keeps the repository easier to scan and avoids tying filesystem structure
to article titles.

## Conventional Paths

Paths to the next node should not be stored redundantly inside indexes when the
filesystem structure is already fixed.

- root content index: `index.json`
- article index: `articles/index.json`
- article category index: `articles/index.category.json`
- article metadata: `articles/<articleNumber>/metadata.json`
- journal index: `journals/index.json`
- journal metadata: `journals/<issue>/metadata.json`
- journal issue index: `journals/<issue>/index.json`
- journal entry PDF: `journals/<issue>/<entryNumber>.pdf`
