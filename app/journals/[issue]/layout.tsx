import type { ReactNode } from "react"

import { loadJournalIssueStaticParams } from "@/lib/content-loader"

export const dynamicParams = false

export async function generateStaticParams() {
    return loadJournalIssueStaticParams()
}

export default function JournalIssueLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
