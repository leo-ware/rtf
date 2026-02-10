import { PageProps } from "@/lib/types"
import { Id } from "@/convex/_generated/dataModel"
import { redirect, notFound } from "next/navigation"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import Header from "@/components/public-ui/Header"
import Link from "next/link"

const EventRegisterPage = async ({ params }: PageProps<{ eventId: Id<"events"> }>) => {
    const { eventId } = await params
    const event = await fetchQuery(api.events.getEventById, { id: eventId })

    if (event === null) {
        return notFound()
    }

    if (event.registrationLink) {
        redirect(event.registrationLink)
    }

    // Fallback when no external registration link is configured
    return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-6 p-12">
            <Header level={1} className="text-pewter">
                Registration Not Available
            </Header>
            <p className="text-center text-lg max-w-xl">
                Online registration is not currently available for this event.
                Please contact us for more information about how to register.
            </p>
            <Link
                href={`/visit-us/events/${eventId}`}
                className="text-cinnamon hover:underline"
            >
                &larr; Back to event details
            </Link>
        </div>
    )
}

export default EventRegisterPage
