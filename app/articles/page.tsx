import { Suspense } from "react"

import { ArticlesPageContent } from "@/components/articles/articles-page-content"
import { JournalHeader } from "@/components/layout/journal-header"
import { loadArticlesPageData } from "@/lib/content-loader"

export default async function ArticlesPage() {
    const articlesPageData = await loadArticlesPageData()

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title="Articles"
                    description={articlesPageData.description}
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />
                <Suspense fallback={null}>
                    <ArticlesPageContent articlesPageData={articlesPageData} />
                </Suspense>
            </div>
        </main>
    )
}
