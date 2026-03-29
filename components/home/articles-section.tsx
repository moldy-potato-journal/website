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
import type { HomeArticle } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type ArticlesSectionProps = {
  articles: HomeArticle[]
}

export function ArticlesSection({ articles }: ArticlesSectionProps) {
  return (
    <section id="articles" className="space-y-6">
      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader>
          <SectionLabel>Standalone Articles</SectionLabel>
          <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
            Single pieces published outside the journal issue.
          </CardTitle>
          <Separator />
          <CardDescription className="max-w-3xl text-base leading-8">
            These are independent articles, not entries in the current journal.
            They live as separate blocks and can scale freely as the site grows.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="flex h-full rounded-none border-border bg-background shadow-none"
          >
            <CardHeader>
              <SectionLabel>Article</SectionLabel>
              <CardTitle className="text-xl leading-8">
                {article.title}
              </CardTitle>
              <Separator />
              <CardDescription className="text-sm leading-7">
                {article.summary}
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
