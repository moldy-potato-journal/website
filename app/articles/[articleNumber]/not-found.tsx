import { ArticleNotFoundSection } from "@/components/articles/article-not-found-section"
import { JournalHeader } from "@/components/layout/journal-header"
import { loadArticleNotFoundPageData } from "@/lib/content-loader"

export const dynamic = "force-dynamic"

export default async function ArticleNotFound() {
  const { recommendedArticles } = await loadArticleNotFoundPageData()

  return (
    <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <JournalHeader
          title="Articles"
          description="Single articles published outside the journal issue, arranged for browsing, reading, and citation."
          links={[
            { href: "/", label: "Home" },
            { href: "/articles", label: "Articles" },
          ]}
        />

        <ArticleNotFoundSection recommendedArticles={recommendedArticles} />
      </div>
    </main>
  )
}
