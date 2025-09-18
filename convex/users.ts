import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const currentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    // Add default role if not present
    return {
      ...user,
      role: (user as any).role || "authorized",
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const updateData: Record<string, any> = {};

    if (args.name !== undefined) {
      updateData.name = args.name;
    }

    if (args.image !== undefined) {
      updateData.image = args.image;
    }

    await ctx.db.patch(userId, updateData);

    return await ctx.db.get(userId);
  },
});