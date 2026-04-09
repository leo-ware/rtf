import { v } from "convex/values"
import { paginationOptsValidator } from "convex/server"
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

        // Clear references to this form from animals, herds, and pathways
        // so we don't leave dangling donationFormIds.
        const referencingAnimals = await ctx.db
            .query("animals")
            .filter((q) => q.eq(q.field("donationFormId"), args.id))
            .collect()
        for (const animal of referencingAnimals) {
            await ctx.db.patch(animal._id, { donationFormId: undefined })
        }

        const referencingHerds = await ctx.db
            .query("herds")
            .filter((q) => q.eq(q.field("donationFormId"), args.id))
            .collect()
        for (const herd of referencingHerds) {
            await ctx.db.patch(herd._id, { donationFormId: undefined })
        }

        const referencingPathways = await ctx.db
            .query("donatePathways")
            .filter((q) => q.eq(q.field("donationFormId"), args.id))
            .collect()
        for (const pathway of referencingPathways) {
            await ctx.db.patch(pathway._id, { donationFormId: undefined })
        }

        const manager = new DonationFormManager(args.id)
        await manager.delete(ctx)
        return manager.id
    },
})

export const listDonationFormsWithUsage = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("donationForms"),
        _creationTime: v.number(),
        name: v.string(),
        notes: v.optional(v.string()),
        formId: v.string(),
        formTemplateId: v.string(),
        updatedAt: v.number(),
        usage: v.object({
            pathways: v.array(v.object({
                _id: v.id("donatePathways"),
                name: v.string(),
            })),
            animals: v.array(v.object({
                _id: v.id("animals"),
                name: v.string(),
            })),
            herds: v.array(v.object({
                _id: v.id("herds"),
                name: v.string(),
            })),
        }),
    })),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const forms = await ctx.db.query("donationForms").order("desc").collect()

        // Get all pathways, animals, herds that reference donation forms
        const allPathways = await ctx.db.query("donatePathways").collect()
        const allAnimals = await ctx.db.query("animals").collect()
        const allHerds = await ctx.db.query("herds").collect()

        return forms.map(form => ({
            ...form,
            usage: {
                pathways: allPathways
                    .filter(p => p.donationFormId === form._id)
                    .map(p => ({ _id: p._id, name: p.name })),
                animals: allAnimals
                    .filter(a => a.donationFormId === form._id)
                    .map(a => ({ _id: a._id, name: a.name })),
                herds: allHerds
                    .filter(h => h.donationFormId === form._id)
                    .map(h => ({ _id: h._id, name: h.name })),
            },
        }))
    },
})

export const paginatedDonationFormsWithUsage = query({
    args: {
        searchText: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    returns: v.object({
        page: v.array(v.object({
            _id: v.id("donationForms"),
            _creationTime: v.number(),
            name: v.string(),
            notes: v.optional(v.string()),
            formId: v.string(),
            formTemplateId: v.string(),
            updatedAt: v.number(),
            usage: v.object({
                pathways: v.array(v.object({
                    _id: v.id("donatePathways"),
                    name: v.string(),
                })),
                animals: v.array(v.object({
                    _id: v.id("animals"),
                    name: v.string(),
                })),
                herds: v.array(v.object({
                    _id: v.id("herds"),
                    name: v.string(),
                })),
            }),
        })),
        isDone: v.boolean(),
        continueCursor: v.string(),
    }),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Fetch paginated forms - use search index if searchText provided
        let paginatedResult
        if (args.searchText && args.searchText.trim()) {
            paginatedResult = await ctx.db
                .query("donationForms")
                .withSearchIndex("searchName", (q) => q.search("name", args.searchText!))
                .paginate(args.paginationOpts)
        } else {
            paginatedResult = await ctx.db
                .query("donationForms")
                .order("desc")
                .paginate(args.paginationOpts)
        }

        // Get all pathways, animals, herds that reference donation forms
        const allPathways = await ctx.db.query("donatePathways").collect()
        const allAnimals = await ctx.db.query("animals").collect()
        const allHerds = await ctx.db.query("herds").collect()

        // Map forms with their usage
        const pageWithUsage = paginatedResult.page.map(form => ({
            ...form,
            usage: {
                pathways: allPathways
                    .filter(p => p.donationFormId === form._id)
                    .map(p => ({ _id: p._id, name: p.name })),
                animals: allAnimals
                    .filter(a => a.donationFormId === form._id)
                    .map(a => ({ _id: a._id, name: a.name })),
                herds: allHerds
                    .filter(h => h.donationFormId === form._id)
                    .map(h => ({ _id: h._id, name: h.name })),
            },
        }))

        return {
            page: pageWithUsage,
            isDone: paginatedResult.isDone,
            continueCursor: paginatedResult.continueCursor,
        }
    },
})

