import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { HomeBrief } from "@/lib/content-loader"

import { SectionLabel } from "@/components/home/section-label"

type BriefsSectionProps = {
  briefs: HomeBrief[]
  submission: {
    title: string
    body: string
    repoUrl: string
    branchPrefix: string
    submitHref: string
    guidelinesHref: string
  }
}

export function BriefsSection({ briefs, submission }: BriefsSectionProps) {
  return (
    <section
      id="briefs"
      className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]"
    >
      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader>
          <SectionLabel>Front Matter</SectionLabel>
          <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
            Notes from the front page: new issue, submissions, and where to
            begin.
          </CardTitle>
          <CardDescription className="max-w-3xl text-base leading-8">
            An intentionally modest film periodical. The homepage now behaves
            like a field of blocks instead of a single sheet, so each area can
            stand on its own.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {briefs.map((brief) => (
            <Card
              key={brief.title}
              className="rounded-none border-border bg-background shadow-none"
            >
              <CardHeader>
                <SectionLabel>{brief.label}</SectionLabel>
                <CardTitle className="text-xl leading-8">
                  {brief.title}
                </CardTitle>
                <Separator />
                <CardDescription className="text-sm leading-7">
                  {brief.body}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card
        id="submit"
        className="rounded-none border-border bg-background shadow-none"
      >
        <CardHeader>
          <SectionLabel>Submission Prompt</SectionLabel>
          <CardTitle className="font-heading text-2xl leading-tight">
            {submission.title}
          </CardTitle>
          <Separator />
          <CardDescription className="text-base leading-8">
            {submission.body}
          </CardDescription>
          <CardDescription className="font-mono text-xs leading-6">
            Repository: {submission.repoUrl}
            <br />
            Submission branch prefix: {submission.branchPrefix}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/submit">Submit Work</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/submit">Read Guidelines</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
