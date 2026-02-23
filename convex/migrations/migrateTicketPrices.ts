import { mutation } from "../_generated/server"
import { v } from "convex/values"

const formatTicketPrice = (options: Array<{
    name: string
    description?: string
    price: number
}>): string => {
    if (!options || options.length === 0) {
        return ""
    }

    // Single $0 option → "Free"
    if (options.length === 1 && options[0].price === 0) {
        return "Free"
    }

    // Single priced option → "$25"
    if (options.length === 1) {
        return `$${options[0].price}`
    }

    // Multiple options → "Adults $25, Children $15"
    const formatted = options
        .map((option) => {
            if (option.price === 0) {
                return `${option.name} Free`
            }
            return `${option.name} $${option.price}`
        })
        .join(", ")

    return formatted
}

export const migrateTicketPrices = mutation({
    args: {},
    returns: v.object({
        totalPrograms: v.number(),
        migratedPrograms: v.number(),
        skippedPrograms: v.number(),
        errors: v.array(v.string()),
    }),
    handler: async (ctx) => {
        const programs = await ctx.db.query("programs").collect()

        let migratedCount = 0
        let skippedCount = 0
        const errors: string[] = []

        for (const program of programs) {
            try {
                // Skip if already has ticketPriceText
                if (program.ticketPriceText) {
                    skippedCount++
                    continue
                }

                // Skip if no ticketPriceId
                if (!program.ticketPriceId) {
                    skippedCount++
                    continue
                }

                // Fetch the ticket price document
                const ticketPrice = await ctx.db.get(program.ticketPriceId)
                if (!ticketPrice) {
                    errors.push(`Program ${program._id}: ticketPrice not found`)
                    skippedCount++
                    continue
                }

                // Convert options to text
                const ticketPriceText = formatTicketPrice(ticketPrice.options)

                // Update program
                await ctx.db.patch(program._id, {
                    ticketPriceText,
                })

                migratedCount++
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error)
                errors.push(`Program ${program._id}: ${errorMessage}`)
                skippedCount++
            }
        }

        return {
            totalPrograms: programs.length,
            migratedPrograms: migratedCount,
            skippedPrograms: skippedCount,
            errors,
        }
    },
})
