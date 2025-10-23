import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { RoleEnum, getAuthCurrentUser } from "./users";
import { removeUndefinedFields } from "./utils";

export const createApprovedUserEmail = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        role: RoleEnum
    },
    handler: async (ctx, args) => {
        const user = await getAuthCurrentUser(ctx);
        if (!user || !user.atLeastAdmin || args.role === "dev") {
            throw new Error("Insufficient permissions");
        }

        await ctx.db.insert("approvedUserEmails", {
            name: args.name,
            email: args.email,
            role: args.role,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
    }
})

export const editApprovedUserEmail = mutation({
    args: {
        id: v.id("approvedUserEmails"),
        name: v.optional(v.string()),
        role: v.optional(RoleEnum),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getAuthCurrentUser(ctx);
        if (!user || !user.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }
        if (args.role === "dev" && user.role !== "dev") {
            throw new Error("Insufficient permissions");
        }
        await ctx.db.patch(args.id, removeUndefinedFields({
            name: args.name,
            role: args.role,
            email: args.email,
        }))
    }
})

export const deleteApprovedUserEmail = mutation({
    args: {
        id: v.id("approvedUserEmails"),
    },
    handler: async (ctx, args) => {
        const user = await getAuthCurrentUser(ctx);
        if (!user || !user.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }
        await ctx.db.delete(args.id)
    }
})