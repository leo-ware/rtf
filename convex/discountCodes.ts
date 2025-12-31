import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { Id } from "./_generated/dataModel"

// Generate a cryptographically secure 8-character alphanumeric code
// Using base36 (0-9 and A-Z) for 8 characters gives ~2.8 trillion combinations
// which provides sufficient entropy for discount codes
const generateSecureCode = (): string => {
    const array = new Uint8Array(8)
    crypto.getRandomValues(array)
    // Convert to base36 characters (0-9, a-z)
    return Array.from(array)
        .map(byte => (byte % 36).toString(36).toUpperCase())
        .join("")
}

// Validator for discount type
const discountTypeValidator = v.union(
    v.literal("percentage"),
    v.literal("fixed"),
    v.literal("free"),
    v.literal("tickets")
)

export const listDiscountCodes = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("discountCodes"),
        _creationTime: v.number(),
        code: v.string(),
        description: v.optional(v.string()),
        revoked: v.boolean(),
        discountType: discountTypeValidator,
        discountQuantity: v.optional(v.number()),
        programLock: v.optional(v.id("programs")),
        eventLock: v.optional(v.id("events")),
    })),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const codes = await ctx.db
            .query("discountCodes")
            .order("desc")
            .collect()

        return codes
    },
})

export const getDiscountCode = query({
    args: { id: v.id("discountCodes") },
    returns: v.union(
        v.object({
            _id: v.id("discountCodes"),
            _creationTime: v.number(),
            code: v.string(),
            description: v.optional(v.string()),
            revoked: v.boolean(),
            discountType: discountTypeValidator,
            discountQuantity: v.optional(v.number()),
            programLock: v.optional(v.id("programs")),
            eventLock: v.optional(v.id("events")),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const code = await ctx.db.get(args.id)
        return code
    },
})

// Public function to check if a discount code is valid
export const checkDiscountCode = query({
    args: { code: v.string() },
    returns: v.union(
        v.object({
            status: v.literal("valid"),
            discountType: discountTypeValidator,
            discountQuantity: v.optional(v.number()),
            programLock: v.optional(v.id("programs")),
            eventLock: v.optional(v.id("events")),
        }),
        v.object({
            status: v.literal("not_found"),
        }),
        v.object({
            status: v.literal("revoked"),
        })
    ),
    handler: async (ctx, args) => {
        const normalizedCode = args.code.toUpperCase().trim()

        const discountCode = await ctx.db
            .query("discountCodes")
            .withIndex("by_code", (q) => q.eq("code", normalizedCode))
            .unique()

        if (!discountCode) {
            return { status: "not_found" as const }
        }

        if (discountCode.revoked) {
            return { status: "revoked" as const }
        }

        return {
            status: "valid" as const,
            discountType: discountCode.discountType,
            discountQuantity: discountCode.discountQuantity,
            programLock: discountCode.programLock,
            eventLock: discountCode.eventLock,
        }
    },
})

export const createDiscountCode = mutation({
    args: {
        description: v.optional(v.string()),
        discountType: discountTypeValidator,
        discountQuantity: v.optional(v.number()),
        programLock: v.optional(v.id("programs")),
        eventLock: v.optional(v.id("events")),
    },
    returns: v.object({
        id: v.id("discountCodes"),
        code: v.string(),
    }),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Validate discount quantity for percentage and fixed types
        if (args.discountType === "percentage") {
            if (args.discountQuantity === undefined) {
                throw new Error("Percentage discount requires a discount quantity")
            }
            if (args.discountQuantity < 0 || args.discountQuantity > 100) {
                throw new Error("Percentage discount must be between 0 and 100")
            }
        }

        if (args.discountType === "fixed") {
            if (args.discountQuantity === undefined) {
                throw new Error("Fixed discount requires a discount quantity")
            }
            if (args.discountQuantity < 0) {
                throw new Error("Fixed discount amount must be positive")
            }
        }

        if (args.discountType === "tickets") {
            if (args.discountQuantity === undefined) {
                throw new Error("Tickets discount requires a number of free tickets")
            }
            if (args.discountQuantity < 1) {
                throw new Error("Number of free tickets must be at least 1")
            }
        }

        // Generate unique code with collision check
        let code: string
        let existingCode = null
        let attempts = 0
        const maxAttempts = 10

        do {
            code = generateSecureCode()
            existingCode = await ctx.db
                .query("discountCodes")
                .withIndex("by_code", (q) => q.eq("code", code))
                .unique()
            attempts++
        } while (existingCode !== null && attempts < maxAttempts)

        if (existingCode !== null) {
            throw new Error("Failed to generate unique code. Please try again.")
        }

        const id = await ctx.db.insert("discountCodes", {
            code,
            description: args.description,
            revoked: false,
            discountType: args.discountType,
            discountQuantity: args.discountQuantity,
            programLock: args.programLock,
            eventLock: args.eventLock,
        })

        return { id, code }
    },
})

export const updateDiscountCode = mutation({
    args: {
        id: v.id("discountCodes"),
        description: v.optional(v.string()),
        discountType: v.optional(discountTypeValidator),
        discountQuantity: v.optional(v.number()),
        programLock: v.optional(v.id("programs")),
        eventLock: v.optional(v.id("events")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existingCode = await ctx.db.get(args.id)
        if (!existingCode) {
            throw new Error("Discount code not found")
        }

        // Validate discount quantity if discount type is being changed or quantity is updated
        const newDiscountType = args.discountType ?? existingCode.discountType
        const newDiscountQuantity = args.discountQuantity ?? existingCode.discountQuantity

        if (newDiscountType === "percentage") {
            if (newDiscountQuantity === undefined) {
                throw new Error("Percentage discount requires a discount quantity")
            }
            if (newDiscountQuantity < 0 || newDiscountQuantity > 100) {
                throw new Error("Percentage discount must be between 0 and 100")
            }
        }

        if (newDiscountType === "fixed") {
            if (newDiscountQuantity === undefined) {
                throw new Error("Fixed discount requires a discount quantity")
            }
            if (newDiscountQuantity < 0) {
                throw new Error("Fixed discount amount must be positive")
            }
        }

        if (newDiscountType === "tickets") {
            if (newDiscountQuantity === undefined) {
                throw new Error("Tickets discount requires a number of free tickets")
            }
            if (newDiscountQuantity < 1) {
                throw new Error("Number of free tickets must be at least 1")
            }
        }

        const updates: Partial<{
            description: string | undefined
            discountType: "percentage" | "fixed" | "free" | "tickets"
            discountQuantity: number | undefined
            programLock: Id<"programs"> | undefined
            eventLock: Id<"events"> | undefined
        }> = {}

        if (args.description !== undefined) {
            updates.description = args.description
        }
        if (args.discountType !== undefined) {
            updates.discountType = args.discountType
        }
        if (args.discountQuantity !== undefined) {
            updates.discountQuantity = args.discountQuantity
        }
        if (args.programLock !== undefined) {
            updates.programLock = args.programLock
        }
        if (args.eventLock !== undefined) {
            updates.eventLock = args.eventLock
        }

        await ctx.db.patch(args.id, updates)
        return null
    },
})

export const revokeDiscountCode = mutation({
    args: {
        id: v.id("discountCodes"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existingCode = await ctx.db.get(args.id)
        if (!existingCode) {
            throw new Error("Discount code not found")
        }

        await ctx.db.patch(args.id, { revoked: true })
        return null
    },
})

export const unrevokeDiscountCode = mutation({
    args: {
        id: v.id("discountCodes"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existingCode = await ctx.db.get(args.id)
        if (!existingCode) {
            throw new Error("Discount code not found")
        }

        await ctx.db.patch(args.id, { revoked: false })
        return null
    },
})

