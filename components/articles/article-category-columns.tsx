import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/ssr"

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
import type { ArticlesPageData } from "@/lib/content-loader"

type ArticleCategoryColumnsProps = {
    groupedArticles: ArticlesPageData["groupedArticles"]
    selectedCategory?: string | null
    information: ArticlesPageData["categoriesInformation"]
}

const DEFAULT_CATEGORY_PREVIEW_COUNT = 3

function getCategoryHref(category: string) {
    return `/articles?category=${encodeURIComponent(category)}`
}

function sortGroupsAlphabetically(groups: ArticlesPageData["groupedArticles"]) {
    return [...groups].sort((left, right) =>
        left.category.localeCompare(right.category, "en-GB", {
            sensitivity: "base",
        })
    )
}

function estimateCategoryCardHeight(
    group: ArticlesPageData["groupedArticles"][number]
) {
    const previewItems = group.items.slice(0, DEFAULT_CATEGORY_PREVIEW_COUNT)
    const hasMore = group.items.length > previewItems.length

    const articleTextWeight = previewItems.reduce((total, article) => {
        return (
            total +
            Math.ceil(article.title.length / 28) * 1.6 +
            Math.ceil(article.summary.length / 72) * 1.2
        )
    }, 0)

    return 6 + previewItems.length * 6 + articleTextWeight + (hasMore ? 2.5 : 0)
}

function splitGroupsByIndexes<T>(items: T[], splitIndexes: number[]) {
    const result: T[][] = []
    let startIndex = 0

    for (const splitIndex of splitIndexes) {
        result.push(items.slice(startIndex, splitIndex))
        startIndex = splitIndex
    }

    result.push(items.slice(startIndex))
    return result
}

function getColumnHeights(groups: ArticlesPageData["groupedArticles"][]) {
    return groups.map((columnGroups) =>
        columnGroups.reduce(
            (total, group) => total + estimateCategoryCardHeight(group),
            0
        )
    )
}

function getHeightSpread(columnGroups: ArticlesPageData["groupedArticles"][]) {
    const heights = getColumnHeights(columnGroups)
    return Math.max(...heights) - Math.min(...heights)
}

function partitionGroupsIntoBalancedColumns(
    groups: ArticlesPageData["groupedArticles"],
    columnCount: number
) {
    if (columnCount <= 1 || groups.length <= 1) {
        return [groups]
    }

    if (columnCount === 2) {
        let bestSplit = 1
        let bestSpread = Number.POSITIVE_INFINITY

        for (let splitIndex = 1; splitIndex < groups.length; splitIndex += 1) {
            const candidate = splitGroupsByIndexes(groups, [splitIndex])
            const spread = getHeightSpread(candidate)

            if (spread < bestSpread) {
                bestSpread = spread
                bestSplit = splitIndex
            }
        }

        return splitGroupsByIndexes(groups, [bestSplit])
    }

    if (columnCount === 3) {
        let bestSplits = [1, Math.max(2, groups.length - 1)]
        let bestSpread = Number.POSITIVE_INFINITY

        for (
            let firstSplit = 1;
            firstSplit < groups.length - 1;
            firstSplit += 1
        ) {
            for (
                let secondSplit = firstSplit + 1;
                secondSplit < groups.length;
                secondSplit += 1
            ) {
                const candidate = splitGroupsByIndexes(groups, [
                    firstSplit,
                    secondSplit,
                ])
                const spread = getHeightSpread(candidate)

                if (spread < bestSpread) {
                    bestSpread = spread
                    bestSplits = [firstSplit, secondSplit]
                }
            }
        }

        return splitGroupsByIndexes(groups, bestSplits)
    }

    return splitGroupsByIndexes(groups, [])
}

function CategoryFilterButtons({
    groups,
    selectedCategory,
}: {
    groups: ArticlesPageData["groupedArticles"]
    selectedCategory?: string | null
}) {
    return (
        <div className="flex flex-wrap gap-2 pt-2">
            <Button
                variant={!selectedCategory ? "outline" : "ghost"}
                size="sm"
                asChild
            >
                <Link href="/articles">All Categories</Link>
            </Button>
            {groups.map((group) => {
                const isSelected =
                    group.category.trim().toLowerCase() ===
                    (selectedCategory?.trim().toLowerCase() ?? "")

                return (
                    <Button
                        key={group.category}
                        variant={isSelected ? "outline" : "ghost"}
                        size="sm"
                        asChild
                    >
                        <Link href={getCategoryHref(group.category)}>
                            {group.category} ({group.items.length})
                        </Link>
                    </Button>
                )
            })}
        </div>
    )
}

