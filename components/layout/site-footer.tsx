import Link from "next/link"

import { CardDescription, CardTitle } from "@/components/ui/card"
import {
    CONTENT_BRANCH_POLICY,
    CONTENT_DISCUSSION_CATEGORIES,
    CONTENT_REPOSITORY,
} from "@/lib/content-source"
import { staticCopy } from "@/lib/home-content"
import { siteConfig } from "@/lib/site"

export function SiteFooter() {
    return (
        <footer className="mt-12 border-t border-border">
            <div className="px-5 py-8 sm:px-8 sm:py-10">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-2">
                            <CardTitle className="font-heading text-xl tracking-tight sm:text-2xl">
                                {staticCopy.footer.archiveMethodTitle}
                            </CardTitle>
                            <CardDescription className="text-sm leading-7 sm:text-base">
                                {staticCopy.footer.archiveMethodDescription}
                            </CardDescription>
                        </div>

                        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                                Repository
                            </p>
                            <a
                                href={CONTENT_REPOSITORY.url}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all transition-colors hover:text-foreground"
                            >
                                {CONTENT_REPOSITORY.url}
                            </a>
                        </div>

                        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                                {staticCopy.footer.editorialProcessTitle}
                            </p>
                            <p>
                                Submissions begin on{" "}
                                <span className="font-mono">
                                    {
                                        CONTENT_BRANCH_POLICY.submissionBranchPrefix
                                    }
                                </span>
                                . Issue assembly proceeds on{" "}
                                <span className="font-mono">
                                    {CONTENT_BRANCH_POLICY.journalBranchPrefix}
                                </span>
                                .
                            </p>
                            <p>
                                Reader discussion is organised through GitHub
                                Discussions under{" "}
                                <span className="font-mono">
                                    {CONTENT_DISCUSSION_CATEGORIES.article}
                                </span>{" "}
                                and{" "}
                                <span className="font-mono">
                                {CONTENT_DISCUSSION_CATEGORIES.journal}
                                </span>
                                , {staticCopy.footer.discussionsDescription}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p className={"font-bold"}>Moldy Potato Film Journal · {siteConfig.year}</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1">
                            <Link
                                href="/submit"
                                className="transition-colors hover:text-foreground"
                            >
                                Submission Notes
                            </Link>
                            <Link
                                href="/articles"
                                className="transition-colors hover:text-foreground"
                            >
                                Article Archive
                            </Link>
                            <p>{staticCopy.footer.closingNote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
