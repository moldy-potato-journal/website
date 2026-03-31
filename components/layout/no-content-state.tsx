import Link from "next/link"

import { SectionLabel } from "@/components/home/section-label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type NoContentStateProps = {
    title?: string
    description: string
}

export function NoContentState({
    title = "No content available",
    description,
}: NoContentStateProps) {
    return (
        <section>
            <Card className="rounded-none border-border bg-background shadow-none">
                <CardHeader className="gap-4">
                    <SectionLabel>Content Source</SectionLabel>
                    <CardTitle className="font-heading text-3xl leading-tight sm:text-4xl">
                        {title}
                    </CardTitle>
                    <CardDescription className="max-w-3xl text-base leading-8">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap gap-3">
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/status">Check Status</Link>
                    </Button>
                </CardFooter>
            </Card>
        </section>
    )
}
