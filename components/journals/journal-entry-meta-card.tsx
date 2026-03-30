import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { JournalIssueArticlePageData } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type JournalEntryMetaCardProps = {
    journal: JournalIssueArticlePageData["journal"]
    entry: JournalIssueArticlePageData["entry"]
}

export function JournalEntryMetaCard({
    journal,
    entry,
}: JournalEntryMetaCardProps) {
    return (
        <Card className="rounded-none border-border bg-background shadow-none">
            <CardHeader>
                <SectionLabel>Journal Entry Record</SectionLabel>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Issue
                    </p>
                    <p className="mt-1 font-mono text-sm">
                        {journal.issueLabel}
                    </p>
                </div>
                <Separator />
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Entry
                    </p>
                    <p className="mt-1 font-mono text-sm">
                        {entry.entryNumber}
                    </p>
                </div>
                <Separator />
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Pages
                    </p>
                    <p className="mt-1 font-mono text-sm">
                        {entry.pageStart}-{entry.pageEnd}
                    </p>
                </div>
                <Separator />
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Authors
                    </p>
                    <p className="mt-1 text-sm">{entry.authors.join(", ")}</p>
                </div>
                {entry.tags.length > 0 ? (
                    <>
                        <Separator />
                        <div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Tags
                            </p>
                            <p className="mt-1 text-sm">
                                {entry.tags.join(", ")}
                            </p>
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
