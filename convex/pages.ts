import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim(); // Remove leading/trailing whitespace
}

export const listPages = query({
    args: {
        limit: v.optional(v.number()),
        category: v.optional(v.union(
            v.literal("about"),
            v.literal("what-we-do"),
            v.literal("learn"),
            v.literal("take-action")
        )),
        publishedOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        const publishedOnly = args.publishedOnly ?? false;

        let query;

        const searchCategory = args.category ?? undefined;
        if (searchCategory !== undefined) {
            query = ctx.db.query("pages").withIndex("by_category", (q) => q.eq("category", searchCategory));
        } else if (publishedOnly) {
            query = ctx.db.query("pages").withIndex("by_published", (q) => q.eq("isPublished", true));
        } else {
            query = ctx.db.query("pages").withIndex("by_updated_at");
        }

        const pages = await query
            .order("desc")
            .take(limit);

        // Filter by published status if needed and not using published index
        const filteredPages = publishedOnly && !args.category
            ? pages.filter(page => page.isPublished)
            : pages;

        // Get last editor information for each page
        const pagesWithEditors = await Promise.all(
            filteredPages.map(async (page) => {
                const lastEditor = await ctx.db.get(page.lastEditedBy);
                return {
                    ...page,
                    lastEditor: lastEditor && 'email' in lastEditor ? {
                        id: lastEditor._id,
                        email: lastEditor.email || undefined,
                        name: lastEditor.name ?? lastEditor.email ?? "Unknown"
                    } : null,
                };
            })
        );

        return pagesWithEditors;
    },
});

export const getPage = query({
    args: { id: v.id("pages") },
    handler: async (ctx, args) => {
        const page = await ctx.db.get(args.id);
        if (!page) {
            return null;
        }

        const lastEditor = await ctx.db.get(page.lastEditedBy);
        return {
            ...page,
            lastEditor: lastEditor && 'email' in lastEditor ? {
                id: lastEditor._id,
                email: lastEditor.email || undefined,
                name: lastEditor.name ?? lastEditor.email ?? "Unknown"
            } : null,
        };
    },
});

export const getPageBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const page = await ctx.db
            .query("pages")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!page) {
            return null;
        }

        const lastEditor = await ctx.db.get(page.lastEditedBy);
        return {
            ...page,
            lastEditor: lastEditor && 'email' in lastEditor ? {
                id: lastEditor._id,
                email: lastEditor.email || undefined,
                name: lastEditor.name ?? lastEditor.email ?? "Unknown"
            } : null,
        };
    },
});

export const createPage = mutation({
    args: {
        title: v.string(),
        slug: v.optional(v.string()),
        content: v.string(),
        excerpt: v.optional(v.string()),
        category: v.union(
            v.literal("about"),
            v.literal("what-we-do"),
            v.literal("learn"),
            v.literal("take-action")
        ),
        imageUrl: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to create pages");
        }

        // Check user role
        const user = await ctx.db.get(userId);
        if (!user || !user.role || !["authorized", "admin", "dev"].includes(user.role)) {
            throw new Error("Insufficient permissions to create pages");
        }

        // Generate slug from title if not provided
        const slug = args.slug || generateSlug(args.title);

        // Check if slug already exists
        const existingPage = await ctx.db
            .query("pages")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (existingPage) {
            throw new Error("A page with this slug already exists");
        }

        const now = Date.now();

        const pageId = await ctx.db.insert("pages", {
            title: args.title,
            slug,
            content: args.content,
            excerpt: args.excerpt,
            category: args.category,
            imageUrl: args.imageUrl,
            isPublished: args.isPublished ?? false,
            metaTitle: args.metaTitle,
            metaDescription: args.metaDescription,
            lastEditedBy: userId,
            createdAt: now,
            updatedAt: now,
        });

        return pageId;
    },
});

export const updatePage = mutation({
    args: {
        id: v.id("pages"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        category: v.optional(v.union(
            v.literal("about"),
            v.literal("what-we-do"),
            v.literal("learn"),
            v.literal("take-action")
        )),
        imageUrl: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update pages");
        }

        // Check user role
        const user = await ctx.db.get(userId);
        if (!user || !user.role || !["authorized", "admin", "dev"].includes(user.role)) {
            throw new Error("Insufficient permissions to update pages");
        }

        const existingPage = await ctx.db.get(args.id);
        if (!existingPage) {
            throw new Error("Page not found");
        }

        const updateData: any = {
            lastEditedBy: userId,
            updatedAt: Date.now(),
        };

        if (args.title !== undefined) updateData.title = args.title;
        if (args.content !== undefined) updateData.content = args.content;
        if (args.excerpt !== undefined) updateData.excerpt = args.excerpt;
        if (args.category !== undefined) updateData.category = args.category;
        if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
        if (args.isPublished !== undefined) updateData.isPublished = args.isPublished;
        if (args.metaTitle !== undefined) updateData.metaTitle = args.metaTitle;
        if (args.metaDescription !== undefined) updateData.metaDescription = args.metaDescription;

        // Handle slug update
        if (args.slug !== undefined) {
            // Check if new slug already exists (excluding current page)
            const existingSlugPage = await ctx.db
                .query("pages")
                .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
                .first();

            if (existingSlugPage && existingSlugPage._id !== args.id) {
                throw new Error("A page with this slug already exists");
            }
            updateData.slug = args.slug;
        }

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const deletePage = mutation({
    args: {
        id: v.id("pages"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete pages");
        }

        // Check user role
        const user = await ctx.db.get(userId);
        if (!user || !user.role || !["authorized", "admin", "dev"].includes(user.role)) {
            throw new Error("Insufficient permissions to delete pages");
        }

        const page = await ctx.db.get(args.id);
        if (!page) {
            throw new Error("Page not found");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const getPagesStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view pages stats");
        }

        const allPages = await ctx.db.query("pages").collect();

        const stats = {
            total: allPages.length,
            published: allPages.filter(p => p.isPublished).length,
            draft: allPages.filter(p => !p.isPublished).length,
            byCategory: {
                about: allPages.filter(p => p.category === "about").length,
                "what-we-do": allPages.filter(p => p.category === "what-we-do").length,
                learn: allPages.filter(p => p.category === "learn").length,
                "take-action": allPages.filter(p => p.category === "take-action").length,
            },
            recentlyUpdated: allPages.filter(p =>
                p.updatedAt > Date.now() - (7 * 24 * 60 * 60 * 1000)
            ).length,
        };

        return stats;
    },
});