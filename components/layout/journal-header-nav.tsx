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

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
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
    </nav>
  )
}
