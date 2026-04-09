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
import { useEffect, useMemo, useRef, useState } from "react"
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

    const topicIds = useMemo(
        () => new Set((topicArticles ?? []).map(a => a._id)),
        [topicArticles]
    )

    const articles = useMemo(() => {
        if (!topic) return recommended

        const topicResults = topicArticles ?? []
        const supplemental = recommended.filter(a => !topicIds.has(a._id))
        return [...topicResults, ...supplemental]
    }, [topic, topicArticles, topicIds, recommended])

    // Number of articles currently revealed. Topic articles are always
    // shown in full, so the floor is max(initCount, topicArticles.length).
    const minVisible = Math.max(initCount, topicArticles?.length ?? 0)
    const [visibleCount, setVisibleCount] = useState(initCount)
    const effectiveVisible = Math.max(visibleCount, minVisible)

    // Eagerly load the next page so we always know whether there is at
    // least one more (deduped) article to reveal. When recommended pages
    // overlap entirely with topic articles, this loop keeps loading
    // until we either find a new article or exhaust the query — which is
    // the only way to definitively answer "is there more to show?" given
    // the client-side dedup.
    //
    // Convex sometimes reports `CanLoadMore` but then returns no new
    // items. To avoid spinning forever, we record the `recommended.length`
    // we last triggered a loadMore at, and if we end up back at
    // `CanLoadMore` with the same length, we treat the query as
    // exhausted on the client and stop asking.
    const lastLoadTriggerLength = useRef(-1)
    const [clientExhausted, setClientExhausted] = useState(false)

    // If `recommended` grew (or shrank) via some other path, the stall is
    // no longer the latest signal — reset the guard so we'll try again.
    useEffect(() => {
        if (recommended.length !== lastLoadTriggerLength.current) {
            setClientExhausted(false)
        }
    }, [recommended.length])

    useEffect(() => {
        if (clientExhausted) return
        if (recommendedStatus !== "CanLoadMore") return
        if (articles.length > effectiveVisible) return
        if (lastLoadTriggerLength.current === recommended.length) {
            // We already asked at this length and convex returned nothing
            // new — bail out and treat as exhausted.
            setClientExhausted(true)
            return
        }
        lastLoadTriggerLength.current = recommended.length
        loadMore(rowSize)
    }, [clientExhausted, recommendedStatus, recommended.length, articles.length, effectiveVisible, loadMore])

    const canShowMore = articles.length > effectiveVisible
    const isExhausted = recommendedStatus === "Exhausted" || clientExhausted

    const fallbackImages = [TakeActionImage1, TakeActionImage2, TakeActionImage3]

    const isLoading = recommendedStatus === "LoadingFirstPage" || (topic && topicArticles === undefined)
    // While we're still loading ahead to figure out if more exists, show a
    // spinner in place of the button so it doesn't flicker on/off.
    const isResolvingMore =
        showControls &&
        !canShowMore &&
        !isExhausted &&
        (recommendedStatus === "LoadingMore" ||
            (recommendedStatus === "CanLoadMore" && articles.length <= effectiveVisible))

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
                            articles.slice(0, showControls ? effectiveVisible : initCount).map((article, idx) => (
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

                {showControls && (canShowMore || isResolvingMore) && (
                    <div className="col-span-full flex items-center justify-center gap-2">
                        <div
                            className="cursor-pointer w-fit h-fit"
                            onClick={() => {
                                if (canShowMore) {
                                    setVisibleCount(c => Math.max(c, effectiveVisible) + rowSize)
                                }
                            }}
                        >
                            {canShowMore && (
                                <div className="flex flex-col items-center justify-center group">
                                    <div className="text-sm font-medium text-white/80 group-hover:text-white">
                                        Show More
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4 text-white/80 group-hover:text-white" />
                                </div>
                            )}
                            {!canShowMore && isResolvingMore && (
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
