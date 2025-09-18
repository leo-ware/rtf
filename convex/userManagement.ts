import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Define user roles
export const USER_ROLES = {
  AUTHORIZED: "authorized",
  ADMIN: "admin",
  DEV: "dev"
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Check if user has admin or dev permissions
export const hasAdminAccess = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    // Check if user has role field, if not default to authorized
    const userRole = (user as any).role || USER_ROLES.AUTHORIZED;
    return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.DEV;
  },
});

// Check if user has dev permissions
export const hasDevAccess = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    const userRole = (user as any).role || USER_ROLES.AUTHORIZED;
    return userRole === USER_ROLES.DEV;
  },
});

// Get current user's role
export const getCurrentUserRole = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return (user as any).role || USER_ROLES.AUTHORIZED;
  },
});

// List all users (admin/dev only)
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    const userRole = (currentUser as any).role || USER_ROLES.AUTHORIZED;
    if (userRole !== USER_ROLES.ADMIN && userRole !== USER_ROLES.DEV) {
      throw new Error("Insufficient permissions");
    }

    const users = await ctx.db
      .query("users")
      .order("desc")
      .take(args.limit || 50);

    return users.map(user => ({
      ...user,
      role: (user as any).role || USER_ROLES.AUTHORIZED,
    }));
  },
});

// Update user role (admin/dev only, dev can change any role, admin cannot change dev roles)
export const updateUserRole = mutation({
  args: {
    targetUserId: v.id("users"),
    newRole: v.union(
      v.literal("authorized"),
      v.literal("admin"),
      v.literal("dev")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    const currentUserRole = (currentUser as any).role || USER_ROLES.AUTHORIZED;

    // Only admin or dev can update roles
    if (currentUserRole !== USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.DEV) {
      throw new Error("Insufficient permissions");
    }

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    const targetUserRole = (targetUser as any).role || USER_ROLES.AUTHORIZED;

    // Admin users cannot modify dev users or create dev users
    if (currentUserRole === USER_ROLES.ADMIN) {
      if (targetUserRole === USER_ROLES.DEV) {
        throw new Error("Admin users cannot modify dev users");
      }
      if (args.newRole === USER_ROLES.DEV) {
        throw new Error("Admin users cannot create dev users");
      }
    }

    // Cannot modify yourself
    if (userId === args.targetUserId) {
      throw new Error("Cannot modify your own role");
    }

    await ctx.db.patch(args.targetUserId, {
      role: args.newRole,
    } as any);

    return await ctx.db.get(args.targetUserId);
  },
});

// Create a new user with role (admin/dev only)
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("authorized"),
      v.literal("admin"),
      v.literal("dev")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    const currentUserRole = (currentUser as any).role || USER_ROLES.AUTHORIZED;

    // Only admin or dev can create users
    if (currentUserRole !== USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.DEV) {
      throw new Error("Insufficient permissions");
    }

    // Admin users cannot create dev users
    if (currentUserRole === USER_ROLES.ADMIN && args.role === USER_ROLES.DEV) {
      throw new Error("Admin users cannot create dev users");
    }

    // Check if user with this email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create the user
    const newUserId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      emailVerified: Date.now(), // Mark as verified since admin is creating
    } as any);

    return await ctx.db.get(newUserId);
  },
});

// Delete user (dev only)
export const deleteUser = mutation({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    const currentUserRole = (currentUser as any).role || USER_ROLES.AUTHORIZED;

    // Only dev can delete users
    if (currentUserRole !== USER_ROLES.DEV) {
      throw new Error("Only dev users can delete users");
    }

    // Cannot delete yourself
    if (userId === args.targetUserId) {
      throw new Error("Cannot delete your own account");
    }

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    await ctx.db.delete(args.targetUserId);

    return { success: true };
  },
});

// Bootstrap function to set initial dev user (for development/setup only)
export const setInitialDevUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found with email: " + args.email);
    }

    // Update user to dev role
    await ctx.db.patch(user._id, {
      role: USER_ROLES.DEV,
    } as any);

    return { success: true, user: await ctx.db.get(user._id) };
  },
});