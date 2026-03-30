"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"

type HeaderLink = {
    href: string
    label: string
}

type JournalHeaderNavProps = {
    links: HeaderLink[]
}

function getBaseHref(href: string) {
    const [baseHref] = href.split("#")
    return baseHref || "/"
}

export function JournalHeaderNav({ links }: JournalHeaderNavProps) {
    const pathname = usePathname()
    const primaryLinks = links.filter((link) => link.href !== "/submit")
    const submitLink = links.find((link) => link.href === "/submit")

    return (
        <nav className="flex shrink-0 flex-wrap items-center gap-2 xl:justify-self-end">
            {primaryLinks.map((link) => {
                const baseHref = getBaseHref(link.href)
                const isActive =
                    baseHref === pathname ||
                    (baseHref !== "/" && pathname.startsWith(baseHref))

                return (
                    <Button
                        key={link.href}
                        variant={isActive ? "outline" : "ghost"}
                        size="sm"
                        asChild
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Link href={link.href}>{link.label}</Link>
                    </Button>
                )
            })}

            {submitLink ? (
                <>
                    <span
                        aria-hidden="true"
                        className="mx-1 hidden h-5 w-px bg-border sm:block"
                    />
                    <Button
                        variant={
                            pathname.startsWith("/submit") ? "outline" : "ghost"
                        }
                        size="sm"
                        asChild
                        aria-current={
                            pathname.startsWith("/submit") ? "page" : undefined
                        }
                    >
                        <Link href={submitLink.href}>{submitLink.label}</Link>
                    </Button>
                </>
            ) : null}
        </nav>
    )
}
