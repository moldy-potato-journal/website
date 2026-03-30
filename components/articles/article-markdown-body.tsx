import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { SectionLabel } from "@/components/home/section-label"

type ArticleMarkdownBodyProps = {
    body: string
}

function renderMarkdownBlock(block: string, index: number) {
    const trimmedBlock = block.trim()

    if (trimmedBlock.startsWith("### ")) {
        return (
            <h3 key={index} className="font-heading text-2xl leading-tight">
                {trimmedBlock.slice(4)}
            </h3>
        )
    }

    if (trimmedBlock.startsWith("## ")) {
        return (
            <h2 key={index} className="font-heading text-3xl leading-tight">
                {trimmedBlock.slice(3)}
            </h2>
        )
    }

    if (trimmedBlock.startsWith("# ")) {
        return (
            <h1 key={index} className="font-heading text-4xl leading-tight">
                {trimmedBlock.slice(2)}
            </h1>
        )
    }

    return (
        <p key={index} className="text-base leading-8 text-foreground">
            {trimmedBlock}
        </p>
    )
}

export function ArticleMarkdownBody({ body }: ArticleMarkdownBodyProps) {
    const blocks = body
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean)

    return (
        <Card className="rounded-none border-border bg-background shadow-none">
            <CardHeader>
                <SectionLabel>Reading Text</SectionLabel>
            </CardHeader>
            <CardContent className="space-y-6">
                {blocks.map((block, index) =>
                    renderMarkdownBlock(block, index)
                )}
            </CardContent>
        </Card>
    )
}
