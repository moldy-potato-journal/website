import type { ReactNode } from "react"

import { loadJournalEntryStaticParams } from "@/lib/content-loader"

export const dynamicParams = false

export async function generateStaticParams({
    params,
}: {
    params: { issue: string; article: string }
}) {
    const { issue } = params
    return loadJournalEntryStaticParams(issue)
}

export default function JournalIssueArticleLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
