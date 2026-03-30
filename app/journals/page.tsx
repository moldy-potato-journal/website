import { JournalArchiveGrid } from "@/components/journals/journal-archive-grid"
import { JournalIssueContents } from "@/components/journals/journal-issue-contents"
import { JournalHeader } from "@/components/layout/journal-header"
import {
    loadJournalIssuePageData,
    loadJournalsPageData,
} from "@/lib/content-loader"

export const dynamic = "force-dynamic"

export default async function JournalsPage() {
    const journalsPageData = await loadJournalsPageData()
    const latestIssuePageData = await loadJournalIssuePageData(
        journalsPageData.latestJournal.issue
    )

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title="Journals"
                    description={journalsPageData.pageDescription}
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />

                {latestIssuePageData ? (
                    <JournalIssueContents
                        journal={latestIssuePageData.journal}
                        entries={latestIssuePageData.entries}
                        contentsDescription={
                            journalsPageData.contentsDescription
                        }
                    />
                ) : null}

                <JournalArchiveGrid journals={journalsPageData.journals} />
            </div>
        </main>
    )
}
