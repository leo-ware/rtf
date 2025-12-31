import { Doc, Id } from "../_generated/dataModel"
import { MutationCtx, QMCtxType } from "../types"

// Types
type DiscountType = "percentage" | "fixed" | "free" | "tickets"

type Ticket = {
    name: string
    description?: string
    price: number
}

type TicketSelection = {
    name: string
    quantity: number
}

type CreateArgs = {
    eventId: Id<"events">
    email: string
    name: string
    tickets: Array<Ticket>
    additionalDonation?: number
    discountCodeString?: string
}

type CalculateCostArgs = {
    eventId: Id<"events">
    tickets: Array<TicketSelection>
    additionalDonation?: number
    discountCode?: string
}

type CalculateCostSuccess = {
    success: true
    error: null
    ticketReceipt: Array<{
        name: string
        quantity: number
        individualPrice: number
        combinedPrice: number
    }>
    ticketSubtotal: number
    discountSubtotal: number | null
    discountCode: {
        code: string
        discountType: DiscountType
        discountQuantity: number | undefined
    } | null
    taxableTotal: number
    nonTaxableTotal: number
    preTaxCombinedPrice: number
}

type CalculateCostError = {
    success: false
    error: string
}

type CalculateCostResult = CalculateCostSuccess | CalculateCostError

// Helper to apply discount to ticket prices
const applyDiscount = (
    ticketsTotal: number,
    discountType: DiscountType,
    discountQuantity: number | undefined,
    ticketCount: number
): number => {
    switch (discountType) {
        case "free":
            return 0
        case "percentage":
            if (discountQuantity === undefined) return ticketsTotal
            return ticketsTotal * (1 - discountQuantity / 100)
        case "fixed":
            if (discountQuantity === undefined) return ticketsTotal
            return Math.max(0, ticketsTotal - discountQuantity)
        case "tickets":
            if (discountQuantity === undefined) return ticketsTotal
            // Make the first N tickets free (assuming equal price per ticket)
            const pricePerTicket = ticketCount > 0 ? ticketsTotal / ticketCount : 0
            const freeTickets = Math.min(discountQuantity, ticketCount)
            return ticketsTotal - (pricePerTicket * freeTickets)
        default:
            return ticketsTotal
    }
}

export default class RsvpManager {
    id: Id<"rsvp">

    constructor(id: Id<"rsvp">) {
        this.id = id
    }

    static async create(ctx: MutationCtx, args: CreateArgs): Promise<RsvpManager> {
        // Validate email format
        if (!args.email || !args.email.includes("@")) {
            throw new Error("Valid email is required")
        }

        // Validate name
        if (!args.name || args.name.trim().length === 0) {
            throw new Error("Name is required")
        }

        // Ensure the event exists
        const event = await ctx.db.get(args.eventId)
        if (!event) {
            throw new Error("Event not found")
        }

        // Validate that all tickets are free
        for (const ticket of args.tickets) {
            if (ticket.price !== 0) {
                throw new Error("Only free tickets are supported for free events")
            }
        }

        // Validate that at least one ticket is requested
        if (args.tickets.length === 0) {
            throw new Error("At least one ticket is required")
        }

        // Calculate tickets total (before discount)
        const ticketsTotal = args.tickets.reduce((sum, ticket) => sum + ticket.price, 0)
        const priceBeforeDiscount = ticketsTotal

        // Look up and validate discount code if provided
        let discountCodeId: Id<"discountCodes"> | undefined = undefined
        let discountedTicketsTotal = ticketsTotal

        if (args.discountCodeString) {
            const discountCode = await RsvpManager.validateAndGetDiscountCode(
                ctx,
                args.discountCodeString,
                args.eventId,
                event.programId
            )

            discountCodeId = discountCode._id

            // Apply discount to tickets total (not to donation)
            discountedTicketsTotal = applyDiscount(
                ticketsTotal,
                discountCode.discountType,
                discountCode.discountQuantity,
                args.tickets.length
            )
        }

        // Final price = discounted tickets + donation (donation is never discounted)
        const finalPrice = discountedTicketsTotal + (args.additionalDonation ?? 0)

        const rsvpId = await ctx.db.insert("rsvp", {
            eventId: args.eventId,
            email: args.email.trim().toLowerCase(),
            name: args.name.trim(),
            tickets: args.tickets,
            additionalDonation: args.additionalDonation,
            discountCode: discountCodeId,
            priceBeforeDiscount,
            finalPrice,
        })

        return new RsvpManager(rsvpId)
    }

