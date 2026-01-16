import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import DonationFormManager from "./models/donationFormManager"
import { removeUndefinedFields } from "./utils"

export const listDonationForms = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("donationForms"),
        _creationTime: v.number(),
        name: v.string(),
        notes: v.optional(v.string()),
        formId: v.string(),
        formTemplateId: v.string(),
        updatedAt: v.number(),
    })),
    handler: async (ctx) => {
        return await ctx.db
            .query("donationForms")
            .order("desc")
            .collect()
    },
})

export const getDonationForm = query({
    args: {
        id: v.id("donationForms"),
    },
    returns: v.union(
        v.null(),
        v.object({
            _id: v.id("donationForms"),
            _creationTime: v.number(),
            name: v.string(),
            notes: v.optional(v.string()),
            formId: v.string(),
            formTemplateId: v.string(),
            updatedAt: v.number(),
        }),
    ),
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id)
    },
})

export const createDonationForm = mutation({
    args: {
        name: v.string(),
        notes: v.optional(v.string()),
        formId: v.string(),
        formTemplateId: v.string(),
    },
    returns: v.id("donationForms"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const manager = await DonationFormManager.create(ctx, args)
        return manager.id
    },
})

export const updateDonationForm = mutation({
    args: {
        id: v.id("donationForms"),
        name: v.optional(v.string()),
        notes: v.optional(v.string()),
        formId: v.optional(v.string()),
        formTemplateId: v.optional(v.string()),
    },
    returns: v.id("donationForms"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const manager = new DonationFormManager(args.id)
        await manager.update(ctx, removeUndefinedFields({
            name: args.name,
            notes: args.notes,
            formId: args.formId,
            formTemplateId: args.formTemplateId,
        }))
        return manager.id
    },
})

export const deleteDonationForm = mutation({
    args: {
        id: v.id("donationForms"),
    },
    returns: v.id("donationForms"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const manager = new DonationFormManager(args.id)
        await manager.delete(ctx)
        return manager.id
    },
})

