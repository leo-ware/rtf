import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { paginationOptsValidator } from "convex/server";
import { internal } from "./_generated/api";

export const submitContactMessage = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        organization: v.optional(v.string()),
        topic: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
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
            topic: args.topic,
            searchText: `
            User Name: ${args.name}
            User Email: ${args.email}
            User Phone: ${args.phone}
            Message Topic: ${args.topic}
            Message Subject: ${args.subject}
            Message Body: ${args.message}
            `,
        });

        const {status, emailOutboxId, error} = await ctx.runMutation(internal.email.queueEmail, {
            userName: args.name,
            userEmail: args.email,
            topic: args.topic,
            subject: args.subject,
            body: args.message,
            email: args.email,
        })
        
        await ctx.db.patch(messageId, {
            emailOutboxId,
        })

        if (status === "failed") {
            throw new Error(`Failed to queue email: ${error}`);
        } else {
            return messageId;
        }
    },
});

export const listContactMessages = query({
    args: {
        status: v.optional(v.union(
            v.literal("new"),
            v.literal("read"),
            v.literal("replied"),
            v.literal("archived")
        )),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        let messages;

        if (args.status) {
            const status = args.status;
            messages = await ctx.db
                .query("contactMessages")
                .withIndex("by_status", (q) => q.eq("status", status))
                .order("desc")
                .paginate(args.paginationOpts);
        } else {
            messages = await ctx.db
                .query("contactMessages")
                .order("desc")
                .paginate(args.paginationOpts);
        }

        return messages;
    },
});

export const getContactMessage = query({
    args: { id: v.id("contactMessages") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
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
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
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

export const deleteContactMessage = mutation({
    args: { id: v.id("contactMessages") },
    returns: v.object({ success: v.boolean() }),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});
