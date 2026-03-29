import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { SectionLabel } from "@/components/home/section-label"
import { JournalHeaderNav } from "@/components/layout/journal-header-nav"

type HeaderLink = {
  href: string
  label: string
}

type JournalHeaderProps = {
  title: string
  description: string
  links?: HeaderLink[]
}

const defaultLinks: HeaderLink[] = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
]

export function JournalHeader({
  title,
  description,
  links = defaultLinks,
}: JournalHeaderProps) {
  return (
    <header>
      <Card className="rounded-none border-border bg-background shadow-none">
        <CardHeader className="gap-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <SectionLabel>Film Journal</SectionLabel>
              <CardTitle className="font-heading text-4xl tracking-tight sm:text-5xl">
                {title}
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-7 sm:text-base">
                {description}
              </CardDescription>
            </div>

            <JournalHeaderNav links={links} />
          </div>
        </CardHeader>
      </Card>
    </header>
  )
}
