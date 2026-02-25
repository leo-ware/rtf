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

            <Header level={1} className="text-pewter max-w-8/12">
                {event.title}
            </Header>

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

                <div className="not-prose w-full my-8 mx-auto h-fit flex items-center justify-center">
                    <RegisterButton eventId={eventId} />
                </div>
            </div>
        </div>
    )
}

export default EventContent
