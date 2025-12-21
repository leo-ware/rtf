"use client"

import { useState } from "react"
import LongRightArrow from "./LongRightArrow"
import { cn, formatDateRange } from "@/lib/utils"
import { MdArrowRight, MdArrowRightAlt } from "react-icons/md"

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

const Event = ({ event, selected, onClick, size }: { event: typeof events[0], selected: boolean, onClick: () => void, size: "large" | "small" }) => {
    const multiday = event.endDate && (event.startDate.toLocaleDateString() !== event.endDate.toLocaleDateString())
    return (
        <>
            <div className={`col-start-1 col-span-1 w-full
                flex flex-col items-end justify-start
                ${size === "large" ? "mt-1" : "mt-2"}`}
                >
                <div className={`text-[${size === "large" ? "23px" : "16px"}] font-semibold`}>
                    {formatDateRange(event.startDate, event.endDate)}
                </div>
                {!multiday && (
                    <div className={`text-[${size === "large" ? "17px" : "14px"}]`}>
                        {event.startTime}-
                        {event.endTime}
                    </div>
                )}
            </div>
            <div onClick={onClick} className="col-start-2 col-span-1 flex flex-col items-start justify-start">
                <div className={`text-[${size === "large" ? "28px" : "25px"}] ${selected ? "text-cinnamon" : ""}`}>
                    {event.title}
                </div>
                {selected && (
                    <div>
                        <div className="mt-4 text-[16px] text-ink/60">
                            {event.description}
                        </div>
                        <div className="mt-4 flex items-center gap-2 cursor-pointer">
                            <div className="text-[16px] text-pewter font-semibold uppercase">
                                View Full Event Details
                            </div>
                            <MdArrowRightAlt size={20} className="text-pewter" />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

const UpcomingEventsWidget = ({ className, size = "large" }: { className?: string, size?: "large" | "small" }) => {

    const [tabState, setTabState] = useState<"all" | "week" | "month" | "year">("all")
    const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)

    return (
        <div className={cn(
            `w-full h-fit bg-seashell px-8 py-8 flex flex-col items-center justify-center`,
            className
        )}>
            <div
                className={`w-full grid gap-8`}
                style={{ gridTemplateColumns: `${size === "large" ? "280px" : "200px"} 1fr` }}
                >
                <div className="col-start-2 col-span-1 flex items-center gap-12 pr-4 underline-offset-4">
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
                    ] as const).map(({name, value}) => (
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
                        size={size}
                    />
                ))}
            </div>
        </div>
    )
}

export default UpcomingEventsWidget