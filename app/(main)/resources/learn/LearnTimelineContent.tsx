"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import Tabs from "@/components/public-ui/Tabs"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"
import { ImSpinner8 } from "react-icons/im"

const LearnTimelineContentInner = () => {
    const searchParams = useSearchParams()
    const timelineSlug = searchParams.get("timeline")

    const timelines = useQuery(api.learnTimelines.listPublicTimelinesWithItems)

    const timelinesRef = useRef<HTMLDivElement>(null)
    const hasScrolled = useRef(false)

    const [activeTimelineId, setActiveTimelineId] = useState<string | null>(null)

    // Set initial active timeline based on slug or first timeline
    useEffect(() => {
        if (!timelines || timelines.length === 0) return
        if (activeTimelineId) return

        if (timelineSlug) {
            const matched = timelines.find((t) => t.slug === timelineSlug)
            if (matched) {
                setActiveTimelineId(matched._id)
                return
            }
        }

        setActiveTimelineId(timelines[0]._id)
    }, [timelines, timelineSlug, activeTimelineId])

    // Auto-scroll when timeline slug is present
    useEffect(() => {
        if (!timelineSlug || hasScrolled.current || !timelinesRef.current || !timelines) return
        hasScrolled.current = true
        timelinesRef.current.scrollIntoView({ behavior: "smooth" })
    }, [timelineSlug, timelines])

    const handleTabChange = useCallback((id: string) => {
        setActiveTimelineId(id)
    }, [])

    if (timelines === undefined) {
        return (
            <div className="flex items-center justify-center py-16">
                <ImSpinner8 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
        )
    }

    if (timelines.length === 0) {
        return null
    }

    const mapItems = (items: typeof timelines[number]["items"]) =>
        items
            .filter((item) => item.image?.url)
            .map((item) => ({
                superTitle: item.date,
                title: item.title,
                description: item.content,
                image: item.image!.url!,
                imageAlt: item.image?.altText,
                authorCredit: item.image?.authorCredit,
            }))

    // Find active timeline and its last item for the closing section
    const activeTimeline = timelines.find((t) => t._id === activeTimelineId) ?? timelines[0]
    const lastItem = activeTimeline.items.length > 0
        ? activeTimeline.items[activeTimeline.items.length - 1]
        : null

    // Exclude the last item from the alternating layout since it's rendered full-width below
    const mapItemsExcludingLast = (items: typeof timelines[number]["items"]) =>
        mapItems(items.length > 1 ? items.slice(0, -1) : items)

    const timelineContent = timelines.length === 1 ? (
        (() => {
            const items = mapItemsExcludingLast(timelines[0].items)
            if (items.length === 0) return null
            return (
                <AlternatingPictureLayout
                    showDivider
                    alternateTitleColors={true}
                    imageMode="natural"
                    items={items}
                />
            )
        })()
    ) : (
        <Tabs
            className="w-full"
            showDivider
            onTabChange={handleTabChange}
            defaultTabSelector={timelineSlug
                ? (item) => {
                    const matched = timelines.find((t) => t.slug === timelineSlug)
                    return matched ? item.id === matched._id : false
                }
                : undefined
            }
            items={timelines.map((timeline) => ({
                id: timeline._id,
                title: timeline.title,
                content: (() => {
                    const items = mapItemsExcludingLast(timeline.items)
                    if (items.length === 0) {
                        return (
                            <div className="text-center py-8 text-gray-500">
                                No items in this timeline yet.
                            </div>
                        )
                    }
                    return (
                        <AlternatingPictureLayout
                            showDivider
                            alternateTitleColors={true}
                            imageMode="natural"
                            items={items}
                        />
                    )
                })(),
            }))}
        />
    )

    return (
        <>
            <div ref={timelinesRef} className="w-10/12 mx-auto">
                {timelineContent}
            </div>

            {lastItem && lastItem.image?.url && (
                <div className="w-10/12 mb-16 mx-auto h-fit flex flex-col items-center justify-center gap-4 text-center">
                    <div className="text-[25px]">
                        {lastItem.date}
                    </div>
                    <div className="text-[48px] font-serif text-cinnamon">
                        {lastItem.title}
                    </div>
                    <div className="text-[20px] mb-2">
                        {lastItem.content}
                    </div>
                    <div className="w-8/12">
                        <ImageWithAuthorCredit
                            src={lastItem.image.url}
                            alt={lastItem.image.altText || lastItem.title}
                            width={1200}
                            height={800}
                            className="w-full aspect-auto object-cover"
                            authorCredit={lastItem.image.authorCredit}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

const LearnTimelineContent = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-16">
                <ImSpinner8 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
        }>
            <LearnTimelineContentInner />
        </Suspense>
    )
}

export default LearnTimelineContent
