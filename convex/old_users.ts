import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";

export type CtxType = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>
export const RoleEnum = v.union(
    v.literal("authorized"),
    v.literal("admin"),
    v.literal("dev")
)

export const getAuthCurrentUser = async (ctx: CtxType) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        return null
    }
    const res = await ctx.db.get(userId)
    return res && {
        ...res,
        atLeastAuthorized: res.role === "authorized" || res.role === "admin" || res.role === "dev",
        atLeastAdmin: res.role === "admin" || res.role === "dev",
    }
}

export const getCurrentUser = query({
    handler: async (ctx) => {
        return await getAuthCurrentUser(ctx);
    }
})

// List all users (admin/dev only)
export const listUsers = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getAuthCurrentUser(ctx);
        if (!user) {
            throw new Error("User not authenticated");
        }

        if (!user.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }

        const usersPromise = ctx.db
            .query("users")
            .order("desc")
            .take(args.limit || 100);
        
        const approvedUserEmailsPromise = ctx.db
            .query("approvedUserEmails")
            .order("desc")
            .take(args.limit || 100);

        const [users, approvedUserEmails] = await Promise.all([usersPromise, approvedUserEmailsPromise]);
        const res = [
            ...users.map(u => ({...u, type: "user" as const})),
            ...approvedUserEmails.map(u => ({...u, type: "approved" as const})),
        ]
        return res
    },
});

// Update user role (admin/dev only, dev can change any role, admin cannot change dev roles)
export const updateUserRole = mutation({
    args: {
        targetUserId: v.id("users"),
        newRole: RoleEnum
    },
    handler: async (ctx, args) => {
        const user = await getAuthCurrentUser(ctx);

        if (!user || !user.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }

        const targetUser = await ctx.db.get(args.targetUserId);
        if (!targetUser) {
            throw new Error("Target user not found");
        }
        if (targetUser._id === user._id) {
            throw new Error("Cannot modify your own role");
        }
        if (targetUser.role === "dev" && user.role !== "dev") {
            throw new Error("Insufficient permissions");
        }

        await ctx.db.patch(args.targetUserId, {
            role: args.newRole,
        } as any);

        return targetUser._id;
    },
});

// // Create a new user with role (admin/dev only)
// export const createUser = mutation({
//     args: {
//         email: v.string(),
//         name: v.string(),
//         role: v.union(
//             v.literal("authorized"),
//             v.literal("admin"),
//             v.literal("dev")
//         ),
//     },
//     handler: async (ctx, args) => {
//         const user = await getAuthCurrentUser(ctx);

//         // Only admin or dev can create users
//         if (!user || !user.atLeastAdmin) {
//             throw new Error("Insufficient permissions");
//         }

//         // Admin users cannot create dev users
//         if (args.role === "dev" && user.role !== "dev") {
//             throw new Error("Admin users cannot create dev users");
//         }

//         // Check if user with this email already exists
//         const existingUser = await ctx.db
//             .query("users")
//             .withIndex("email", q => q.eq("email", args.email))
//             .first();

//         if (existingUser) {
//             throw new Error("User with this email already exists");
//         }

//         return await ctx.db.insert("users", {
//             email: args.email,
//             name: args.name,
//             role: args.role,
//         });
//     },
// });

export const deleteUser = mutation({
    args: {
        targetUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await getAuthCurrentUser(ctx);
        if (!user) {
            throw new Error("User not authenticated");
        }

        const deletingSelf = user._id === args.targetUserId;
        if (!user.atLeastAdmin && !deletingSelf) {
            throw new Error("Insufficient permissions");
        }

        const targetUser = await ctx.db.get(args.targetUserId);
        if (!targetUser) {
            throw new Error("Target user not found");
        }

        if (targetUser.role === "dev") {
            throw new Error("Dev users cannot be deleted");
        }

        await ctx.db.delete(args.targetUserId);
        return { success: true };
    },
});
