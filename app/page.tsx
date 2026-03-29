import { loadHomePageData } from "@/lib/content-loader"
import { ArticlesSection } from "@/components/home/articles-section"
import { BriefsSection } from "@/components/home/briefs-section"
import { LatestJournalSection } from "@/components/home/latest-journal-section"
import { JournalHeader } from "@/components/layout/journal-header"

export const dynamic = "force-dynamic"

export default async function Page() {
  const homePageData = await loadHomePageData()

  return (
    <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <JournalHeader
          title={homePageData.title}
          description={homePageData.description}
          links={[
            { href: "/", label: "Home" },
            { href: "/articles", label: "Articles" },
            { href: "#submit", label: "Submit" },
          ]}
        />
        <BriefsSection
          briefs={homePageData.briefs}
          submission={homePageData.submission}
        />
        <LatestJournalSection journal={homePageData.latestJournal} />
        <ArticlesSection articles={homePageData.articles} />
      </div>
    </main>
  )
}
