"use client"

import { useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { notFound } from "next/navigation"
import Header from "@/components/public-ui/Header"
import ConvexImage from "@/components/images/ConvexImage"
import LargeLoader from "@/components/public-ui/LargeLoader"
import RegisterButton from "@/components/RegisterButton"
import { formatDate, formatDateRange } from "@/lib/utils"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

type EventContentProps = {
    eventId: Id<"events">
}

const EventContent = ({ eventId }: EventContentProps) => {
    const event = useQuery(api.events.getEventById, { id: eventId })
    const tracked = useRef(false)

    useEffect(() => {
        if (event && !tracked.current) {
            tracked.current = true
            trackEvent(AnalyticsEvents.EVENT_VIEWED, {
                title: event.title,
                eventId,
            })
        }
    }, [event, eventId])

    if (event === null) {
        return notFound()
    }

    if (event === undefined) {
        return <LargeLoader />
    }

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-12 mb-16">

            <div className="relative w-full h-[50vh]">
                {event?.image?.url ? (
                    <ConvexImage
                        src={event?.image?.url || ""}
                        alt={event?.image?.altText || ""}
                        width={event?.image?.width || 0}
                        height={event?.image?.height || 0}
                        className="w-full h-full object-cover"
                        authorCredit={event?.image?.authorCredit}
                    />
                ) : (
                    null
                )}
            </div>

            <Header level={1} className={`text-pewter max-w-8/12 ${event.status === "cancelled" ? "line-through text-gray-500" : ""}`}>
                {event.title}
            </Header>

            <div className="max-w-8/12 text-center flex flex-col items-center gap-2">
                {(() => {
                    const start = new Date(event.startDate)
                    const end = new Date(event.endDate)
                    const sameDay = start.toDateString() === end.toDateString()
                    const startTime = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                    const endTime = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

                    return (
                        <>
                            <div className="text-2xl font-serif text-cinnamon">
                                {sameDay
                                    ? formatDate(start, { includeYear: true })
                                    : formatDateRange(start, end, { forceIncludeYear: true })
                                }
                            </div>
                            {sameDay && startTime !== endTime && (
                                <div className="text-lg text-gray-400">
                                    {startTime} – {endTime}
                                </div>
                            )}
                        </>
                    )
                })()}
                {event.location && (
                    <div className="text-lg text-gray-400">
                        {event.location}
                    </div>
                )}
                {(!event.status || event.status === "scheduled") && (
                    <RegisterButton eventId={eventId} />
                )}
            </div>

            {event.status === "cancelled" && (
                <div className="w-full max-w-8/12 text-gray-500 text-center text-2xl font-serif">
                    This event has been cancelled.
                </div>
            )}
            {event.status === "sold_out" && (
                <div className="w-full max-w-8/12 text-pewter text-center text-2xl font-serif">
                    This event is sold out.
                </div>
            )}

            <div className={`
                max-w-8/12
                w-fit mx-auto h-fit flex flex-col items-center justify-center gap-4
                text-lg prose prose-lg
                `}>
                <div
                    className="max-w-none w-full"
                    dangerouslySetInnerHTML={{ __html: event.description }} />
                {event.longDescription && (
                    <div
                        className="max-w-none w-full"
                        dangerouslySetInnerHTML={{ __html: event.longDescription }}
                    />
                )}

                <div className={`
                w-full mx-auto h-fit flex flex-col items-start justify-center gap-2
                text-lg text-pewter
            `}>
                    <div>
                        <span className="font-semibold">Price: </span>
                        {event.ticketPriceText || "Free"}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EventContent
