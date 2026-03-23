import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { generateSlug } from "./utils";
import { Id } from "./_generated/dataModel";

const tagObject = v.object({
    _id: v.id("tags"),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    articleMetadataIds: v.optional(v.array(v.id("articleMetadata"))),
})

export const list = query({
    args: {},
    returns: v.array(tagObject),
    handler: async (ctx) => {
        return await ctx.db.query("tags").order("asc").collect();
    },
});

export const get = query({
    args: { id: v.id("tags") },
    returns: v.union(tagObject, v.null()),
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
    },
    returns: v.id("tags"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const slug = generateSlug(args.name);
        const existing = await ctx.db
            .query("tags")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (existing) {
            throw new Error("Tag already exists");
        }

        return await ctx.db.insert("tags", {
            name: args.name,
            slug,
            articleMetadataIds: [],
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("tags"),
        name: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const slug = generateSlug(args.name);

        const existing = await ctx.db
            .query("tags")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (existing && existing._id !== args.id) {
             throw new Error("Tag already exists");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            slug,
        });
        return null;
    },
});

export const deleteTag = mutation({
    args: { id: v.id("tags") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const tag = await ctx.db.get(args.id);
        if (!tag) {
            return null;
        }

        // Use reverse lookup to strip deleted tag from affected articles
        const articleMetadataIds = tag.articleMetadataIds ?? [];
        await Promise.all(
            articleMetadataIds.map(async (articleMetadataId) => {
                const article = await ctx.db.get(articleMetadataId);
                if (!article) return;
                await ctx.db.patch(article._id, {
                    tags: (article.tags ?? []).filter(id => id !== args.id)
                });
            })
        );

        await ctx.db.delete(args.id);
        return null;
    },
});

// Run once from the Convex dashboard after deploying the schema change:
// internal.tags.backfillTagReverseLookup
export const backfillTagReverseLookup = internalMutation({
    args: {},
    returns: v.null(),
    handler: async (ctx) => {
        // Build tagId → articleMetadataId[] map from all article metadata
        const allArticleMetadata = await ctx.db.query("articleMetadata").collect();
        const tagMap = new Map<Id<"tags">, Id<"articleMetadata">[]>();

        for (const article of allArticleMetadata) {
            for (const tagId of (article.tags ?? [])) {
                if (!tagMap.has(tagId)) {
                    tagMap.set(tagId, []);
                }
                tagMap.get(tagId)!.push(article._id);
            }
        }

        // Patch each tag with its article metadata IDs
        const allTags = await ctx.db.query("tags").collect();
        await Promise.all(
            allTags.map(tag => ctx.db.patch(tag._id, {
                articleMetadataIds: tagMap.get(tag._id) ?? []
            }))
        );

        return null;
    },
});
