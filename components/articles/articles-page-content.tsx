"use client"

import { useSearchParams } from "next/navigation"

import { ArticleCategoryColumns } from "@/components/articles/article-category-columns"
import { ArticleSpotlight } from "@/components/articles/article-spotlight"
import type { ArticlesPageData } from "@/lib/content-loader"

type ArticlesPageContentProps = {
    articlesPageData: ArticlesPageData
}

export function ArticlesPageContent({
    articlesPageData,
}: ArticlesPageContentProps) {
    const searchParams = useSearchParams()
    const selectedCategory = searchParams.get("category")?.trim() || null
    const isCategoryView = Boolean(selectedCategory)

    return (
        <>
            {isCategoryView ? null : (
                <ArticleSpotlight
                    hottestArticles={articlesPageData.hottestArticles}
                    latestArticle={articlesPageData.latestArticle}
                    latestArticleAbstract={
                        articlesPageData.latestArticleAbstract
                    }
                    hotArticlesTitle={articlesPageData.hotArticlesTitle}
                />
            )}

            <ArticleCategoryColumns
                groupedArticles={articlesPageData.groupedArticles}
                selectedCategory={selectedCategory}
                information={articlesPageData.categoriesInformation}
            />
        </>
    )
}
