import Link from "next/link"

import { SectionLabel } from "@/components/home/section-label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toArticleCode } from "@/lib/article-number"
import type { HomeArticle } from "@/lib/content-loader"

type RecentArticlesSectionProps = {
    articles: HomeArticle[]
}

export function RecentArticlesSection({
    articles,
}: RecentArticlesSectionProps) {
    return (
        <section className="space-y-6">
            <Card className="rounded-none border-border bg-background shadow-none">
                <CardHeader className="gap-3">
                    <SectionLabel>Recent Releases</SectionLabel>
                    <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                        Latest published standalone articles
                    </CardTitle>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                    <Card
                        key={article.id}
                        className="rounded-none border-border bg-background shadow-none"
                    >
                        <CardHeader>
                            <SectionLabel>{article.category}</SectionLabel>
                            <p className="font-mono text-xs text-muted-foreground">
                                {toArticleCode(article.articleNumber)}
                            </p>
                            <CardTitle className="text-xl leading-8">
                                {article.title}
                            </CardTitle>
                            <Separator />
                            <CardDescription className="text-sm leading-7">
                                {article.description}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                            <Button variant="outline" asChild>
                                <Link href={article.href}>Read Article</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
