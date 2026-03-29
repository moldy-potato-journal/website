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
import { Separator } from "@/components/ui/separator"
import { CONTENT_BRANCH_POLICY, CONTENT_REPOSITORY } from "@/lib/content-source"
import { siteConfig } from "@/lib/site"

export default function SubmitPage() {
  return (
    <main className="min-h-svh px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <JournalHeader
          title="Submit"
          description="Submission guidance for standalone articles and journal-bound work."
          links={[
            { href: "/", label: siteConfig.name },
            { href: "/articles", label: "Articles" },
            { href: "/submit", label: "Submit" },
          ]}
        />

        <Card className="rounded-none border-border bg-background shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-3xl leading-tight">
              Submit through the content repository
            </CardTitle>
            <CardDescription className="text-base leading-8">
              Contributions are managed through GitHub pull requests to the
              content repository. Standalone articles can target the main
              branch. Issue-bound work can be assembled on dedicated journal
              branches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7">
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Repository
              </p>
              <p>{CONTENT_REPOSITORY.url}</p>
            </div>
            <Separator />
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Submission Branch Prefix
              </p>
              <p>{CONTENT_BRANCH_POLICY.submissionBranchPrefix}</p>
            </div>
            <Separator />
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Journal Branch Prefix
              </p>
              <p>{CONTENT_BRANCH_POLICY.journalBranchPrefix}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={`${CONTENT_REPOSITORY.url}/compare`}
                target="_blank"
                rel="noreferrer"
              >
                Open Submission PR
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={CONTENT_REPOSITORY.url} target="_blank" rel="noreferrer">
                View Content Repo
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
