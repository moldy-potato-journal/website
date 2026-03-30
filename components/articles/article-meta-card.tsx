import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toArticleCode } from "@/lib/article-number"
import type { ArticlePageData } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type ArticleMetaCardProps = {
    article: ArticlePageData["article"]
}

function formatArticleContentType(contentType: "markdown" | "pdf") {
    return contentType === "pdf" ? "PDF" : "Markdown"
}

export function ArticleMetaCard({ article }: ArticleMetaCardProps) {
    return (
        <Card className="rounded-none border-border bg-background shadow-none">
            <CardHeader>
                <SectionLabel>Article Record</SectionLabel>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Number
                    </p>
                    <p className="mt-1 font-mono text-sm">
                        {toArticleCode(article.articleNumber)}
                    </p>
                </div>
                <Separator />
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Category
                    </p>
                    <p className="mt-1 text-sm">{article.category}</p>
                </div>
                <Separator />
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Format
                    </p>
                    <p className="mt-1 text-sm">
                        {formatArticleContentType(article.contentType)}
                    </p>
                </div>
                <Separator />
                <div>
                    <p className="font-mono text-xs text-muted-foreground">
                        Authors
                    </p>
                    <p className="mt-1 text-sm">{article.authors.join(", ")}</p>
                </div>
                {article.publishDate ? (
                    <>
                        <Separator />
                        <div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Published
                            </p>
                            <p className="mt-1 text-sm">
                                {article.publishDate}
                            </p>
                        </div>
                    </>
                ) : null}
                {article.tags.length > 0 ? (
                    <>
                        <Separator />
                        <div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Tags
                            </p>
                            <p className="mt-1 text-sm">
                                {article.tags.join(", ")}
                            </p>
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
