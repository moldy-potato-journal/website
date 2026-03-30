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

type ArticleNotFoundSectionProps = {
    headerTitle: string
    headerDescription: string
    recommendationsTitle: string
    recommendationsDescription: string
    recommendedArticles: HomeArticle[]
}

export function ArticleNotFoundSection({
    headerTitle,
    headerDescription,
    recommendationsTitle,
    recommendationsDescription,
    recommendedArticles,
}: ArticleNotFoundSectionProps) {
    return (
        <>
            <section>
                <Card className="rounded-none border-border bg-background shadow-none">
                    <CardHeader className="gap-4">
                        <SectionLabel>Article Not Found</SectionLabel>
                        <CardTitle className="font-heading text-4xl leading-tight sm:text-5xl">
                            {headerTitle}
                        </CardTitle>
                        <CardDescription className="max-w-3xl text-base leading-8">
                            {headerDescription}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/articles">Browse Articles</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Return Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </section>

            <section className="space-y-6">
                <Card className="rounded-none border-border bg-background shadow-none">
                    <CardHeader>
                        <SectionLabel>Recommended Articles</SectionLabel>
                        <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                            {recommendationsTitle}
                        </CardTitle>
                        <CardDescription className="max-w-3xl text-base leading-8">
                            {recommendationsDescription}
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {recommendedArticles.map((article) => (
                        <Card
                            key={article.id}
                            className="rounded-none border-border bg-background shadow-none"
                        >
                            <CardHeader>
                                <SectionLabel>{article.category}</SectionLabel>
                                <p className="font-mono text-xs text-muted-foreground">
                                    {toArticleCode(article.articleNumber)}
                                </p>
                                <CardTitle className="text-2xl leading-tight">
                                    {article.title}
                                </CardTitle>
                                <CardDescription className="text-sm leading-7">
                                    {article.description}
                                </CardDescription>
                                <Separator />
                                <p className="font-mono text-[11px] text-muted-foreground">
                                    {article.contentType.toUpperCase()}
                                </p>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="outline" asChild>
                                    <Link href={article.href}>
                                        Read Article
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}
