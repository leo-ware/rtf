"use client"

import { useState } from "react"
import { cn, formatDateRange } from "@/lib/utils"
import { MdArrowRightAlt } from "react-icons/md"
import { api } from "@/convex/_generated/api"
import { usePaginatedQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import ScrollDiv from "./ScrollDiv"
import { ImSpinner8 } from "react-icons/im"
import Link from "next/link"
import { FaCaretRight } from "react-icons/fa"

const UpcomingEventsWidget = ({ className }: { className?: string }) => {

    const { results: events, loadMore, status: eventsStatus } = usePaginatedQuery(
        api.events.getPaginatedEvents,
        { paginationOpts: { numItems: 100 } },
        { initialNumItems: 100 }
    )

    // const [tabState, setTabState] = useState<"all" | "week" | "month" | "year">("all")
    const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(null)

    return (
        <div className={cn(`
            w-auto h-full @container
            mx-auto px-8 py-8 
            flex flex-col items-center justify-center
            bg-seashell
        `, className)}>
            <div
                className={`
                    w-full h-full max-w-5xl
                    grid gap-8
                    grid-rows-[auto_1fr]
                    grid-cols-[1fr]
                    @xl:grid-cols-[250px_1fr]
                    @4xl:grid-cols-[250px_1fr_250px]
                `}
            >
                {/* <div className={`
                    col-span-1 @xl:col-start-2 w-full
                    flex items-center justify-between gap-6
                    underline-offset-4
                    `}>
                    {([
                        {
                            name: "All Events",
                            value: "all"
                        },
                        {
                            name: "This Week",
                            value: "week"
                        },
                        {
                            name: "This Month",
                            value: "month"
                        },
                        {
                            name: "This Year",
                            value: "year"
                        }
                    ] as const).map(({ name, value }) => (
                        <div
                            className={`
                                font-semibold uppercase cursor-pointer text-[16px]
                                ${tabState === value
                                    ? "text-cinnamon underline decoration-2"
                                    : "text-pewter"}
                                `}
                            onClick={() => setTabState(value)}
                        >
                            {name}
                        </div>
                    ))}
                </div> */}
                <ScrollDiv
                    onScrollNearBottom={() => {
                        if (eventsStatus === "CanLoadMore") {
                            loadMore(20)
                        }
                    }}
                    className={`
                        col-start-1 col-span-1 @xl:col-span-2
                        h-fit max-h-full
                        grid grid-cols-subgrid
                        overflow-y-scroll scrollbar-always
                    `}
                >

                    {events?.map((event) => (
                        <div key={event._id} className="col-span-full grid grid-cols-subgrid pr-2">
                            <div className="hidden @xl:block col-span-1">
                                <div className={`text-[18px] font-semibold leading-none`}>
                                    {formatDateRange(new Date(event.startDate), new Date(event.endDate))}
                                </div>
                            </div>
                            <div className="col-span-1 mb-8">
                                <div
                                    className={`
                                        cursor-pointer
                                        flex items-center gap-1
                                        leading-none text-[22px]
                                        ${selectedEventId === event._id ? "text-cinnamon" : ""}
                                    `}
                                    onClick={() => setSelectedEventId((prev) => {
                                        if (prev === event._id) {
                                            return null
                                        }
                                        return event._id
                                    })}
                                >
                                    {event.title}
                                    <FaCaretRight
                                        size={16}
                                        className={`
                                            text-ink/60 transition-transform duration-100
                                            ${selectedEventId === event._id ? "rotate-90" : "rotate-0"}
                                        `} />
                                </div>
                                <div className="block @xl:hidden mt-2">
                                    <div className={`text-[14px] leading-none`}>
                                        {formatDateRange(new Date(event.startDate), new Date(event.endDate))}
                                    </div>
                                </div>
                                {selectedEventId === event._id && (
                                    <div className="space-y-4 mt-2">
                                        <div className="text-[16px] text-ink/60">
                                            {event.description}
                                        </div>
                                        <Link
                                            onClick={e => e.stopPropagation()}
                                            href={`/visit-us/events/${event._id}`}
                                            className="group flex items-center gap-1 cursor-pointer">
                                            <div className={`
                                                text-[16px] text-pewter font-semibold uppercase
                                                group-hover:underline decoration-1 underline-offset-4
                                                `}>
                                                View Full Event Details
                                            </div>
                                            <MdArrowRightAlt size={24} className="text-pewter" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {eventsStatus === "LoadingFirstPage" && (
                        <div className={`
                            col-start-1 col-span-1 @xl:col-start-2
                            flex items-center justify-center gap-2
                            `}>
                            <ImSpinner8 className="w-4 h-4 animate-spin" />
                            <div className="text-lg text-ink">
                                Loading events...
                            </div>
                        </div>
                    )}
                </ScrollDiv>
                <div className="col-span-full" />
            </div>
        </div>
    )
}

export default UpcomingEventsWidget