import { ArticleNotFoundSection } from "@/components/articles/article-not-found-section"
import { JournalHeader } from "@/components/layout/journal-header"
import { loadArticleNotFoundPageData } from "@/lib/content-loader"

export default async function ArticleNotFound() {
    const {
        pageDescription,
        headerTitle,
        headerDescription,
        recommendationsTitle,
        recommendationsDescription,
        recommendedArticles,
    } = await loadArticleNotFoundPageData()

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title="Articles"
                    description={pageDescription}
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />

                <ArticleNotFoundSection
                    headerTitle={headerTitle}
                    headerDescription={headerDescription}
                    recommendationsTitle={recommendationsTitle}
                    recommendationsDescription={recommendationsDescription}
                    recommendedArticles={recommendedArticles}
                />
            </div>
        </main>
    )
}
