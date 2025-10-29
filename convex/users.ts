import { internalMutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
    args: {},
    handler: async (ctx) => {
        return await getCurrentUser(ctx);
    },
});

export const upsertFromClerk = internalMutation({
    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
    async handler(ctx, { data }) {

        let role: "authorized" | "admin" | "dev" = "authorized";

        // Check if we need to bootstrap a dev user
        if (process.env.BOOTSTRAP_DEV_EMAIL) {
            const matchingEmail = data.email_addresses.find((email) => (
                email.email_address === process.env.BOOTSTRAP_DEV_EMAIL
            ));
            if (matchingEmail && matchingEmail.verification?.status === "verified") {
                role = "dev";
            }
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

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    const userRecord = await getCurrentUser(ctx);
    if (!userRecord) throw new Error("Can't get current user");
    return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
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

async function userByExternalId(ctx: QueryCtx, externalId: string) {
    return await ctx.db
        .query("users")
        .withIndex("externalId", (q) => q.eq("externalId", externalId))
        .unique();
}