    async get(ctx: QMCtxType): Promise<Doc<"rsvp"> | null> {
        return await ctx.db.get(this.id)
    }

    async delete(ctx: MutationCtx): Promise<void> {
        const rsvp = await this.get(ctx)
        if (!rsvp) {
            throw new Error("RSVP not found")
        }
        await ctx.db.delete(this.id)
    }

    // Static query methods

    static async getById(ctx: QMCtxType, id: Id<"rsvp">): Promise<Doc<"rsvp"> | null> {
        return await ctx.db.get(id)
    }

    static async getByEvent(ctx: QMCtxType, eventId: Id<"events">): Promise<Array<Doc<"rsvp">>> {
        return await ctx.db
            .query("rsvp")
            .withIndex("by_event", (q) => q.eq("eventId", eventId))
            .collect()
    }

    static async getByEmail(ctx: QMCtxType, email: string): Promise<Array<Doc<"rsvp">>> {
        const normalizedEmail = email.trim().toLowerCase()
        return await ctx.db
            .query("rsvp")
            .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
            .collect()
    }

    static async calculateCost(ctx: QMCtxType, args: CalculateCostArgs): Promise<CalculateCostResult> {
        const { eventId, tickets, additionalDonation, discountCode } = args

        const event = await ctx.db.get(eventId)
        if (!event) {
            return { error: "Event not found", success: false }
        }

        // Get the program to access ticket prices
        if (!event.programId) {
            return { error: "Event has no associated program", success: false }
        }
        const program = await ctx.db.get(event.programId)
        if (!program) {
            return { error: "Program not found", success: false }
        }
        if (!program.ticketPriceId) {
            return { error: "Tickets have not been configured for this event", success: false }
        }
        const ticketPriceDoc = await ctx.db.get(program.ticketPriceId)
        if (!ticketPriceDoc) {
            return { error: "Error retrieving ticket prices for this event", success: false }
        }

        let discountCodeObject: Doc<"discountCodes"> | null = null
        if (discountCode) {
            discountCodeObject = await ctx.db.query("discountCodes")
                .withIndex("by_code", (q) => q.eq("code", discountCode))
                .unique()
            
            if (!discountCodeObject) {
                return { error: "Discount code not found", success: false }
            }
            if (discountCodeObject.revoked) {
                return { error: "This discount code can no longer be used", success: false }
            }
            if (discountCodeObject.eventLock && discountCodeObject.eventLock !== eventId) {
                return { error: "This discount code is not valid for this event", success: false }
            }
            if (discountCodeObject.programLock && event.programId !== discountCodeObject.programLock) {
                return { error: "This discount code is not valid for this program", success: false }
            }
            if (discountCodeObject.discountType !== "free" && !(typeof discountCodeObject.discountQuantity === "number")) {
                return { error: "Discount code is malformed", success: false }
            }
        }

        const ticketReceipt: Array<{
            name: string
            quantity: number
            individualPrice: number
            combinedPrice: number
        }> = []

        for (const ticket of tickets) {
            if (ticket.quantity < 0) {
                return { error: "Cannot buy negative tickets", success: false }
            }
            if (ticket.quantity !== Math.round(ticket.quantity)) {
                return { error: "Cannot buy fractional tickets", success: false }
            }

            const ticketOption = ticketPriceDoc.options.find((option) => option.name === ticket.name)
            if (!ticketOption) {
                return { error: `"${ticket.name}" is not a valid ticket for this event`, success: false }
            }
            ticketReceipt.push({
                name: ticketOption.name,
                quantity: ticket.quantity,
                individualPrice: ticketOption.price,
                combinedPrice: ticketOption.price * ticket.quantity,
            })
        }

        const totalNumberOfTickets = ticketReceipt.reduce((sum, ticket) => sum + ticket.quantity, 0)
        const ticketSubtotal = ticketReceipt.reduce((sum, ticket) => sum + ticket.combinedPrice, 0)
        if (ticketSubtotal < 0) {
            return { error: "Error calculating price", success: false }
        }

        let discountSubtotal: number | null = null
        if (discountCodeObject) {
            discountSubtotal = RsvpManager.calculateDiscountSubtotal(
                discountCodeObject,
                ticketSubtotal,
                ticketReceipt,
                totalNumberOfTickets
            )
            if (discountSubtotal === null) {
                return { error: "Error calculating price", success: false }
            }
        }

        if (discountSubtotal !== null && discountSubtotal < 0) {
            return { error: "Error calculating price", success: false }
        }

        if (additionalDonation !== undefined && additionalDonation < 0) {
            return { error: "Additional donation cannot be negative", success: false }
        }

        const taxableTotal = discountSubtotal ?? ticketSubtotal
        const nonTaxableTotal = (typeof additionalDonation === "number" && !isNaN(additionalDonation))
            ? additionalDonation
            : 0
        const preTaxCombinedPrice = taxableTotal + nonTaxableTotal

        return {
            success: true,
            error: null,
            ticketReceipt,
            ticketSubtotal,
            discountSubtotal,
            discountCode: discountCodeObject ?
                {
                    code: discountCodeObject.code,
                    discountType: discountCodeObject.discountType,
                    discountQuantity: discountCodeObject.discountQuantity,
                } : null,
            taxableTotal,
            nonTaxableTotal,
            preTaxCombinedPrice
        }
    }

