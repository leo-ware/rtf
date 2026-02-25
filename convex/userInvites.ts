
import { createClerkClient } from "./clerkClient";
import { v } from "convex/values";
import {
    internalMutation,
    internalQuery,
    query,
    action,
} from "./_generated/server";
import { api, internal } from "./_generated/api";

export const insertUserInvite = internalMutation({
    args: {
        email: v.string(),
        role: v.union(
            v.literal("guest"),
            v.literal("authorized"),
            v.literal("admin"),
            v.literal("dev")
        ),
        externalId: v.string(),
    },
    handler: async (ctx, args) => {
        const existingInvites = await ctx.db
            .query("userInvites")
            .withIndex("email", q => q.eq("email", args.email))
            .collect()
        
        await Promise.all((existingInvites || [])
            .map(async (invite) => {
                await ctx.db.delete(invite._id);
            })
        );

        await ctx.db.insert("userInvites", {
            email: args.email,
            role: args.role,
            externalId: args.externalId,
        });
    }
})

export const getUserInvite = internalQuery({
    args: {
        inviteId: v.id("userInvites"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.inviteId);
    }
})

export const deleteUserInvite = internalMutation({
    args: {
        inviteId: v.id("userInvites"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.inviteId);
    }
})

export const inviteUser = action({
    args: {
        email: v.string(),
        role: v.union(
            v.literal("guest"),
            v.literal("authorized"),
            v.literal("admin"),
            v.literal("dev")
        ),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.runQuery(api.users.current);
        if (!currentUser || !currentUser.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }

        // Only dev users can invite other dev users
        if (args.role === "dev" && currentUser.role !== "dev") {
            throw new Error("Only dev users can invite dev users");
        }

        const clerkClient = createClerkClient();
        const baseUrl = process.env.SITE_URL || "https://returntofreedom.org";
        const invitation = await clerkClient.invitations.createInvitation({
            emailAddress: args.email,
            redirectUrl: `${baseUrl}/admin`
        });
        
        // if this operation fails, then the user will be invtited but we won't know about it
        // not sure there's a better solution
        await ctx.runMutation(internal.userInvites.insertUserInvite, {
            email: args.email,
            role: args.role,
            externalId: invitation.id,
        });
    }
})

export const rescindInvitation = action({
    args: {
        inviteId: v.id("userInvites"),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.runQuery(api.users.current);
        if (!currentUser || !currentUser.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }

        const invite = await ctx.runQuery(internal.userInvites.getUserInvite, {
            inviteId: args.inviteId,
        });
        if (!invite) {
            throw new Error("Invite not found");
        }

        const clerkClient = createClerkClient();
        await clerkClient.invitations.revokeInvitation(invite.externalId);

        await ctx.runMutation(internal.userInvites.deleteUserInvite, {
            inviteId: args.inviteId,
        });
    }
})

export const listInvitedUsers = query({
    args: {},
    handler: async (ctx) => {
        const currentUser = await ctx.runQuery(api.users.current);
        if (!currentUser || !currentUser.atLeastAdmin) {
            throw new Error("Insufficient permissions");
        }
        
        return await ctx.db.query("userInvites").collect();
    }
})