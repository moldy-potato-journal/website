import Link from "next/link"
import { notFound } from "next/navigation"

import { ArticleMarkdownBody } from "@/components/articles/article-markdown-body"
import { ArticleMetaCard } from "@/components/articles/article-meta-card"
import { ArticlePdfViewer } from "@/components/articles/article-pdf-viewer"
import { SectionLabel } from "@/components/home/section-label"
import { JournalHeader } from "@/components/layout/journal-header"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { toArticleCode } from "@/lib/article-number"
import {
    loadArticlePageData,
    loadArticleStaticParams,
} from "@/lib/content-loader"

export const dynamicParams = false

export async function generateStaticParams() {
    return loadArticleStaticParams()
}

type ArticlePageProps = {
    params: Promise<{
        articleNumber: string
    }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { articleNumber } = await params
    const articlePageData = await loadArticlePageData(articleNumber)

    if (!articlePageData) {
        notFound()
    }

    const { article } = articlePageData

    return (
        <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <JournalHeader
                    title={article.title}
                    description={article.abstract}
                    links={[
                        { href: "/", label: "Home" },
                        { href: "/articles", label: "Articles" },
                        { href: "/journals", label: "Journals" },
                        { href: "/submit", label: "Submit" },
                    ]}
                />

                <section>
                    <Card className="rounded-none border-border bg-background shadow-none">
                        <CardHeader>
                            <SectionLabel>Editorial Notice</SectionLabel>
                            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                                This is not a certified academic article.
                                Readers should judge its claims, methods, and
                                sincerity for themselves.
                            </p>
                        </CardHeader>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_20rem]">
                    <div>
                        {article.contentType === "markdown" && article.body ? (
                            <ArticleMarkdownBody body={article.body} />
                        ) : (
                            <ArticlePdfViewer article={article} />
                        )}
                    </div>

                    <aside className="space-y-6">
                        <Card className="rounded-none border-border bg-background shadow-none">
                            <CardHeader>
                                <SectionLabel>Reading Access</SectionLabel>
                                <p className="font-mono text-xs text-muted-foreground">
                                    {toArticleCode(article.articleNumber)}
                                </p>
                                <CardDescription className="text-sm leading-7">
                                    Reading, archive navigation, and discussion
                                    access for this article.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex flex-col items-start gap-3">
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="outline" asChild>
                                        <Link href="/articles">
                                            Back to Articles
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <a
                                            href={article.rawContentUrl}
                                            download
                                        >
                                            Download Article
                                        </a>
                                    </Button>
                                </div>
                                {article.discussionUrl ? (
                                    <Button variant="outline" asChild>
                                        <a
                                            href={article.discussionUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Discuss
                                        </a>
                                    </Button>
                                ) : null}
                            </CardFooter>
                        </Card>

                        <ArticleMetaCard article={article} />
                    </aside>
                </section>
            </div>
        </main>
    )
}
