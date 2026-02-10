import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useState } from "react"
import { FaChevronRight } from "react-icons/fa"
import Link from "next/link"
import Button from "./public-ui/Button"
import { formatDate } from "@/lib/utils"
import { ImSpinner8 } from "react-icons/im"

type RegisterButtonProps = {
    eventId: Id<"events">
    programId?: never
} | {
    eventId?: never
    programId: Id<"programs">
}

const EventRegisterButton = ({ eventId }: { eventId: Id<"events"> }) => {
    return (
        <div
            className={`
                w-fit rounded-xl bg-cinnamon
                flex flex-col items-start justify-start p-0
            `}>
            <Link
                href={`/visit-us/events/${eventId}/register`}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                    py-2 px-[26px] w-full
                    text-white text-[16px] font-bold uppercase no-underline
                    flex items-center justify-center`}>
                Register
            </Link>
        </div>
    )
}

const ProgramRegisterButton = ({ programId }: { programId: Id<"programs"> }) => {
    // const event = useQuery(api.events.getEventById, { id: eventId })

    const program = useQuery(api.programs.getProgramById, { id: programId })

    const [open, setOpen] = useState<boolean>(false)

    const availableDates = program?.events.map((event) => ({
        id: event._id,
        name: formatDate(new Date(event.startDate), { includeTime: true, includeYear: false })
    }))

    return (
        <div className={`relative`}>
            <Button
                color="cinnamon"
                className="w-full invisible"
                size="large">
                Register
            </Button>

            <div
                className="absolute top-0 left-0 w-fit"
                tabIndex={0}
                onClick={() => setOpen(!open)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setOpen(false)
                    }
                }}
            >
                <Button
                    color="cinnamon"
                    className={`w-full ${open ? "rounded-b-none" : ""}`}
                    size="large">
                    Register
                </Button>

                {open && (
                    <div className="w-fit">
                        <div className={`
                            px-4 py-1 w-fit rounded-b-lg
                            bg-milk text-ink font-normal
                            flex flex-col items-center justify-start
                            `}>
                            {availableDates && availableDates.length === 0 && (
                                <div className="min-w-[200px] min-h-[50px] w-full h-full flex items-center justify-center">
                                    <p className="text-center text-[16px] text-ink/50">
                                        No dates available
                                    </p>
                                </div>
                            )}
                            {availableDates === undefined && (
                                <div className="min-w-[200px] min-h-[50px] w-full h-full flex items-center justify-center">
                                    <ImSpinner8 className="w-4 h-4 animate-spin" />
                                </div>
                            )}
                            {availableDates && availableDates.map((date, index) => (
                                <Link
                                    key={date.name}
                                    href={`/visit-us/events/${date.id}/register`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                    }}
                                    className={`
                                    w-fit min-w-[200px] whitespace-nowrap py-2 px-2
                                    text-center text-[16px]
                                    hover:text-pewter hover:font-bold
                                    ${index !== availableDates.length - 1
                                            ? "border-b-2 border-cinnamon"
                                            : ""}
                                `}
                                >
                                    {date.name}
                                </Link>
                            ))}
                        </div>

                        {/* <Button color="sage-green" className="w-full rounded-t-none" size="large">
                            Checkout
                            <FaChevronRight />
                        </Button> */}
                    </div>)}
            </div>
        </div>
    )
}

const RegisterButton = ({ eventId, programId }: RegisterButtonProps) => {
    if (eventId) {
        return <EventRegisterButton eventId={eventId} />
    }
    if (programId) {
        return <ProgramRegisterButton programId={programId} />
    }
}

export default RegisterButton