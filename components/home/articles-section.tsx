import Link from "next/link"
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

import { SectionLabel } from "@/components/home/section-label"

type ArticlesSectionProps = {
    title: string
    description: string
    articles: HomeArticle[]
}

function distributeArticlesIntoColumns(
    articles: HomeArticle[],
    columnCount: number
) {
    return Array.from({ length: columnCount }, (_, columnIndex) =>
        articles.filter(
            (_, articleIndex) => articleIndex % columnCount === columnIndex
        )
    )
}

export function ArticlesSection({
    title,
    description,
    articles,
}: ArticlesSectionProps) {
    const twoColumnArticles = distributeArticlesIntoColumns(articles, 2)
    const threeColumnArticles = distributeArticlesIntoColumns(articles, 3)

    return (
        <section id="articles" className="space-y-6">
            <Card className="rounded-none border-border bg-background shadow-none">
                <CardHeader>
                    <SectionLabel>Standalone Articles</SectionLabel>
                    <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                        {title}
                    </CardTitle>
                    <Separator />
                    <CardDescription className="max-w-3xl text-base leading-8">
                        {description}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-6 md:hidden">
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

            <div className="hidden gap-6 md:grid md:grid-cols-2 xl:hidden">
                {twoColumnArticles.map((columnArticles, columnIndex) => (
                    <div
                        key={`two-column-${columnIndex}`}
                        className="space-y-6"
                    >
                        {columnArticles.map((article) => (
                            <Card
                                key={article.id}
                                className="rounded-none border-border bg-background shadow-none"
                            >
                                <CardHeader>
                                    <SectionLabel>
                                        {article.category}
                                    </SectionLabel>
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
                                        <Link href={article.href}>
                                            Read Article
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>

            <div className="hidden gap-6 xl:grid xl:grid-cols-3">
                {threeColumnArticles.map((columnArticles, columnIndex) => (
                    <div
                        key={`three-column-${columnIndex}`}
                        className="space-y-6"
                    >
                        {columnArticles.map((article) => (
                            <Card
                                key={article.id}
                                className="rounded-none border-border bg-background shadow-none"
                            >
                                <CardHeader>
                                    <SectionLabel>
                                        {article.category}
                                    </SectionLabel>
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
                                        <Link href={article.href}>
                                            Read Article
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}
