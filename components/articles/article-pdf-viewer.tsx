import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ArticlePageData } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type ArticlePdfViewerProps = {
  article: ArticlePageData["article"]
}

export function ArticlePdfViewer({ article }: ArticlePdfViewerProps) {
  return (
    <Card className="rounded-none border-border bg-background shadow-none">
      <CardHeader>
        <SectionLabel>PDF Reading</SectionLabel>
      </CardHeader>
      <CardContent>
        <div className="h-[70svh] border border-border">
          <iframe
            title={article.title}
            src={article.rawContentUrl}
            className="h-full w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
