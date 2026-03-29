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
import type { ArticlesPageData } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type ArticleSpotlightProps = {
  hottestArticles: ArticlesPageData["hottestArticles"]
  latestArticle: ArticlesPageData["latestArticle"]
  latestArticleAbstract: string
}

export function ArticleSpotlight({
  hottestArticles,
  latestArticle,
  latestArticleAbstract,
}: ArticleSpotlightProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.25fr)]">
      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader>
          <SectionLabel>Hot Articles</SectionLabel>
          <CardTitle className="font-heading text-2xl leading-tight">
            Current points of entry.
          </CardTitle>
          <Separator />
          <div className="space-y-4">
            {hottestArticles.map((article, index) => (
              <article key={article.id}>
                <p className="font-mono text-xs text-muted-foreground">
                  {article.articleNumber}
                </p>
                <h3 className="mt-1 text-lg leading-7 text-foreground">
                  {article.title}
                </h3>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  {article.summary}
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {article.contentType.toUpperCase()}
                </p>
                {index < hottestArticles.length - 1 ? (
                  <Separator className="mt-4" />
                ) : null}
              </article>
            ))}
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader>
          <SectionLabel>Latest Article</SectionLabel>
          <p className="font-mono text-xs text-muted-foreground">
            {latestArticle.articleNumber}
          </p>
          <CardTitle className="font-heading text-4xl leading-tight sm:text-5xl">
            {latestArticle.title}
          </CardTitle>
          <CardDescription className="text-base leading-8">
            {latestArticleAbstract}
          </CardDescription>
          <CardDescription className="font-mono text-xs">
            Primary format: {latestArticle.contentType.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href={latestArticle.href}>Read Article</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#article-categories">Browse by Category</a>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
