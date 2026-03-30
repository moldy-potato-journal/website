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
    sectionLabel?: string
    title: string
    description: string
    briefs: HomeBrief[]
    submission: {
        title: string
        body: string
        repoUrl: string
        branchPrefix: string
        submitHref: string
        guidelinesHref: string
    }
    archiveTotals: {
        standaloneArticles: number
        journalIssues: number
        journalArticles: number
    }
}

export function BriefsSection({
    sectionLabel = "Front Matter",
    title,
    description,
    briefs,
    submission,
    archiveTotals,
}: BriefsSectionProps) {
    return (
        <section
            id="briefs"
            className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]"
        >
            <Card className="rounded-none border-border bg-background shadow-none">
                <CardHeader className="gap-3 px-6 pt-6 pb-4">
                    <SectionLabel>{sectionLabel}</SectionLabel>
                    <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                        {title}
                    </CardTitle>
                    <CardDescription className="max-w-3xl text-base leading-7">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 px-6 pt-0 pb-6 md:grid-cols-3">
                    {briefs.map((brief) => (
                        <Card
                            key={brief.title}
                            className="rounded-none border-border bg-background shadow-none"
                        >
                            <CardHeader className="gap-3 px-5 pt-5 pb-5">
                                <SectionLabel>{brief.label}</SectionLabel>
                                <CardTitle className="text-lg leading-7">
                                    {brief.title}
                                </CardTitle>
                                <Separator />
                                <CardDescription className="text-sm leading-6">
                                    {brief.body}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <div className="grid h-full gap-6 xl:grid-rows-[minmax(0,1fr)_auto]">
                <Card
                    id="submit"
                    className="flex h-full flex-col rounded-none border-border bg-background shadow-none"
                >
                    <CardHeader className="gap-3 px-6 pt-6 pb-0">
                        <SectionLabel>Submission Prompt</SectionLabel>
                        <CardTitle className="font-heading text-2xl leading-tight">
                            {submission.title}
                        </CardTitle>
                        <Separator />
                        <CardDescription className="text-base leading-7">
                            {submission.body}
                        </CardDescription>
                        <CardDescription className="font-mono text-xs leading-5">
                            Repository: {submission.repoUrl}
                            <br />
                            Submission branch prefix: {submission.branchPrefix}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto flex flex-wrap gap-2 px-6 pt-3 pb-6">
                        <Button size="lg" asChild>
                            <Link href="/submit">Submit Work</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/submit">Read Guidelines</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="rounded-none border-border bg-background shadow-none">
                    <CardHeader className="gap-2 px-6 pt-6 pb-0">
                        <SectionLabel>Archive Totals</SectionLabel>
                    </CardHeader>
                    <CardContent className="grid gap-3 px-6 pt-3 pb-6 sm:grid-cols-[max-content_max-content_max-content] sm:justify-between">
                        <div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Standalone Articles
                            </p>
                            <p className="mt-0.5 text-2xl">
                                {archiveTotals.standaloneArticles}
                            </p>
                        </div>
                        <div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Journal Issues
                            </p>
                            <p className="mt-0.5 text-2xl">
                                {archiveTotals.journalIssues}
                            </p>
                        </div>
                        <div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Journal Articles
                            </p>
                            <p className="mt-0.5 text-2xl">
                                {archiveTotals.journalArticles}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
