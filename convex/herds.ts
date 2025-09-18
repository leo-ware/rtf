import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { getAuthUserId } from "@convex-dev/auth/server"

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// List all herds
export const listHerds = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("herds"),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const herds = await ctx.db
      .query("herds")
      .order("desc")
      .take(args.limit || 100)
    
    return herds
  },
})

// Get a specific herd by ID
export const getHerd = query({
  args: { id: v.id("herds") },
  returns: v.union(v.null(), v.object({
    _id: v.id("herds"),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Get herd by slug
export const getHerdBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.null(), v.object({
    _id: v.id("herds"),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("herds")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
  },
})

// Create a new herd
export const createHerd = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("herds"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error("Must be authenticated to create herds")
    }

    const slug = generateSlug(args.name)
    
    // Check if slug already exists
    const existingHerd = await ctx.db
      .query("herds")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    
    if (existingHerd) {
      throw new Error("A herd with this name already exists")
    }

    const now = Date.now()
    return await ctx.db.insert("herds", {
      name: args.name,
      slug,
      description: args.description,
      imageUrl: args.imageUrl,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Update a herd
export const updateHerd = mutation({
  args: {
    id: v.id("herds"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error("Must be authenticated to update herds")
    }

    const herd = await ctx.db.get(args.id)
    if (!herd) {
      throw new Error("Herd not found")
    }

    const updates: any = {
      updatedAt: Date.now(),
    }

    if (args.name !== undefined) {
      const newSlug = generateSlug(args.name)
      
      // Check if the new slug conflicts with existing herds
      if (newSlug !== herd.slug) {
        const existingHerd = await ctx.db
          .query("herds")
          .withIndex("by_slug", (q) => q.eq("slug", newSlug))
          .unique()
        
        if (existingHerd) {
          throw new Error("A herd with this name already exists")
        }
        updates.slug = newSlug
      }
      
      updates.name = args.name
    }

    if (args.description !== undefined) {
      updates.description = args.description
    }

    if (args.imageUrl !== undefined) {
      updates.imageUrl = args.imageUrl
    }

    await ctx.db.patch(args.id, updates)
    return null
  },
})

// Delete a herd
export const deleteHerd = mutation({
  args: { id: v.id("herds") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error("Must be authenticated to delete herds")
    }

    // Check if there are any animals in this herd
    const animalsInHerd = await ctx.db
      .query("animals")
      .withIndex("by_herd", (q) => q.eq("herdId", args.id))
      .take(1)

    if (animalsInHerd.length > 0) {
      throw new Error("Cannot delete herd that contains animals. Please reassign or remove animals first.")
    }

    await ctx.db.delete(args.id)
    return null
  },
})
