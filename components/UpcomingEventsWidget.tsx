"use client"

import { useState } from "react"
import LongRightArrow from "./LongRightArrow"
import { cn, formatDateRange } from "@/lib/utils"

const events = [
    {
        id: "wild-horse-burro-day",
        title: "Wild Horse & Burro Day",
        description: "Join us for a day of wild horse and burro fun!",
        startDate: new Date("2025-12-01"),
        endDate: new Date("2025-12-01"),
        startTime: "10:00 AM",
        endTime: "4:00 PM",
    },
    {
        id: "wild-horse-burro-week",
        title: "Wild Horse & Burro Week",
        description: "Join us for a day of wild horse and burro fun!",
        startDate: new Date("2025-12-01"),
        endDate: new Date("2025-12-07"),
        startTime: "10:00 AM",
        endTime: "4:00 PM",
    },
    {
        id: "san-luis-obispo-santuary-tour-1",
        title: "San Luis Obispo Santuary Tour",
        description: "Join us for a tour of the San Luis Obispo Sanctuary!",
        startDate: new Date("2025-12-04"),
        endDate: new Date("2025-12-06"),
        startTime: "10:00 AM",
        endTime: "4:00 PM",
    },
    {
        id: "san-luis-obispo-santuary-tour",
        title: "San Luis Obispo Santuary Tour",
        description: "Join us for a tour of the San Luis Obispo Sanctuary!",
        startDate: new Date("2025-12-04"),
        endDate: new Date("2026-01-04"),
        startTime: "10:00 AM",
        endTime: "4:00 PM",
    },
]

const Event = ({ event, selected, onClick }: { event: typeof events[0], selected: boolean, onClick: () => void }) => {
    const multiday = event.endDate && (event.startDate.toLocaleDateString() !== event.endDate.toLocaleDateString())
    return (
        <>
            <div className="col-start-1 col-span-1 w-full flex flex-col items-end justify-start">
                <div className="text-md font-semibold">
                    {formatDateRange(event.startDate, event.endDate)}
                </div>
                {!multiday && (
                    <div className="text-sm">
                        {event.startTime}-
                        {event.endTime}
                    </div>
                )}
            </div>
            <div onClick={onClick} className="col-start-2 col-span-1 flex flex-col items-start justify-start">
                <div className={`text-xl ${selected ? "text-cinnamon" : ""}`}>
                    {event.title}
                </div>
                {selected && (
                    <div>
                        <div className="text-md">
                            {event.description}
                        </div>
                        <div className="mt-4 text-lg text-pewter flex items-center gap-2">
                            <div>View Details</div>
                            <LongRightArrow />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

const UpcomingEventsWidget = (
    { title = "Upcoming Events", className }:
        { title?: string | null, className?: string }
) => {

    const [tabState, setTabState] = useState<"all" | "week" | "month" | "year">("all")
    const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)

    return (
        <div className={cn(
            `w-full h-fit bg-seashell px-8 py-12 flex flex-col items-center justify-center`,
            className
        )}>
            {!!title && (
                <div className="text-3xl font-serif text-pewter">
                    Upcoming Events
                </div>
            )}

            <div className="w-full grid gap-8" style={{ gridTemplateColumns: "200px 1fr" }}>
                <div className="col-start-2 col-span-1 flex items-center gap-12 pr-4 text-sm font-semibold uppercase underline-offset-4">
                    <div
                        className={`${tabState === "all"
                            ? "text-cinnamon underline decoration-2"
                            : "text-pewter"}`}
                        onClick={() => setTabState("all")}
                    >
                        All Events
                    </div>
                    <div
                        className={`${tabState === "week"
                            ? "text-cinnamon underline decoration-2"
                            : "text-pewter"}`}
                        onClick={() => setTabState("week")}
                    >
                        This Week
                    </div>
                    <div
                        className={`${tabState === "month"
                            ? "text-cinnamon underline decoration-2"
                            : "text-pewter"}`}
                        onClick={() => setTabState("month")}
                    >
                        This Month
                    </div>
                    <div
                        className={`${tabState === "year"
                            ? "text-cinnamon underline decoration-2"
                            : "text-pewter"}`}
                        onClick={() => setTabState("year")}
                    >
                        This Year
                    </div>
                </div>
                {events.map((event) => (
                    <Event
                        key={event.id}
                        event={event}
                        selected={selectedEvent?.id === event.id}
                        onClick={() => setSelectedEvent((prev) => {
                            if (prev?.id === event.id) {
                                return null
                            }
                            return event
                        })}
                    />
                ))}
            </div>
        </div>
    )
}

export default UpcomingEventsWidget