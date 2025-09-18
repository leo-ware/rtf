import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

function generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const subscribeToNewsletter = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        interests: v.optional(v.array(v.string())),
        source: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if email already exists
        const existingSubscriber = await ctx.db
            .query("newsletterSubscribers")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingSubscriber) {
            if (existingSubscriber.status === "unsubscribed") {
                // Reactivate subscription
                await ctx.db.patch(existingSubscriber._id, {
                    status: "pending",
                    name: args.name || existingSubscriber.name,
                    interests: args.interests || existingSubscriber.interests,
                    confirmationToken: generateToken(),
                    subscribedAt: Date.now(),
                    unsubscribedAt: undefined,
                });
                return existingSubscriber._id;
            } else if (existingSubscriber.status === "pending") {
                // Update pending subscription
                await ctx.db.patch(existingSubscriber._id, {
                    name: args.name || existingSubscriber.name,
                    interests: args.interests || existingSubscriber.interests,
                    confirmationToken: generateToken(),
                });
                return existingSubscriber._id;
            } else {
                throw new Error("Email is already subscribed to newsletter");
            }
        }

        const subscriberId = await ctx.db.insert("newsletterSubscribers", {
            email: args.email,
            name: args.name,
            status: "pending",
            interests: args.interests,
            source: args.source || "newsletter_form",
            confirmationToken: generateToken(),
            unsubscribeToken: generateToken(),
            subscribedAt: Date.now(),
        });

        return subscriberId;
    },
});

export const confirmSubscription = mutation({
    args: {
        token: v.string(),
    },
    handler: async (ctx, args) => {
        const subscriber = await ctx.db
            .query("newsletterSubscribers")
            .withIndex("by_confirmation_token", (q) => q.eq("confirmationToken", args.token))
            .first();

        if (!subscriber) {
            throw new Error("Invalid confirmation token");
        }

        if (subscriber.status !== "pending") {
            throw new Error("Subscription is not pending confirmation");
        }

        await ctx.db.patch(subscriber._id, {
            status: "confirmed",
            confirmedAt: Date.now(),
            confirmationToken: undefined,
        });

        return subscriber._id;
    },
});

export const unsubscribeFromNewsletter = mutation({
    args: {
        token: v.string(),
    },
    handler: async (ctx, args) => {
        const subscriber = await ctx.db
            .query("newsletterSubscribers")
            .withIndex("by_unsubscribe_token", (q) => q.eq("unsubscribeToken", args.token))
            .first();

        if (!subscriber) {
            throw new Error("Invalid unsubscribe token");
        }

        await ctx.db.patch(subscriber._id, {
            status: "unsubscribed",
            unsubscribedAt: Date.now(),
        });

        return subscriber._id;
    },
});

export const listNewsletterSubscribers = query({
    args: {
        limit: v.optional(v.number()),
        status: v.optional(v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("unsubscribed"),
            v.literal("bounced")
        )),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view newsletter subscribers");
        }

        const limit = args.limit ?? 50;

        let query = ctx.db.query("newsletterSubscribers");

        const searchStatus = args.status ?? undefined;
        if (searchStatus !== undefined) {
            return await query
                .withIndex("by_status", (q) => q.eq("status", searchStatus))
                .order("desc")
                .take(limit);
        } else {
            return await query
                .withIndex("by_subscribed_at")
                .order("desc")
                .take(limit);
        }
    },
});

export const getNewsletterSubscriber = query({
    args: { id: v.id("newsletterSubscribers") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view newsletter subscribers");
        }

        const subscriber = await ctx.db.get(args.id);
        return subscriber;
    },
});

export const updateSubscriberStatus = mutation({
    args: {
        id: v.id("newsletterSubscribers"),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("unsubscribed"),
            v.literal("bounced")
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update newsletter subscribers");
        }

        const updateData: any = { status: args.status };

        if (args.status === "confirmed") {
            updateData.confirmedAt = Date.now();
        } else if (args.status === "unsubscribed") {
            updateData.unsubscribedAt = Date.now();
        }

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const deleteNewsletterSubscriber = mutation({
    args: { id: v.id("newsletterSubscribers") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete newsletter subscribers");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const getNewsletterStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to view newsletter stats");
        }

        const allSubscribers = await ctx.db.query("newsletterSubscribers").collect();

        const stats = {
            total: allSubscribers.length,
            confirmed: allSubscribers.filter(s => s.status === "confirmed").length,
            pending: allSubscribers.filter(s => s.status === "pending").length,
            unsubscribed: allSubscribers.filter(s => s.status === "unsubscribed").length,
            bounced: allSubscribers.filter(s => s.status === "bounced").length,
            thisMonth: allSubscribers.filter(s =>
                s.subscribedAt > Date.now() - (30 * 24 * 60 * 60 * 1000)
            ).length,
            thisWeek: allSubscribers.filter(s =>
                s.subscribedAt > Date.now() - (7 * 24 * 60 * 60 * 1000)
            ).length,
        };

        return stats;
    },
});

export const checkSubscriptionStatus = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const subscriber = await ctx.db
            .query("newsletterSubscribers")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!subscriber) {
            return { subscribed: false, status: null };
        }

        return {
            subscribed: subscriber.status === "confirmed" || subscriber.status === "pending",
            status: subscriber.status,
        };
    },
});