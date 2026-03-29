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

type ArticleCategoryColumnsProps = {
  groupedArticles: ArticlesPageData["groupedArticles"]
  selectedCategory?: string | null
}

const DEFAULT_CATEGORY_PREVIEW_COUNT = 3

function getCategoryHref(category: string) {
  return `/articles?category=${encodeURIComponent(category)}`
}

export function ArticleCategoryColumns({
  groupedArticles,
  selectedCategory,
}: ArticleCategoryColumnsProps) {
  const normalizedSelectedCategory = selectedCategory?.trim().toLowerCase() ?? null
  const visibleGroups = normalizedSelectedCategory
    ? groupedArticles.filter(
        (group) => group.category.trim().toLowerCase() === normalizedSelectedCategory
      )
    : groupedArticles
  const isCategoryView = Boolean(normalizedSelectedCategory)

  return (
    <section id="article-categories" className="space-y-6">
      {!isCategoryView ? (
        <Card className="rounded-none border-border bg-background shadow-none">
          <CardHeader>
            <SectionLabel>Article Categories</SectionLabel>
            <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
              Articles arranged by category.
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-8">
              This section gives single articles their own system outside the
              journal issue structure, while still keeping the archive legible.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {visibleGroups.length === 0 ? (
        <Card className="rounded-none border-border bg-background shadow-none">
          <CardHeader>
            <SectionLabel>Unavailable Category</SectionLabel>
            <CardTitle className="font-heading text-2xl leading-tight">
              No articles are filed under this category.
            </CardTitle>
            <CardDescription className="text-base leading-8">
              Return to the main article archive to browse the published
              categories now in circulation.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/articles">Browse All Articles</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : isCategoryView ? (
        <>
          <Card className="rounded-none border-border bg-background shadow-none">
            <CardHeader>
              <SectionLabel>{visibleGroups[0]?.category ?? "Category"}</SectionLabel>
              <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                {visibleGroups[0]?.category ?? selectedCategory}
              </CardTitle>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button variant="outline" asChild>
                <Link href="/articles">Back to All Categories</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            {visibleGroups.map((group) => (
              <Card
                key={group.category}
                className="rounded-none border-border bg-background shadow-none"
              >
                <CardHeader>
                  <SectionLabel>{group.category}</SectionLabel>
                </CardHeader>
                <div className="px-6 pb-6">
                  <div className="space-y-5">
                    {group.items.map((article, index) => (
                      <article key={article.id}>
                        <p className="font-mono text-xs text-muted-foreground">
                          {article.articleNumber}
                        </p>
                        <CardTitle className="text-xl leading-8">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm leading-7">
                          {article.summary}
                        </CardDescription>
                        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                          {article.contentType.toUpperCase()}
                        </p>
                        <CardFooter className="px-0 pt-4">
                          <Button variant="outline" asChild>
                            <Link href={article.href}>Read Article</Link>
                          </Button>
                        </CardFooter>
                        {index < group.items.length - 1 ? (
                          <Separator className="mt-5" />
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {visibleGroups.map((group) => {
            const visibleItems = group.items.slice(0, DEFAULT_CATEGORY_PREVIEW_COUNT)
            const hasMore = group.items.length > visibleItems.length

            return (
              <Card
                key={group.category}
                className="mb-6 break-inside-avoid rounded-none border-border bg-background shadow-none"
              >
                <CardHeader>
                  <SectionLabel>{group.category}</SectionLabel>
                </CardHeader>
                <div className="px-6 pb-6">
                  <div className="space-y-5">
                    {visibleItems.map((article, index) => (
                      <article key={article.id}>
                        <p className="font-mono text-xs text-muted-foreground">
                          {article.articleNumber}
                        </p>
                        <CardTitle className="text-xl leading-8">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm leading-7">
                          {article.summary}
                        </CardDescription>
                        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                          {article.contentType.toUpperCase()}
                        </p>
                        <CardFooter className="px-0 pt-4">
                          <Button variant="outline" asChild>
                            <Link href={article.href}>Read Article</Link>
                          </Button>
                        </CardFooter>
                        {index < visibleItems.length - 1 ? (
                          <Separator className="mt-5" />
                        ) : null}
                      </article>
                    ))}
                    {hasMore ? (
                      <>
                        <Separator />
                        <CardFooter className="px-0 pt-1">
                          <Button variant="outline" asChild>
                            <Link href={getCategoryHref(group.category)}>
                              View All in {group.category}
                            </Link>
                          </Button>
                        </CardFooter>
                      </>
                    ) : null}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
