import Link from "next/link"

import { SectionLabel } from "@/components/home/section-label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type {
    JournalIssueEntry,
    JournalIssuePageData,
} from "@/lib/content-loader"

type JournalIssueContentsProps = {
    journal: JournalIssuePageData["journal"]
    entries: JournalIssueEntry[]
    contentsDescription: string
}

export function JournalIssueContents({
    journal,
    entries,
    contentsDescription,
}: JournalIssueContentsProps) {
    return (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]">
            <Card className="rounded-none border-border bg-background shadow-none">
                <CardHeader>
                    <SectionLabel>Issue Overview</SectionLabel>
                    <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                        {journal.issueLabel}
                    </CardTitle>
                    <Separator />
                    <CardDescription className="max-w-3xl text-base leading-8">
                        {journal.summary}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                                Code
                            </p>
                            <p className="mt-1 font-mono text-sm text-foreground">
                                {journal.issueCode}
                            </p>
                        </div>
                        <div>
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                                Issue
                            </p>
                            <p className="mt-1 font-mono text-sm text-foreground">
                                {journal.issue}
                            </p>
                        </div>
                        <div>
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                                Articles
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {journal.articleCount}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/journals">Back to Journals</Link>
                    </Button>
                    {journal.discussionUrl ? (
                        <Button asChild>
                            <a
                                href={journal.discussionUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Discuss Issue
                            </a>
                        </Button>
                    ) : null}
                </CardFooter>
            </Card>

            <Card className="rounded-none border-border bg-background shadow-none">
                <CardHeader>
                    <SectionLabel>Contents</SectionLabel>
                    <CardDescription className="text-sm leading-7">
                        {contentsDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-4">
                        {entries.map((entry, index) => (
                            <li key={entry.href}>
                                <p className="font-mono text-xs text-muted-foreground">
                                    {entry.entryNumber}
                                </p>
                                <h3 className="mt-1 text-lg leading-7 text-foreground">
                                    <Link
                                        href={entry.href}
                                        className="transition-colors hover:text-muted-foreground"
                                    >
                                        {entry.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                                    Pages {entry.pageStart}-{entry.pageEnd}
                                </p>
                                {index < entries.length - 1 ? (
                                    <Separator className="mt-4" />
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>
        </section>
    )
}
