"use client"

import { PageProps } from "@/lib/types"
import { Id } from "@/convex/_generated/dataModel"
import { Fragment, use, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { notFound } from "next/navigation"
import LargeLoader from "@/components/public-ui/LargeLoader"
import Header from "@/components/public-ui/Header"
import SmallNumberPicker from "@/components/public-ui/SmallNumberPicker"
import CasualNumberInput from "@/components/public-ui/CasualNumberInput"
import CasualTextInput from "@/components/public-ui/CasualTextInput"
import Button from "@/components/public-ui/Button"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import { isValidEmail } from "@/lib/utils"
import { Divide } from "lucide-react"


const EventRegisterPage = ({ params }: PageProps<{ eventId: Id<"events"> }>) => {
    const { eventId } = use(params)
    const event = useQuery(api.events.getEventById, { id: eventId })

    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({})
    const getTicketQuantity = (ticketName: string) => (
        ticketQuantities[ticketName] ?? 0
    )
    const setTicketQuantity = (ticketName: string, quantity: number) => {
        setTicketQuantities({
            ...ticketQuantities,
            [ticketName]: quantity,
        })
    }
    const totalNumberOfTickets = Object.values(ticketQuantities).reduce((acc, quantity) => acc + quantity, 0)

    const [additionalDonation, setAdditionalDonation] = useState<number>(0)
    const [promoCode, setPromoCode] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const calculateCost = useQuery(api.rsvp.calculateCost, {
        eventId,
        tickets: Object.entries(ticketQuantities).map(([name, quantity]) => ({ name, quantity })),
        additionalDonation,
        discountCode: promoCode,
    })

    // step management

    const steps = ["select-tickets", "contact-info", "confirm"] as const
    const [formStep, setFormStep] = useState<typeof steps[number]>("select-tickets")
    const [showErrors, setShowErrors] = useState<boolean>(false)

    const errors: Record<typeof steps[number], string | undefined> = {
        "select-tickets": (
            !calculateCost?.success ? calculateCost?.error :
                totalNumberOfTickets === 0 ? "At least one ticket is required" :
                    undefined
        ) || undefined,
        "contact-info": (
            name.length === 0 ? "Name is required" :
                email.length === 0 ? "Email is required" :
                    !isValidEmail(email) ? "Invalid email" :
                        undefined
        ),
        "confirm": undefined,
    }

    const nextStep = () => {
        if (errors[formStep] !== undefined) {
            setShowErrors(true)
        } else {
            setShowErrors(false)
            const currentIndex = steps.indexOf(formStep)
            if (currentIndex < steps.length - 1) {
                setFormStep(steps[currentIndex + 1])
            }
        }
    }

    const previousStep = () => {
        setShowErrors(false)
        const currentIndex = steps.indexOf(formStep)
        if (currentIndex > 0) {
            setFormStep(steps[currentIndex - 1])
        }
    }

    // view

    if (event === null) {
        return notFound()
    }

    if (event === undefined) {
        return <LargeLoader />
    }

    return (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center">
            <Header level={1} className="text-pewter max-w-8/12">
                Event Registration
            </Header>
            <div className={`min-h-[500px] p-12`}>
                <div className="grid grid-cols-3 gap-4">
                    {formStep === "select-tickets" && (<Fragment>
                        {event.tickets && event.tickets.options.map((ticket) => (
                            <Fragment key={ticket.name}>
                                <div>
                                    <div className="text-lg font-semibold">
                                        {ticket.name}
                                    </div>
                                    <div>{ticket.description}</div>
                                </div>
                                <div>
                                    {ticket.price
                                        ? `$${ticket.price.toFixed(2)}`
                                        : "Free"
                                    }
                                </div>
                                <div>
                                    <SmallNumberPicker
                                        value={getTicketQuantity(ticket.name)}
                                        onChange={(quantity) => setTicketQuantity(ticket.name, quantity)} />
                                </div>
                            </Fragment>
                        ))}

                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div className="text-lg font-semibold col-span-2 col-start-1">
                                Additional Donation
                            </div>
                            <div className="col-span-1 col-start-3 flex items-center justify-start gap-1">
                                <div className="text-md text-pewter">$</div>
                                <CasualNumberInput
                                    value={additionalDonation}
                                    placeholder="0"
                                    onChange={setAdditionalDonation}
                                    onBlur={() => {
                                        setAdditionalDonation(Math.round(100 * Math.max(additionalDonation, 0)) / 100)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div className="text-lg font-semibold col-span-2 col-start-1">
                                Promo Code
                            </div>
                            <div className="col-span-1 col-start-3 flex items-center justify-start gap-1">
                                <CasualTextInput
                                    value={promoCode}
                                    onChange={setPromoCode}
                                />
                            </div>
                        </div>

                        {calculateCost !== undefined && (
                            <div className="col-span-3 grid grid-cols-subgrid">
                                {calculateCost.success && (
                                    <div className={`
                                        col-start-2 col-span-2 grid grid-cols-subgrid
                                        flex flex-col items-start justify-start gap-2
                                    `}>
                                        <div className="col-span-2 grid grid-cols-subgrid">
                                            <div>
                                                Ticket Cost
                                            </div>
                                            <div>
                                                ${calculateCost.ticketSubtotal?.toFixed(2)}
                                            </div>
                                        </div>

                                        {calculateCost.discountCode !== null && (
                                            <div className="col-span-2 grid grid-cols-subgrid">
                                                <div>
                                                    <div>Discount</div>
                                                    <div>
                                                        ${calculateCost.discountCode?.discountType === "percentage"
                                                            ? `${calculateCost.discountCode?.discountQuantity}% off`
                                                            : calculateCost.discountCode?.discountType === "fixed"
                                                                ? `$${calculateCost.discountCode?.discountQuantity} off`
                                                                : calculateCost.discountCode?.discountType === "free"
                                                                    ? "Free" : calculateCost.discountCode?.discountType === "tickets"
                                                                        ? `${calculateCost.discountCode?.discountQuantity} tickets`
                                                                        : "Unknown"}
                                                    </div>
                                                </div>
                                                <div>
                                                    ${calculateCost.discountSubtotal?.toFixed(2)}
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-span-2 grid grid-cols-subgrid">
                                            <div>Taxable total</div>
                                            <div>${calculateCost.taxableTotal?.toFixed(2)}</div>
                                        </div>

                                        <div className="col-span-2 grid grid-cols-subgrid">
                                            <div>Non-taxable total</div>
                                            <div>${calculateCost.nonTaxableTotal?.toFixed(2)}</div>
                                        </div>

                                        <div className="col-span-2 grid grid-cols-subgrid">
                                            <div>Pre-tax combined price</div>
                                            <div>${calculateCost.preTaxCombinedPrice?.toFixed(2)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {showErrors && (
                            <div className="text-red-500 col-span-3">
                                {errors[formStep]}
                            </div>
                        )}

                        <div className="col-span-3 flex items-center justify-end">
                            <Button
                                color="sage-green"
                                className="flex items-center justify-center gap-2"
                                onClick={nextStep}
                            >
                                Next <FaChevronRight />
                            </Button>
                        </div>
                    </Fragment>)}

                    {formStep === "contact-info" && (<Fragment>
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Name</div>
                            <div className="col-span-2 col-start-2">
                                <CasualTextInput
                                    value={name}
                                    onChange={setName}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Email</div>
                            <div className="col-span-2 col-start-2">
                                <CasualTextInput
                                    value={email}
                                    onChange={setEmail}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {showErrors && (
                            <div className="text-red-500 col-span-3">
                                {errors[formStep]}
                            </div>
                        )}

                        <div className="col-span-3 flex items-center justify-end gap-8">
                            <Button
                                color="sage-green"
                                className="flex items-center justify-center gap-2"
                                onClick={previousStep}>
                                <FaChevronLeft /> Back
                            </Button>
                            <Button
                                color="sage-green"
                                className="flex items-center justify-center gap-2"
                                onClick={nextStep}>
                                Next <FaChevronRight />
                            </Button>
                        </div>
                    </Fragment>)}

                    {formStep === "confirm" && (<Fragment>
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Name</div>
                            <div className="col-span-2 col-start-2">
                                {name}
                            </div>
                        </div>
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Email</div>
                            <div className="col-span-2 col-start-2">
                                {email}
                            </div>
                        </div>
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Tickets</div>
                            <div className="col-span-2 col-start-2 flex flex-col">
                                {Object.entries(ticketQuantities).map(([name, quantity]) => (
                                    <div key={name}>
                                        {name} x {quantity}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Additional Donation</div>
                            <div className="col-span-2 col-start-2">
                                ${additionalDonation}
                            </div>
                        </div>
                        {promoCode && (<div className="col-span-3 grid grid-cols-subgrid">
                            <div>Discount Code</div>
                            <div className="col-span-2 col-start-2">
                                {promoCode}
                            </div>
                        </div>)}
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <div>Pre-tax total</div>
                            {(calculateCost && calculateCost.success) && (
                                <div className="col-span-2 col-start-2">
                                    ${calculateCost?.preTaxCombinedPrice?.toFixed(2)}
                                </div>
                            )}
                            {(calculateCost && !calculateCost.success) && (
                                <div className="col-span-2 col-start-2 text-red-500">
                                    Error calculating price
                                    {calculateCost.error}
                                </div>
                            )}
                        </div>

                        {showErrors && (
                            <div className="text-red-500 col-span-3">
                                {errors[formStep]}
                            </div>
                        )}

                        <div className="col-span-3 grid grid-cols-subgrid">
                            <Button
                                color="sage-green"
                                className="flex items-center justify-center gap-2"
                                onClick={previousStep}>
                                <FaChevronLeft /> Back
                            </Button>
                            <Button
                                color="sage-green"
                                className="flex items-center justify-center gap-2"
                            // onClick={() => setFormStep("select-tickets")}
                            >
                                Submit <FaChevronRight />
                            </Button>
                        </div>
                    </Fragment>)}
                </div>
            </div>
        </div>
    )
}

export default EventRegisterPage