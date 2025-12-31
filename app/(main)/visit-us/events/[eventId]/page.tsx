"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { PageProps } from "@/lib/types"
import { use } from "react"
import { notFound } from "next/navigation"
import Header from "@/components/public-ui/Header"
import ConvexImage from "@/components/images/ConvexImage"
import LargeLoader from "@/components/public-ui/LargeLoader"
import RegisterButton from "@/components/RegisterButton"

const EventPage = ({ params }: PageProps<{ eventId: Id<"events"> }>) => {
    const { eventId } = use(params)
    const event = useQuery(api.events.getEventById, { id: eventId })

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
                    />
                ) : (
                    null
                    // <Image
                    //     src={DefaultHeroImage}
                    //     alt="Default Event Image"
                    //     className="w-full h-full object-cover"
                    //     fill
                    // />
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
                        Tickets
                        {!event.tickets?.options && ("Free")}
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1">
                        {event.tickets?.options && event.tickets?.options.map((option) => (
                            <div key={option.name} className="flex items-start justify-start gap-2">
                                <div>{option.name}:</div>
                                {option.price && option.price > 0
                                    ? (
                                        <div>${option.price.toFixed(2)}</div>
                                    ) : (
                                        <div>Free</div>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full my-8 mx-auto h-fit flex items-center justify-center">
                    <RegisterButton eventId={eventId} />
                </div>
            </div>
        </div>
    )
}

export default EventPage