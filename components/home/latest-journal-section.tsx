import Link from "next/link"
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
import type { HomeJournal } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type LatestJournalSectionProps = {
  journal: HomeJournal
}

export function LatestJournalSection({ journal }: LatestJournalSectionProps) {
  return (
    <section
      id="latest-journal"
      className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]"
    >
      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader>
          <SectionLabel>Latest Journal</SectionLabel>
          <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
            {journal.issueLabel}
          </CardTitle>
          <Separator />
          <CardDescription className="max-w-3xl text-base leading-8">
            {journal.summary}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href={journal.href}>Open Journal</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={journal.archiveHref}>View Issue Archive</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader>
          <SectionLabel>Table of Contents</SectionLabel>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {journal.entries.map((entry, index) => (
              <li key={entry}>
                <p className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </p>
                <h3 className="mt-1 text-lg leading-7 text-foreground">
                  {entry}
                </h3>
                {index < journal.entries.length - 1 ? (
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
