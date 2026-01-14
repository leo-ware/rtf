"use client"

import CardLayout from "./public-ui/CardLayout"
import Header from "./public-ui/Header"
import TakeActionLink from "./TakeActionLink"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { Loader2, ChevronDownIcon } from "lucide-react"

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
    rows?: number
    showControls?: boolean
}

const TakeActionSection = ({ rows = 1, showControls = false }: TakeActionSectionProps) => {
    const rowSize = 3
    const initCount = rowSize * rows
    const { results: recommended, loadMore, status: recommendedStatus } = usePaginatedQuery(
        api.takeActionArticle.recommendTakeActionArticles,
        {},
        { initialNumItems: initCount }
    )

    const fallbackImages = [TakeActionImage1, TakeActionImage2, TakeActionImage3]

    return (
        <div id="take-action" className="w-11/12 mx-auto grid justify-items-center gap-8">
            <Header level={1} className="text-cinnamon">
                Take Action
            </Header>

            <CardLayout className={"gap-4"}>
                {(
                    <>
                        {recommendedStatus === "LoadingFirstPage" && (
                            [...Array(initCount)].map((_, idx) => (
                                <TakeActionSkeletonCard key={idx} className="mx-auto" />
                            ))
                        )}

                        {recommended && recommended.length > 0 && (
                            recommended.map((recommendedArticle, idx) => (
                                <TakeActionLink
                                    key={recommendedArticle._id}
                                    className="mx-auto"
                                    title={recommendedArticle.title}
                                    href={recommendedArticle.slug ? `/resources/take-action/${recommendedArticle.slug}` : undefined}
                                    image={recommendedArticle.image}
                                    fallbackImage={fallbackImages[idx % fallbackImages.length]}
                                />
                            ))
                        )}
                    </>
                )}

                {(showControls && ["CanLoadMore", "LoadingMore"].includes(recommendedStatus)) && (
                    <div className="col-span-full flex items-center justify-center gap-2">
                        <div
                            className="cursor-pointer w-fit h-fit"
                            onClick={() => {
                                if (recommendedStatus === "CanLoadMore") {
                                    loadMore(rowSize)
                                }
                            }}
                        >
                            {recommendedStatus === "CanLoadMore" && (
                                <div className="flex flex-col items-center justify-center group">
                                    <div className="text-sm font-medium text-pewter group-hover:text-pewter/80">
                                        Show More
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4 text-pewter group-hover:text-pewter/80" />
                                </div>
                            )}
                            {recommendedStatus === "LoadingMore" && (
                                <Loader2 className="w-4 h-4 animate-spin text-pewter" />
                            )}
                        </div>
                    </div>
                )}
            </CardLayout>
        </div>
    )
}

export default TakeActionSection