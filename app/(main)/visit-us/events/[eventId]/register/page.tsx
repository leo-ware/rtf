"use client"

import { PageProps } from "@/lib/types"
import { Id } from "@/convex/_generated/dataModel"
import { use, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { notFound } from "next/navigation"
import LargeLoader from "@/components/public-ui/LargeLoader"
import Header from "@/components/public-ui/Header"

const EventRegisterPage = ({ params }: PageProps<{ eventId: Id<"events"> }>) => {
    const { eventId } = use(params)
    const event = useQuery(api.events.getEventById, { id: eventId })

    useEffect(() => {
        if (event && event.registrationLink) {
            // Redirect to external registration link
            window.location.href = event.registrationLink
        }
    }, [event])

    if (event === null) {
        return notFound()
    }

    if (event === undefined) {
        return <LargeLoader />
    }

    // If event has a registration link, show loading while redirecting
    if (event.registrationLink) {
        return (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center">
                <Header level={1} className="text-pewter max-w-8/12">
                    Redirecting to Registration
                </Header>
                <p className="text-lg text-pewter mt-4">
                    Please wait while we redirect you to the registration page...
                </p>
                <LargeLoader />
            </div>
        )
    }

    // If event doesn't require registration
    if (!event.requiresRegistration) {
        return (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center">
                <Header level={1} className="text-pewter max-w-8/12">
                    No Registration Required
                </Header>
                <p className="text-lg text-pewter mt-4">
                    This event does not require registration. Please feel free to attend!
                </p>
            </div>
        )
    }

    // If event requires registration but no link is provided
    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center">
            <Header level={1} className="text-pewter max-w-8/12">
                Registration Not Available
            </Header>
            <p className="text-lg text-pewter mt-4">
                Registration is required for this event, but no registration link is currently available.
            </p>
            <p className="text-lg text-pewter mt-2">
                Please contact us for more information.
            </p>
        </div>
    )
}

export default EventRegisterPage