    // Private helper methods

    private static async validateAndGetDiscountCode(
        ctx: QMCtxType,
        discountCodeString: string,
        eventId: Id<"events">,
        programId: Id<"programs"> | undefined
    ): Promise<Doc<"discountCodes">> {
        const normalizedCode = discountCodeString.toUpperCase().trim()

        const discountCode = await ctx.db
            .query("discountCodes")
            .withIndex("by_code", (q) => q.eq("code", normalizedCode))
            .unique()

        if (!discountCode) {
            throw new Error("Discount code not found")
        }

        if (discountCode.revoked) {
            throw new Error("Discount code has been revoked")
        }

        // Check event lock
        if (discountCode.eventLock && discountCode.eventLock !== eventId) {
            throw new Error("Discount code is not valid for this event")
        }

        // Check program lock
        if (discountCode.programLock && programId !== discountCode.programLock) {
            throw new Error("Discount code is not valid for this program")
        }

        return discountCode
    }

    private static calculateDiscountSubtotal(
        discountCodeObject: Doc<"discountCodes">,
        ticketSubtotal: number,
        ticketReceipt: Array<{
            name: string
            quantity: number
            individualPrice: number
            combinedPrice: number
        }>,
        totalNumberOfTickets: number
    ): number | null {
        if (discountCodeObject.discountType === "free") {
            return 0
        }
        
        if (typeof discountCodeObject.discountQuantity !== "number") {
            return null
        }
        
        if (discountCodeObject.discountType === "percentage") {
            return ticketSubtotal * (1 - discountCodeObject.discountQuantity / 100)
        }
        
        if (discountCodeObject.discountType === "fixed") {
            return Math.max(0, ticketSubtotal - discountCodeObject.discountQuantity)
        }
        
        if (discountCodeObject.discountType === "tickets") {
            let discountSubtotal = ticketSubtotal
            const ticketReceiptCopy = ticketReceipt.map((ticket) => ({ ...ticket }))
            let remainingRebates = Math.min(discountCodeObject.discountQuantity, totalNumberOfTickets)

            let loopBreak = 0
            while (remainingRebates > 0) {
                loopBreak++
                if (loopBreak > 1000) {
                    return null
                }

                let largestPrice = -1
                let largestTicket: (typeof ticketReceipt)[number] | null = null

                ticketReceiptCopy.forEach((ticket) => {
                    if (ticket.individualPrice >= largestPrice && ticket.quantity > 0) {
                        largestPrice = ticket.individualPrice
                        largestTicket = ticket
                    }
                })

                if (largestTicket) {
                    largestTicket = largestTicket as (typeof ticketReceipt)[number]
                    const numberOfTheseTicketsToRemove = Math.min(remainingRebates, largestTicket.quantity)
                    discountSubtotal -= largestTicket.individualPrice * numberOfTheseTicketsToRemove
                    remainingRebates -= numberOfTheseTicketsToRemove
                    largestTicket.quantity -= numberOfTheseTicketsToRemove
                } else {
                    break
                }
            }
            return discountSubtotal
        }

        return ticketSubtotal
    }
}

