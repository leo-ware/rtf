"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TagBadgesProps = {
    tagIds?: Id<"tags">[]
    className?: string
}

export function TagBadges({ tagIds, className }: TagBadgesProps) {
    const allTags = useQuery(api.tags.list)

    if (!tagIds || tagIds.length === 0 || !allTags) {
        return null
    }

    const tagsToDisplay = allTags.filter(tag => tagIds.includes(tag._id))

    if (tagsToDisplay.length === 0) return null

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {tagsToDisplay.map((tag) => (
                <Badge key={tag._id} variant="secondary" className="text-xs font-normal">
                    #{tag.name}
                </Badge>
            ))}
        </div>
    )
}
