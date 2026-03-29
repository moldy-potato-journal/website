import { ArticleCategoryColumns } from "@/components/articles/article-category-columns"
import { ArticleSpotlight } from "@/components/articles/article-spotlight"
import { JournalHeader } from "@/components/layout/journal-header"
import { loadArticlesPageData } from "@/lib/content-loader"

export const dynamic = "force-dynamic"

type ArticlesPageProps = {
  searchParams: Promise<{
    category?: string
  }>
}

function normalizeCategory(category: string) {
  return category.trim().toLowerCase()
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const articlesPageData = await loadArticlesPageData()
  const { category } = await searchParams
  const selectedCategory = category?.trim() || null
  const selectedGroup = selectedCategory
    ? articlesPageData.groupedArticles.find(
        (group) =>
          normalizeCategory(group.category) === normalizeCategory(selectedCategory)
      ) ?? null
    : null
  const isCategoryView = Boolean(selectedCategory)
  const headerDescription = selectedGroup
    ? `Published articles in ${selectedGroup.category}.`
    : selectedCategory
      ? `No published article category matches ${selectedCategory}.`
      : "Single articles published outside the journal issue, arranged for browsing, reading, and citation."

  return (
    <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <JournalHeader
          title="Articles"
          description={headerDescription}
          links={[
            { href: "/", label: "Home" },
            { href: "/articles", label: "Articles" },
            { href: "#article-categories", label: "Categories" },
          ]}
        />

        {isCategoryView ? null : (
          <ArticleSpotlight
            hottestArticles={articlesPageData.hottestArticles}
            latestArticle={articlesPageData.latestArticle}
            latestArticleAbstract={articlesPageData.latestArticleAbstract}
          />
        )}

        <ArticleCategoryColumns
          groupedArticles={articlesPageData.groupedArticles}
          selectedCategory={selectedCategory}
        />
      </div>
    </main>
  )
}
