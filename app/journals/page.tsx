import { JournalArchiveGrid } from "@/components/journals/journal-archive-grid"
import { JournalIssueContents } from "@/components/journals/journal-issue-contents"
import { JournalHeader } from "@/components/layout/journal-header"
import { NoContentState } from "@/components/layout/no-content-state"
import {
    loadJournalIssuePageData,
    loadJournalsPageData,
} from "@/lib/content-loader"

export default async function JournalsPage() {
    const journalsPageData = await loadJournalsPageData()
    const latestIssuePageData = journalsPageData
        ? await loadJournalIssuePageData(journalsPageData.latestJournal.issue)
        : null

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title="Journals"
                    description={
                        journalsPageData?.pageDescription ??
                        "Journal issue content could not be loaded from the configured source."
                    }
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />
                {journalsPageData ? (
                    <>
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
                    </>
                ) : (
                    <NoContentState description="Journal issue content could not be loaded from the configured source." />
                )}
            </div>
        </main>
    )
}
