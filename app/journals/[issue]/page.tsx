import { notFound } from "next/navigation"

import { JournalIssueContents } from "@/components/journals/journal-issue-contents"
import { JournalHeader } from "@/components/layout/journal-header"
import { loadJournalIssuePageData } from "@/lib/content-loader"
import { staticCopy } from "@/lib/home-content"

export const dynamic = "force-dynamic"

type JournalIssuePageProps = {
    params: Promise<{
        issue: string
    }>
}

export default async function JournalIssuePage({
    params,
}: JournalIssuePageProps) {
    const { issue } = await params
    const issuePageData = await loadJournalIssuePageData(issue)

    if (!issuePageData) {
        notFound()
    }

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title={issuePageData.journal.issueLabel}
                    description={issuePageData.journal.summary}
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />

                <JournalIssueContents
                    journal={issuePageData.journal}
                    entries={issuePageData.entries}
                    contentsDescription={
                        staticCopy.journals.contentsDescription
                    }
                />
            </div>
        </main>
    )
}
