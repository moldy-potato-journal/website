import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { SectionLabel } from "@/components/home/section-label"

type JournalEntryPdfViewerProps = {
    title: string
    journalArticlePdfViewerUrl: string
}

export function JournalEntryPdfViewer({
    title,
    journalArticlePdfViewerUrl,
}: JournalEntryPdfViewerProps) {
    return (
        <Card className="rounded-none border-border bg-background shadow-none">
            <CardHeader>
                <SectionLabel>Issue PDF</SectionLabel>
            </CardHeader>
            <CardContent>
                <div className="h-[70svh] border border-border">
                    <iframe
                        title={title}
                        src={journalArticlePdfViewerUrl}
                        className="h-full w-full"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
