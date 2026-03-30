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
import type { HomeJournal } from "@/lib/content-loader"

type JournalArchiveGridProps = {
    journals: HomeJournal[]
}

export function JournalArchiveGrid({ journals }: JournalArchiveGridProps) {
    return (
        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {journals.map((journal) => (
                <Card
                    key={journal.id}
                    className="flex rounded-none border-border bg-background shadow-none"
                >
                    <div className="flex h-full flex-col">
                        <CardHeader>
                            <SectionLabel>{journal.issueLabel}</SectionLabel>
                            <CardTitle className="font-heading text-2xl leading-tight">
                                {journal.title}
                            </CardTitle>
                            <CardDescription className="text-sm leading-7">
                                {journal.summary}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm leading-7 text-muted-foreground">
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                                Contents
                            </p>
                            <ul className="space-y-1">
                                {journal.entries.slice(0, 3).map((entry) => (
                                    <li key={entry}>{entry}</li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="mt-auto pt-3">
                            <Button variant="outline" asChild>
                                <Link href={journal.href}>Open Issue</Link>
                            </Button>
                        </CardFooter>
                    </div>
                </Card>
            ))}
        </section>
    )
}
