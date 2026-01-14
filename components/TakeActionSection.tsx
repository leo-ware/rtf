"use client"

import CardLayout from "./public-ui/CardLayout"
import Header from "./public-ui/Header"
import TakeActionLink from "./TakeActionLink"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"

import TakeActionImage1 from "./images/take-action-1.jpg"
import TakeActionImage2 from "./images/take-action-2.jpg"
import TakeActionImage3 from "./images/take-action-3.jpg"

const TakeActionSkeletonCard = ({ className }: { className?: string }) => {
    return (
        <div className={cn("aspect-[8/7] w-full bg-seashell rounded-md overflow-hidden", className)}>
            <div className="w-full h-8/12 bg-gray-200 animate-pulse" />
            <div className="px-6 py-2 w-full h-4/12 flex items-center justify-center">
                <div className="h-6 w-10/12 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    )
}

type TakeActionSectionProps = {
    count?: number
}

const TakeActionSection = ({ count = 3 }: TakeActionSectionProps) => {
    const safeCount = Math.max(0, Math.floor(count))
    const recommended = useQuery(
        api.takeActionArticle.recommendTakeActionArticles,
        { limit: safeCount || 1 }
    )

    const images = [TakeActionImage1, TakeActionImage2, TakeActionImage3]
    const fallbackTitles = [
        "Sign a petition to end horse slaughter in the United States",
        "Contact your representative to ensure this bill does not pass",
        "Show your support protesting the BLM's actions",
    ]

    const clippedCount = Math.min(safeCount, recommended?.length ?? 0) || 1
    const gridCols = cn(
        "grid grid-cols-1 gap-4",
        clippedCount >= 2 && "md:grid-cols-2",
        clippedCount >= 3 && "lg:grid-cols-3",
        clippedCount >= 4 && "xl:grid-cols-4",
    )

    return (
        <div id="take-action" className="w-11/12 mx-auto grid justify-items-center gap-8">
            <Header level={1} className="text-cinnamon">
                Take Action
            </Header>

            <CardLayout className={gridCols}>
                {safeCount === 0 ? null : (
                    <>
                        {recommended === undefined && [...Array(safeCount)].map((_, idx) => (
                            <TakeActionSkeletonCard key={idx} className="mx-auto" />
                        ))}

                        {recommended !== undefined && (
                            (recommended.length === 0)
                                ? [...Array(safeCount)].map((_, idx) => (
                                    <TakeActionLink
                                        key={idx}
                                        className="mx-auto"
                                        title={fallbackTitles[idx % fallbackTitles.length]}
                                        image={images[idx % images.length]}
                                    />
                                ))
                                : [...Array(Math.min(safeCount, recommended.length))].map((_, idx) => (
                                    <TakeActionLink
                                        key={recommended[idx]._id}
                                        className="mx-auto"
                                        title={recommended[idx].title}
                                        href={recommended[idx].slug ? `/resources/take-action/${recommended[idx].slug}` : undefined}
                                        imageId={recommended[idx].imageId}
                                        image={images[idx % images.length]}
                                    />
                                ))
                        )}
                    </>
                )}
            </CardLayout>
        </div>
    )
}

export default TakeActionSection