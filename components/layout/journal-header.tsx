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
    { href: "/journals", label: "Journals" },
    { href: "/submit", label: "Submit" },
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
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-x-8">
                        <div className="min-w-0 space-y-3 xl:col-span-2">
                            <SectionLabel>Film Journal</SectionLabel>
                            <CardTitle className="font-heading text-4xl tracking-tight sm:text-5xl xl:max-w-none xl:text-6xl">
                                {title}
                            </CardTitle>
                        </div>

                        <div className="min-w-0">
                            <CardDescription className="max-w-2xl text-sm leading-7 sm:text-base">
                                {description}
                            </CardDescription>
                        </div>

                        <div className="xl:self-end">
                            <JournalHeaderNav links={links} />
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </header>
    )
}
