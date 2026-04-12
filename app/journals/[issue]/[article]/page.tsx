import Link from "next/link"
import { notFound } from "next/navigation"

import { SectionLabel } from "@/components/home/section-label"
import { JournalEntryMetaCard } from "@/components/journals/journal-entry-meta-card"
import { JournalEntryPdfViewer } from "@/components/journals/journal-entry-pdf-viewer"
import { JournalHeader } from "@/components/layout/journal-header"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { loadJournalIssueArticlePageData } from "@/lib/content-loader"

type JournalIssueArticlePageProps = {
    params: Promise<{
        issue: string
        article: string
    }>
}

export default async function JournalIssueArticlePage({
    params,
}: JournalIssueArticlePageProps) {
    const { issue, article } = await params
    const pageData = await loadJournalIssueArticlePageData(issue, article)

    if (!pageData) {
        notFound()
    }

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title={pageData.entry.title}
                    description={pageData.entry.summary}
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />

                <section>
                    <Card className="rounded-none border-border bg-background shadow-none">
                        <CardHeader>
                            <SectionLabel>Issue Placement</SectionLabel>
                            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
                                Journal entries are not part of the standalone
                                article system. This text is read through the
                                issue PDF for {pageData.journal.issueLabel}, at
                                entry {pageData.entry.entryNumber}, using the
                                page span {pageData.entry.pageStart}-
                                {pageData.entry.pageEnd}. Journal routes use
                                issue number and in-issue position:{" "}
                                <span className="font-mono">
                                    /journals/{pageData.journal.issue}/
                                    {pageData.entry.entryNumber}
                                </span>
                                .
                            </p>
                        </CardHeader>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_20rem]">
                    <div>
                        <JournalEntryPdfViewer
                            title={pageData.entry.title}
                            journalArticlePdfViewerUrl={
                                pageData.journalArticlePdfViewerUrl
                            }
                        />
                    </div>

                    <aside className="space-y-6">
                        <Card className="rounded-none border-border bg-background shadow-none">
                            <CardHeader>
                                <SectionLabel>Issue Access</SectionLabel>
                                <p className="font-mono text-xs text-muted-foreground">
                                    {pageData.journal.issueLabel} ·{" "}
                                    {pageData.entry.entryNumber}
                                </p>
                                <CardDescription className="text-sm leading-7">
                                    Issue navigation and PDF access for this
                                    journal entry.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex flex-wrap gap-3">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/journals/${pageData.journal.issue}`}
                                    >
                                        Back to Issue
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/journals">
                                        Back to Journals
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <a
                                        href={pageData.journalArticlePdfUrl}
                                        download
                                    >
                                        Download Article PDF
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>

                        <JournalEntryMetaCard
                            journal={pageData.journal}
                            entry={pageData.entry}
                        />
                    </aside>
                </section>
            </div>
        </main>
    )
}
