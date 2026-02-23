import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { PageProps } from "@/lib/types"
import EventContent from "./EventContent"

type Props = PageProps<{ eventId: string }>

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { eventId } = await params
    const event = await fetchQuery(api.events.getEventById, {
        id: eventId as Id<"events">
    })

    if (!event) {
        return {
            title: "Event Not Found | Return to Freedom",
        }
    }

    // Strip HTML tags for description
    const plainDescription = event.description.replace(/<[^>]*>/g, "").slice(0, 160)

    return {
        title: `${event.title} | Events | Return to Freedom`,
        description: plainDescription,
        openGraph: {
            title: `${event.title} | Events | Return to Freedom`,
            description: plainDescription,
            type: "website",
            images: event.image?.url ? [{ url: event.image.url }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${event.title} | Events | Return to Freedom`,
            description: plainDescription,
            images: event.image?.url ? [event.image.url] : [],
        },
    }
}

const EventPage = async ({ params }: Props) => {
    const { eventId } = await params
    return <EventContent eventId={eventId as Id<"events">} />
}

export default EventPage
