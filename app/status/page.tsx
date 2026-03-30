import { BriefsSection } from "@/components/home/briefs-section"
import { JournalHeader } from "@/components/layout/journal-header"
import { RecentArticlesSection } from "@/components/status/recent-articles-section"
import { loadArticlesPageData, loadHomePageData } from "@/lib/content-loader"

export const dynamic = "force-dynamic"

export default async function StatusPage() {
    const [homePageData, articlesPageData] = await Promise.all([
        loadHomePageData(),
        loadArticlesPageData(),
    ])

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title="Status"
                    description="Current notices, submission updates, archive totals, and the latest standalone releases."
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />

                <BriefsSection
                    sectionLabel="Status"
                    title={homePageData.frontMatter.title}
                    description={homePageData.frontMatter.description}
                    briefs={homePageData.briefs}
                    submission={homePageData.submission}
                    archiveTotals={homePageData.archiveTotals}
                />

                <RecentArticlesSection
                    articles={articlesPageData.recentArticles}
                />
            </div>
        </main>
    )
}
