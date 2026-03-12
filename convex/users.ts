import { UserJSON } from "@clerk/backend";
import { createClerkClient } from "./clerkClient";
import { v, Validator } from "convex/values";
import { QMCtxType } from "./types";

import {
    internalMutation,
    query,
    action,
    mutation,
    QueryCtx,
    MutationCtx,
} from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { ConvexValueRole } from "./schema";

export async function getCurrentUser(ctx: QMCtxType) {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
        return null;
    }
    const user = await userByExternalId(ctx, identity.subject);
    return user && {
        ...user,
        atLeastAuthorized: user.role === "authorized" || user.role === "admin" || user.role === "dev",
        atLeastAdmin: user.role === "admin" || user.role === "dev",
    }
}

export async function getCurrentUserOrThrow(ctx: QMCtxType) {
    const userRecord = await getCurrentUser(ctx);
    if (!userRecord) throw new Error("Can't get current user");
    return userRecord;
}

export const userById = async (ctx: QMCtxType, userId: Id<"users">) => {
    return await ctx.db.get(userId);
}

async function userByExternalId(ctx: QMCtxType, externalId: string) {
    return await ctx.db
        .query("users")
        .withIndex("externalId", (q) => q.eq("externalId", externalId))
        .unique();
}

export const current = query({
    args: {},
    returns: v.union(
        v.object({
            _id: v.id("users"),
            _creationTime: v.number(),
            name: v.string(),
            firstName: v.string(),
            lastName: v.string(),
            externalId: v.string(),
            email: v.array(v.string()),
            role: ConvexValueRole,
            atLeastAuthorized: v.boolean(),
            atLeastAdmin: v.boolean(),
        }),
        v.null(),
    ),
    handler: async (ctx) => {
        return await getCurrentUser(ctx);
    },
});

export const queryUserById = query({
    args: {
        userId: v.id("users"),
    },
    returns: v.union(
        v.object({
            _id: v.id("users"),
            _creationTime: v.number(),
            name: v.string(),
            firstName: v.string(),
            lastName: v.string(),
            externalId: v.string(),
            email: v.array(v.string()),
            role: ConvexValueRole,
        }),
        v.null(),
    ),
    handler: async (ctx, args) => {
        return await userById(ctx, args.userId);
    }
})

export const modifyUserRole = mutation({
    args: {
        userId: v.id("users"),
        newRole: v.union(
            v.literal("guest"),
            v.literal("authorized"),
            v.literal("admin")
        ),
    },
    returns: v.id("users"),
    handler: async (ctx, args) => {
        const currentUser = await getCurrentUserOrThrow(ctx);
        if (!currentUser.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }

        const user = await userById(ctx, args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.role === "dev") {
            throw new Error("Insufficient permissions");
        }

        await ctx.db.patch(args.userId, {
            role: args.newRole,
        });

        return user._id;
    }
})

export const listUsers = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100;

        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }

        const users = await ctx.db
            .query("users")
            .order("desc")
            .take(limit)

        return users;
    }
})

//
// Interfacing with Clerk

// listen for updates
export const upsertFromClerk = internalMutation({
    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
    async handler(ctx, { data }) {

        let role: "guest" | "authorized" | "admin" | "dev" = "authorized";

        // Check if we need to bootstrap a dev user
        if (process.env.BOOTSTRAP_DEV_EMAIL) {
            const matchingEmail = data.email_addresses.find((email) => (
                email.email_address === process.env.BOOTSTRAP_DEV_EMAIL
            ));
            if (matchingEmail && matchingEmail.verification?.status === "verified") {
                role = "dev";
            }
        }

        // check if this user has a role preset in their invite
        if (role === "authorized") {
            const existingInvites = await ctx.db
                .query("userInvites")
                .withIndex("email", q => q.eq("email", data.email_addresses[0].email_address))
                .collect()
            if (existingInvites.length > 0) {
                role = existingInvites[0].role;
            }

            await Promise.all((existingInvites || [])
                .map(async (invite) => {
                    await ctx.db.delete(invite._id);
                })
            );
        }

        const userAttributes = {
            name: `${data.first_name || "FNU"} ${data.last_name || "LNU"}`,
            firstName: data.first_name || "FNU",
            lastName: data.last_name || "LNU",
            externalId: data.id,
            email: data.email_addresses.map((email) => email.email_address),
            role: role,
        };

        const user = await userByExternalId(ctx, data.id);
        if (user === null) {
            await ctx.db.insert("users", userAttributes);
        } else {
            await ctx.db.patch(user._id, userAttributes);
        }
    },
});

// delete a use from the database after they've been deleted from Clerk
export const deleteFromClerk = internalMutation({
    args: { clerkUserId: v.string() },
    async handler(ctx, { clerkUserId }) {
        const user = await userByExternalId(ctx, clerkUserId);

        if (user !== null) {
            await ctx.db.delete(user._id);
        } else {
            console.warn(
                `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
            );
        }
    },
});

// delete a user in Clerk, which will trigger a webhook which will trigger deleteFromClerk
export const deleteUserInClerk = action({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const [currentUser, targetUser] = await Promise.all([
            ctx.runQuery(api.users.current),
            ctx.runQuery(api.users.queryUserById, { userId: args.userId })
        ])

        if (!targetUser) {
            throw new Error("Target user not found");
        }

        if (!currentUser || !currentUser.atLeastAdmin || targetUser.role === "dev") {
            throw new Error("Insufficient permissions");
        }

        const clerkClient = createClerkClient()
        await clerkClient.users.deleteUser(targetUser.externalId);
    }
})
