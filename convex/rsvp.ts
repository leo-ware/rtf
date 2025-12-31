import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { Doc, Id } from "./_generated/dataModel"

const ticketValidator = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
})

// Helper to apply discount to ticket prices
const applyDiscount = (
    ticketsTotal: number,
    discountType: "percentage" | "fixed" | "free" | "tickets",
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

export const calculateCost = query({
    args: {
        eventId: v.id("events"),
        tickets: v.array(v.object({
            name: v.string(),
            quantity: v.number(),
        })),
        additionalDonation: v.optional(v.number()),
        discountCode: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { eventId, tickets, additionalDonation, discountCode } = args

        const event = await ctx.db.get(eventId)
        if (!event) {
            return {error: "Event not found", success: false}
        }
        if (!event.ticketPriceId) {
            return {error: "Tickets have not been configured for this event", success: false}
        }
        const ticketsDb = await ctx.db.get(event.ticketPriceId)
        if (!ticketsDb) {
            return {error: "Error retrieving ticket prices for this event", success: false}
        }

        let discountCodeObject: Doc<"discountCodes"> | null = null
        if (discountCode) {
            discountCodeObject = await ctx.db.query("discountCodes")
                .withIndex("by_code", (q) => q.eq("code", discountCode))
                .unique()
            
            if (!discountCodeObject) {
                return {error: "Discount code not found", success: false}
            }
            if (discountCodeObject.revoked) {
                return {error: "This discount code can no longer be used", success: false}
            }
            if (discountCodeObject.eventLock && discountCodeObject.eventLock !== eventId) {
                return {error: "This discount code is not valid for this event", success: false}
            }
            if (discountCodeObject.programLock && event.programId !== discountCodeObject.programLock) {
                return {error: "This discount code is not valid for this program", success: false}
            }
            if (discountCodeObject.discountType !== "free" && !(typeof discountCodeObject.discountQuantity === "number")) {
                return {error: "Discount code is malformed", success: false}
            }
        }

        let ticketReceipt: {name: string, quantity: number, individualPrice: number, combinedPrice: number}[] = []

        for (const ticket of tickets) {
            if (ticket.quantity < 0) {
                return {error: "Cannot buy negative tickets", success: false}
            }
            if (ticket.quantity !== Math.round(ticket.quantity)) {
                return {error: "Cannot buy fractional tickets", success: false}
            }

            const ticketOption = ticketsDb.options.find((option) => option.name === ticket.name)
            if (!ticketOption) {
                return {error: `"${ticket.name}" is not a valid ticket for this event`, success: false}
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
            return {error: "Error calculating price", success: false}
        }

        let discountSubtotal: number | null = null
        if (discountCodeObject) {
            if (discountCodeObject.discountType === "free") {
                discountSubtotal = 0
            } else if (typeof discountCodeObject.discountQuantity !== "number") {
                return {error: "Discount code is malformed", success: false}
            } else if (discountCodeObject.discountType === "percentage") {
                discountSubtotal = ticketSubtotal * (1 - discountCodeObject.discountQuantity / 100)
            } else if (discountCodeObject.discountType === "fixed") {
                discountSubtotal = Math.max(0, ticketSubtotal - discountCodeObject.discountQuantity)
            } else if (discountCodeObject.discountType === "tickets") {

                discountSubtotal = ticketSubtotal
                const ticketReceiptCopy = ticketReceipt.map((ticket) => ({...ticket}))
                let remainingRebates = Math.min(discountCodeObject.discountQuantity, totalNumberOfTickets)

                let loopBreak = 0
                while (remainingRebates > 0) {
                    loopBreak++
                    if (loopBreak > 1000) {
                        return {error: "Error calculating price", success: false}
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
            }
        }

        if (discountSubtotal !== null && discountSubtotal < 0) {
            return {error: "Error calculating price", success: false}
        }

        if (additionalDonation !== undefined && additionalDonation < 0) {
            return {error: "Additional donation cannot be negative", success: false}
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
})

// Create an RSVP for a free event
export const createRsvp = mutation({
    args: {
        eventId: v.id("events"),
        email: v.string(),
        name: v.string(),
        tickets: v.array(ticketValidator),
        additionalDonation: v.optional(v.number()),
        discountCodeString: v.optional(v.string()),
    },
    returns: v.id("rsvp"),
    handler: async (ctx, args) => {
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
            const normalizedCode = args.discountCodeString.toUpperCase().trim()

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
            if (discountCode.eventLock && discountCode.eventLock !== args.eventId) {
                throw new Error("Discount code is not valid for this event")
            }

            // Check program lock
            if (discountCode.programLock && event.programId !== discountCode.programLock) {
                throw new Error("Discount code is not valid for this program")
            }

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

        return rsvpId
    },
})

const rsvpReturnValidator = v.object({
    _id: v.id("rsvp"),
    _creationTime: v.number(),
    eventId: v.id("events"),
    email: v.string(),
    name: v.string(),
    tickets: v.array(ticketValidator),
    additionalDonation: v.optional(v.number()),
    discountCode: v.optional(v.id("discountCodes")),
    priceBeforeDiscount: v.number(),
    finalPrice: v.number(),
})

// Get all RSVPs for an event
export const getRsvpsByEvent = query({
    args: {
        eventId: v.id("events"),
    },
    returns: v.array(rsvpReturnValidator),
    handler: async (ctx, args) => {
        const rsvps = await ctx.db
            .query("rsvp")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect()
        return rsvps
    },
})

// Get RSVPs by email
export const getRsvpsByEmail = query({
    args: {
        email: v.string(),
    },
    returns: v.array(rsvpReturnValidator),
    handler: async (ctx, args) => {
        const normalizedEmail = args.email.trim().toLowerCase()
        const rsvps = await ctx.db
            .query("rsvp")
            .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
            .collect()
        return rsvps
    },
})

// Get a single RSVP by ID
export const getRsvpById = query({
    args: {
        id: v.id("rsvp"),
    },
    returns: v.union(rsvpReturnValidator, v.null()),
    handler: async (ctx, args) => {
        const rsvp = await ctx.db.get(args.id)
        return rsvp
    },
})

// Cancel/delete an RSVP
export const deleteRsvp = mutation({
    args: {
        id: v.id("rsvp"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const rsvp = await ctx.db.get(args.id)
        if (!rsvp) {
            throw new Error("RSVP not found")
        }

        await ctx.db.delete(args.id)
        return null
    },
})
