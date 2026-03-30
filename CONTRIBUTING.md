# Contributing

This document is for people working on the codebase or maintaining the content system.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
```

## Content Model

The project uses a convention-based content system.

- root index: `index.json`
- standalone article index: `articles/index.json`
- article category index: `articles/index.category.json`
- article metadata: `articles/<articleNumber>/metadata.json`
- journal index: `journals/index.json`
- journal metadata: `journals/<issue>/metadata.json`
- journal issue index: `journals/<issue>/index.json`
- journal entry PDF: `journals/<issue>/<entryNumber>.pdf`
- dynamic notices: `information.json`

More detail is in [CONTENT_SYSTEM.md](/Users/suzixuan/我的/Experimental%20Project/lowest-film-journal/CONTENT_SYSTEM.md).

## Standalone Articles

Standalone articles use:

- `description` for cards, listings, and compact views
- `abstract` for larger reading contexts such as the article header and `Latest Article`
- `content.type` of `markdown` or `pdf`

Article identity is based on `articleNumber`.

Examples:

- `26-01`
- `26-12`
- `26-105`

Displayed article codes are prefixed in the UI as `MPA-26-01`, but the stored content id remains `26-01`.

## Journal Issues

Journal issues are separate from standalone articles.

- issue code format in data: `26-3`
- displayed issue code: `MPJ-26-3`
- issue route: `/journals/26-3`
- issue entry route: `/journals/26-3/1`

Journal entries do not use Markdown. They are read through issue PDFs and are indexed per issue.

## Development Content Flow

In development mode, the app prefers local content from `content-sample/`.

That means:

- JSON indexes are read from `content-sample/` when available
- Markdown bodies are read from `content-sample/` when available
- PDF links are served through the local development route

If a local file does not exist, the loader falls back to the configured GitHub content repository.

`content-sample/` is ignored by git. It is intended as a local mirror or draft shape for the real content repository.

## Remote Content Repository

Production content is configured in code, not in the content repo itself.

Current repository target:

- owner: `moldy-potato-journal`
- repo: `content`

See:

- [lib/content-source.ts](/Users/suzixuan/我的/Experimental%20Project/lowest-film-journal/lib/content-source.ts)

## Static Generation

The site is set up to prerender the main routes and generate content pages statically where possible.

Current static behaviour:

- `/`
- `/articles`
- `/journals`
- `/status`
- `/submit`

Current SSG behaviour:

- `/articles/[articleNumber]`
- `/journals/[issue]`
- `/journals/[issue]/[article]`

The only route that remains dynamic by design is:

- `/api/content/[...path]`

That route is used in development so local sample files can behave like a content source without requiring the remote GitHub repository.

## Project Structure

```text
app/
  articles/
  journals/
  status/
  submit/
  api/content/[...path]/
components/
  articles/
  home/
  journals/
  layout/
  status/
  ui/
lib/
  content-loader.ts
  content-schema.ts
  content-source.ts
  home-content.ts
content-sample/
```

## Working Rules

- `information.json` is only for dynamic notices, not stable site copy.
- The site uses 4-space indentation.
- UI primitives should come from shadcn/ui rather than ad hoc component shells.
