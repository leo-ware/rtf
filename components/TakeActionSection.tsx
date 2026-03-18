"use client"

import CardLayout from "./public-ui/CardLayout"
import Header from "./public-ui/Header"
import TakeActionLink from "./TakeActionLink"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Button from "./public-ui/Button"
import { cn } from "@/lib/utils"
import { Loader2, ChevronDownIcon } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import type { TopicNameType } from "@/lib/topicType"

import TakeActionImage1 from "./images/take-action-1.jpg"
import TakeActionImage2 from "./images/take-action-2.jpg"
import TakeActionImage3 from "./images/take-action-3.jpg"

const TakeActionSkeletonCard = ({ className }: { className?: string }) => {
    return (
        <div className={cn("aspect-[8/7] w-full rounded-md overflow-hidden relative", className)}>
            <div className="absolute inset-0 bg-slate-700 animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-12 pb-4">
                <div className="h-6 w-10/12 bg-white/20 rounded animate-pulse" />
            </div>
        </div>
    )
}

type TakeActionSectionProps = {
    rows?: number
    showControls?: boolean
    topic?: TopicNameType
}

const TakeActionSection = ({ rows = 1, showControls = false, topic }: TakeActionSectionProps) => {
    const rowSize = 3
    const initCount = rowSize * rows
    const { results: recommended, loadMore, status: recommendedStatus } = usePaginatedQuery(
        api.takeActionArticle.recommendTakeActionArticles,
        {},
        { initialNumItems: initCount }
    )

    const topicArticles = useQuery(
        api.takeActionArticle.getTopicTakeActionArticles,
        topic ? { topic } : "skip"
    )

    const articles = useMemo(() => {
        if (!topic) return recommended

        const topicResults = topicArticles ?? []
        const topicIds = new Set(topicResults.map(a => a._id))
        const supplemental = recommended.filter(a => !topicIds.has(a._id))
        return [...topicResults, ...supplemental]
    }, [topic, topicArticles, recommended])

    const fallbackImages = [TakeActionImage1, TakeActionImage2, TakeActionImage3]

    const isLoading = recommendedStatus === "LoadingFirstPage" || (topic && topicArticles === undefined)

    return (
        <div id="take-action" className="bg-slate-teal py-12 w-full">
            <div className="w-11/12 mx-auto grid justify-items-center gap-8">
            <Header level={1} className="text-white">
                Take Action
            </Header>

            <CardLayout className={"gap-6"}>
                {(
                    <>
                        {isLoading && (
                            [...Array(initCount)].map((_, idx) => (
                                <TakeActionSkeletonCard key={idx} className="mx-auto" />
                            ))
                        )}

                        {!isLoading && articles && articles.length > 0 && (
                            articles.slice(0, showControls ? undefined : initCount).map((article, idx) => (
                                <TakeActionLink
                                    key={article._id}
                                    className="mx-auto"
                                    title={article.title}
                                    href={article.slug ? `/resources/take-action/${article.slug}` : undefined}
                                    image={article.image}
                                    fallbackImage={fallbackImages[idx % fallbackImages.length]}
                                />
                            ))
                        )}
                    </>
                )}

                {showControls && ["CanLoadMore", "LoadingMore"].includes(recommendedStatus) && (
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
                                    <div className="text-sm font-medium text-white/80 group-hover:text-white">
                                        Show More
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4 text-white/80 group-hover:text-white" />
                                </div>
                            )}
                            {recommendedStatus === "LoadingMore" && (
                                <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                            )}
                        </div>
                    </div>
                )}

                {!showControls && (
                    <div className="col-span-full flex items-center justify-center">
                        <Link href="/take-action">
                            <Button color="cinnamon">Learn More</Button>
                        </Link>
                    </div>
                )}
            </CardLayout>
            </div>
        </div>
    )
}

export default TakeActionSection
