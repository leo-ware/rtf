import { v } from "convex/values"
import { Doc } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { resolveImageId } from "./images"
import { getCurrentUserOrThrow } from "./users"
import { sponsorsAggregate } from "./aggregates"

export const getSponsors = query({
    handler: async (ctx) => {
        const sponsors = await ctx.db.query("sponsors")
            .order("asc")
            .collect();
        const sponsorsWithImages = await Promise.all(sponsors.map(async (sponsor) => ({
            ...sponsor,
            image: sponsor.imageId ? await resolveImageId(ctx, sponsor.imageId) : null,
        })));
        return sponsorsWithImages;
    }
})

export const createSponsor = mutation({
    args: {
        name: v.string(),
        imageId: v.optional(v.id("images")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const sponsorId = await ctx.db.insert("sponsors", {
            name: args.name,
            imageId: args.imageId,
        })
        const sponsor = await ctx.db.get(sponsorId)
        if (sponsor) {
            await sponsorsAggregate.insert(ctx, sponsor)
        }
        return sponsorId
    }
})

export const updateSponsor = mutation({
    args: {
        id: v.id("sponsors"),
        name: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const patch: Partial<Doc<"sponsors">> = {};
        if (args.name) {
            patch.name = args.name;
        }
        if (args.imageId) {
            patch.imageId = args.imageId;
        }
        const updatedSponsor = await ctx.db.patch(args.id, patch);
        return updatedSponsor;
    }
})

export const deleteSponsor = mutation({
    args: {
        id: v.id("sponsors"),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const sponsor = await ctx.db.get(args.id)
        if (sponsor) {
            await sponsorsAggregate.delete(ctx, sponsor)
        }
        await ctx.db.delete(args.id)
    }
})