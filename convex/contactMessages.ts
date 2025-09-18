import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitContactMessage = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
        source: v.optional(v.string()),
    },
    returns: v.id("contactMessages"),
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("contactMessages", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            subject: args.subject,
            message: args.message,
            status: "new",
            priority: "normal",
            source: args.source || "contact_form",
            createdAt: Date.now(),
        });

        return messageId;
    },
});

export const listContactMessages = query({
    args: {
        limit: v.optional(v.number()),
        status: v.optional(v.union(
            v.literal("new"),
            v.literal("read"),
            v.literal("replied"),
            v.literal("archived")
        )),
    },
    returns: v.array(v.object({
        _id: v.id("contactMessages"),
        _creationTime: v.number(),
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
        status: v.union(
            v.literal("new"),
            v.literal("read"),
            v.literal("replied"),
            v.literal("archived")
        ),
        priority: v.union(
            v.literal("low"),
            v.literal("normal"),
            v.literal("high"),
            v.literal("urgent")
        ),
        source: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        createdAt: v.number(),
        readAt: v.optional(v.number()),
        repliedAt: v.optional(v.number()),
    })),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view contact messages");
        }

        const limit = args.limit ?? 50;

        let messages;

        if (args.status) {
            const status = args.status;
            messages = await ctx.db
                .query("contactMessages")
                .withIndex("by_status", (q) => q.eq("status", status))
                .order("desc")
                .take(limit);
        } else {
            messages = await ctx.db
                .query("contactMessages")
                .withIndex("by_created_at")
                .order("desc")
                .take(limit);
        }

        return messages;
    },
});

export const getContactMessage = query({
    args: { id: v.id("contactMessages") },
    returns: v.union(
        v.object({
            _id: v.id("contactMessages"),
            _creationTime: v.number(),
            name: v.string(),
            email: v.string(),
            phone: v.optional(v.string()),
            subject: v.string(),
            message: v.string(),
            status: v.union(
                v.literal("new"),
                v.literal("read"),
                v.literal("replied"),
                v.literal("archived")
            ),
            priority: v.union(
                v.literal("low"),
                v.literal("normal"),
                v.literal("high"),
                v.literal("urgent")
            ),
            source: v.optional(v.string()),
            ipAddress: v.optional(v.string()),
            userAgent: v.optional(v.string()),
            createdAt: v.number(),
            readAt: v.optional(v.number()),
            repliedAt: v.optional(v.number()),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view contact messages");
        }

        const message = await ctx.db.get(args.id);
        return message;
    },
});

export const updateContactMessageStatus = mutation({
    args: {
        id: v.id("contactMessages"),
        status: v.union(
            v.literal("new"),
            v.literal("read"),
            v.literal("replied"),
            v.literal("archived")
        ),
    },
    returns: v.id("contactMessages"),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update contact messages");
        }

        const updateData: any = { status: args.status };

        if (args.status === "read") {
            updateData.readAt = Date.now();
        } else if (args.status === "replied") {
            updateData.repliedAt = Date.now();
        }

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const updateContactMessagePriority = mutation({
    args: {
        id: v.id("contactMessages"),
        priority: v.union(
            v.literal("low"),
            v.literal("normal"),
            v.literal("high"),
            v.literal("urgent")
        ),
    },
    returns: v.id("contactMessages"),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update contact messages");
        }

        await ctx.db.patch(args.id, { priority: args.priority });
        return args.id;
    },
});

export const deleteContactMessage = mutation({
    args: { id: v.id("contactMessages") },
    returns: v.object({ success: v.boolean() }),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete contact messages");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const getContactStats = query({
    args: {},
    returns: v.object({
        total: v.number(),
        new: v.number(),
        read: v.number(),
        replied: v.number(),
        archived: v.number(),
        urgent: v.number(),
        thisWeek: v.number(),
    }),
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view contact stats");
        }

        const allMessages = await ctx.db.query("contactMessages").collect();

        const stats = {
            total: allMessages.length,
            new: allMessages.filter(m => m.status === "new").length,
            read: allMessages.filter(m => m.status === "read").length,
            replied: allMessages.filter(m => m.status === "replied").length,
            archived: allMessages.filter(m => m.status === "archived").length,
            urgent: allMessages.filter(m => m.priority === "urgent").length,
            thisWeek: allMessages.filter(m =>
                m.createdAt > Date.now() - (7 * 24 * 60 * 60 * 1000)
            ).length,
        };

        return stats;
    },
});