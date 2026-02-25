"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import Hero from "@/components/public-ui/Hero"
import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import Button from "@/components/public-ui/Button"

import HeroImg from "../visit-us-hero.jpg"
import DefaultEventImage from "../defaultEventImage.png"

const monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const sDay = start.getDate()
    const sMonth = monthStrings[start.getMonth()]
    const sYear = start.getFullYear()
    const eDay = end.getDate()
    const eMonth = monthStrings[end.getMonth()]
    const eYear = end.getFullYear()

    const sameDay = sDay === eDay && start.getMonth() === end.getMonth() && sYear === eYear

    if (sameDay) return `${sMonth} ${sDay}, ${sYear}`
    if (sYear !== eYear) return `${sMonth} ${sDay}, ${sYear} – ${eMonth} ${eDay}, ${eYear}`
    if (start.getMonth() !== end.getMonth()) return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${sYear}`
    return `${sMonth} ${sDay}–${eDay}, ${sYear}`
}

const EventsPage = () => {
    const standaloneEvents = useQuery(api.events.getUpcomingStandaloneEvents)
    const status = standaloneEvents === undefined
        ? "loading"
        : standaloneEvents.length === 0
            ? "empty"
            : "success"

    const items = (standaloneEvents || []).map((event) => ({
        title: (
            <Link href={`/visit-us/events/${event._id}`} className="hover:underline">
                {event.title}
            </Link>
        ),
        description: (
            <div>
                <p className="text-base text-pewter font-semibold mb-2">
                    {formatDateRange(event.startDate, event.endDate)}
                    {event.location && ` · ${event.location}`}
                </p>
                <p className="my-2">{event.description}</p>
                <Link href={`/visit-us/events/${event._id}`}>
                    <Button color="cinnamon" className="py-1 px-2">View Details</Button>
                </Link>
            </div>
        ),
        image: event.image?.url || DefaultEventImage,
        imageAlt: event.image?.altText || event.title,
        authorCredit: event.image?.authorCredit,
    }))

    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <div className="w-full h-fit">
                <Hero title="Events" image={HeroImg} />

                <div className="w-full h-fit bg-seashell py-12">
                    <Header className="text-pewter">Upcoming Events</Header>
                    <UpcomingEventsWidget />
                </div>
            </div>
            <div className="w-full py-16">
                {status === "loading" && (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                )}

                {status === "empty" && (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-lg text-ink/50">No upcoming standalone events</p>
                    </div>
                )}

                {status === "success" && (
                    <AlternatingPictureLayout
                        alternateTitleColors
                        items={items}
                    />
                )}
            </div>
        </div>
    )
}

export default EventsPage
