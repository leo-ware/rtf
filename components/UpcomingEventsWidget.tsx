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

const UpcomingEventsWidget = ({ className, size = "large" }: { className?: string, size?: "large" | "small" }) => {

    const { results: events, loadMore, status: eventsStatus } = usePaginatedQuery(
        api.events.getPaginatedEvents,
        { paginationOpts: { numItems: 100 } },
        { initialNumItems: 100 }
    )

    const [tabState, setTabState] = useState<"all" | "week" | "month" | "year">("all")
    const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(null)

    return (
        <div className={cn(
            `w-auto mx-auto h-fit bg-seashell px-8 py-8 flex flex-col items-center justify-center`,
            className
        )}>
            <div
                className={`w-full grid gap-8`}
                style={{
                    gridTemplateColumns: `
                    ${size === "large" ? "280px" : "200px"}
                    1fr
                    ${size === "large" ? "280px" : "200px"}
                    ` }}
            >
                <div className="col-start-2 col-span-1 min-w-fit flex items-center justify-between gap-8 pr-4 underline-offset-4">
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
                                font-semibold uppercase cursor-pointer text-[${size === "large" ? "16px" : "14px"}]
                                ${tabState === value
                                    ? "text-cinnamon underline decoration-2"
                                    : "text-pewter"}
                                `}
                            onClick={() => setTabState(value)}
                        >
                            {name}
                        </div>
                    ))}
                </div>

                <ScrollDiv
                    className={`
                        col-start-1 col-span-2 grid grid-cols-subgrid
                        max-h-[300px] ${size === "large" ? "min-h-[200px]" : "min-h-[150px]"}
                        overflow-y-auto scrollbar-always`}
                    onScrollNearBottom={() => loadMore(20)}
                    threshold={200}
                    >
                    {(events || []).map((event) => {
                        const multiday = event.endDate && (
                            (new Date(event.startDate)).getDay() !==
                            new Date(event.endDate).getDay()
                        )
                        const selected = selectedEventId === event._id

                        return (
                            <>
                                <div className={`col-start-1 col-span-1 w-full
                                    flex flex-col items-end justify-start
                                    ${size === "large" ? "mt-1" : "mt-2"}`}
                                >
                                    <div className={`text-[${size === "large" ? "23px" : "16px"}] font-semibold leading-none`}>
                                        {formatDateRange(new Date(event.startDate), new Date(event.endDate))}
                                    </div>
                                    {!multiday && (
                                        <div className={`text-[${size === "large" ? "17px" : "14px"}]`}>
                                            {new Date(event.startDate).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}-
                                            {new Date(event.endDate).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="col-start-2 col-span-2 mb-8 pr-4 flex flex-col items-start justify-start"
                                    onClick={() => setSelectedEventId((prev) => {
                                        if (prev === event._id) {
                                            return null
                                        }
                                        return event._id
                                    })}
                                >
                                    <div className={`
                                    leading-none
                                    text-[${size === "large" ? "28px" : "25px"}]
                                    ${selected ? "text-cinnamon" : ""}
                                `}>
                                        {event.title}
                                    </div>
                                    {selected && (
                                        <div>
                                            <div className="mt-6 text-[16px] text-ink/60">
                                                {event.description}
                                            </div>
                                            <Link
                                                onClick={e => e.stopPropagation()}
                                                href={`/visit-us/events/${event._id}`}
                                                className="mt-8 flex items-center gap-2 cursor-pointer">
                                                <div className="text-[16px] text-pewter font-semibold uppercase">
                                                    View Full Event Details
                                                </div>
                                                <MdArrowRightAlt size={20} className="text-pewter" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    })}
                    <div className="col-start-2 col-span-1 flex items-center justify-center">
                        {eventsStatus === "LoadingMore" && (
                            <ImSpinner8 className="w-4 h-4 animate-spin" />
                        )}
                        {/* {eventsStatus === "Exhausted" && (
                            <div className="text-[16px] text-gray-400">
                                No more events
                            </div>
                        )} */}
                    </div>
                </ScrollDiv>
            </div>
        </div>
    )
}

export default UpcomingEventsWidget