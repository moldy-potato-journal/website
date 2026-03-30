import { Badge } from "@/components/ui/badge"

type SectionLabelProps = {
    children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
    return (
        <Badge variant="outline" className="w-fit tracking-[0.24em] uppercase">
            {children}
        </Badge>
    )
}
