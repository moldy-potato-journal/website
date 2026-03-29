import { JournalHeader } from "@/components/layout/journal-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { loadHomePageData } from "@/lib/content-loader"
import { CONTENT_REPOSITORY } from "@/lib/content-source"
import { siteConfig } from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function JournalsPage() {
  const homePageData = await loadHomePageData()

  return (
    <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <JournalHeader
          title="Journals"
          description="Issue-based publications and archived journal releases."
          links={[
            { href: "/", label: siteConfig.name },
            { href: "/journals", label: "Journals" },
            { href: "/articles", label: "Articles" },
          ]}
        />

        <Card className="rounded-none border-border bg-background shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-3xl leading-tight">
              Latest issue
            </CardTitle>
            <CardDescription className="text-base leading-8">
              {homePageData.latestJournal.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-mono text-xs text-muted-foreground">
              {homePageData.latestJournal.issueLabel}
            </p>
            <h2 className="font-heading text-2xl">
              {homePageData.latestJournal.title}
            </h2>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={homePageData.latestJournal.href}
                target="_blank"
                rel="noreferrer"
              >
                Open Journal Source
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`${CONTENT_REPOSITORY.url}/tree/${CONTENT_REPOSITORY.defaultBranch}/journals`}
                target="_blank"
                rel="noreferrer"
              >
                Open Journal Archive
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