function CategoryPreviewCard({
    group,
}: {
    group: ArticlesPageData["groupedArticles"][number]
}) {
    const visibleItems = group.items.slice(0, DEFAULT_CATEGORY_PREVIEW_COUNT)
    const hasMore = group.items.length > visibleItems.length

    return (
        <Card className="rounded-none border-border bg-background shadow-none">
            <CardHeader>
                <SectionLabel>{group.category}</SectionLabel>
            </CardHeader>
            <div className="px-6 pb-6">
                <div className="space-y-5">
                    {visibleItems.map((article, index) => (
                        <article key={article.id}>
                            <p className="font-mono text-xs text-muted-foreground">
                                {toArticleCode(article.articleNumber)}
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
                            <CardFooter className="px-0 pt-3 pb-0">
                                <Button variant="outline" asChild>
                                    <Link href={article.href}>
                                        Read Article
                                    </Link>
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
                            <div className="pt-1">
                                <Link
                                    href={getCategoryHref(group.category)}
                                    className="inline-flex items-center gap-1 text-sm leading-7 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                                >
                                    <span>{`View all in ${group.category}`}</span>
                                    <ArrowRight size={14} weight="regular" />
                                </Link>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </Card>
    )
}

export function ArticleCategoryColumns({
    groupedArticles,
    selectedCategory,
    information,
}: ArticleCategoryColumnsProps) {
    const sortedGroups = sortGroupsAlphabetically(groupedArticles)
    const normalizedSelectedCategory =
        selectedCategory?.trim().toLowerCase() ?? null
    const visibleGroups = normalizedSelectedCategory
        ? sortedGroups.filter(
              (group) =>
                  group.category.trim().toLowerCase() ===
                  normalizedSelectedCategory
          )
        : sortedGroups
    const isCategoryView = Boolean(normalizedSelectedCategory)
    const twoColumnGroups = partitionGroupsIntoBalancedColumns(visibleGroups, 2)
    const threeColumnGroups = partitionGroupsIntoBalancedColumns(
        visibleGroups,
        3
    )

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
                            {information.sectionDescription}
                        </CardDescription>
                        <CategoryFilterButtons
                            groups={sortedGroups}
                            selectedCategory={selectedCategory}
                        />
                    </CardHeader>
                </Card>
            ) : null}

            {visibleGroups.length === 0 ? (
                <Card className="rounded-none border-border bg-background shadow-none">
                    <CardHeader>
                        <SectionLabel>Unavailable Category</SectionLabel>
                        <CardTitle className="font-heading text-2xl leading-tight">
                            {information.unavailableTitle}
                        </CardTitle>
                        <CardDescription className="text-base leading-8">
                            {information.unavailableDescription}
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
                            <SectionLabel>
                                {visibleGroups[0]?.category ?? "Category"}
                            </SectionLabel>
                            <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                                {visibleGroups[0]?.category ?? selectedCategory}
                            </CardTitle>
                            <CardDescription className="max-w-3xl text-base leading-8">
                                {information.categoryViewDescription}
                            </CardDescription>
                            <CategoryFilterButtons
                                groups={sortedGroups}
                                selectedCategory={selectedCategory}
                            />
                        </CardHeader>
                        <CardFooter className="ml-auto pt-0">
                            <Button
                                className="text-foreground"
                                variant="link"
                                asChild
                            >
                                <Link href="/articles">
                                    Back to All Categories
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {visibleGroups.flatMap((group) =>
                            group.items.map((article) => (
                                <Card
                                    key={article.id}
                                    className="rounded-none border-border bg-background shadow-none"
                                >
                                    <div className="px-6 pt-6 pb-6">
                                        <div className="space-y-5">
                                            <article>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    {toArticleCode(
                                                        article.articleNumber
                                                    )}
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
                                                <CardFooter className="px-0 pt-3 pb-0">
                                                    <Button
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={article.href}
                                                        >
                                                            Read Article
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </article>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-6 md:hidden">
                        {visibleGroups.map((group) => (
                            <CategoryPreviewCard
                                key={group.category}
                                group={group}
                            />
                        ))}
                    </div>

                    <div className="hidden gap-6 md:grid md:grid-cols-2 lg:hidden">
                        {twoColumnGroups.map((columnGroups, columnIndex) => (
                            <div
                                key={`two-column-${columnIndex}`}
                                className="space-y-6"
                            >
                                {columnGroups.map((group) => (
                                    <CategoryPreviewCard
                                        key={group.category}
                                        group={group}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="hidden gap-6 lg:grid lg:grid-cols-3">
                        {threeColumnGroups.map((columnGroups, columnIndex) => (
                            <div
                                key={`three-column-${columnIndex}`}
                                className="space-y-6"
                            >
                                {columnGroups.map((group) => (
                                    <CategoryPreviewCard
                                        key={group.category}
                                        group={group}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}
