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

// List all animals with optional filters
export const listAnimals = query({
    args: {
        limit: v.optional(v.number()),
        publicOnly: v.optional(v.boolean()),
        type: v.optional(v.union(v.literal("horse"), v.literal("burro"))),
        herdId: v.optional(v.id("herds")),
    },
    returns: v.array(v.object({
        _id: v.id("animals"),
        _creationTime: v.number(),
        name: v.string(),
        slug: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        herdId: v.id("herds"),
        description: v.string(),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        ambassador: v.boolean(),
        inMemoriam: v.boolean(),
        public: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
        herd: v.object({
            _id: v.id("herds"),
            name: v.string(),
            slug: v.string(),
        }),
        image: v.optional(v.object({
            _id: v.id("images"),
            fileName: v.string(),
            originalName: v.string(),
            mimeType: v.string(),
            size: v.number(),
            storageId: v.id("_storage"),
            altText: v.optional(v.string()),
            description: v.optional(v.string()),
            isPublic: v.boolean(),
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            url: v.string(),
        })),
    })),
    handler: async (ctx, args) => {
        let query = ctx.db.query("animals")
        
        if (args.herdId) {
            query = query.filter((q) => q.eq(q.field("herdId"), args.herdId!))
        }
        if (args.type) {
            query = query.filter((q) => q.eq(q.field("type"), args.type!))
        }
        if (args.publicOnly) {
            query = query.filter((q) => q.eq(q.field("public"), true))
        }

        const animals = await query
            .order("desc")
            .take(args.limit || 100)

        // Get herd and image information for each animal
        const animalsWithHerdsAndImages = await Promise.all(
            animals.map(async (animal) => {
                const herd = await ctx.db.get(animal.herdId)
                const image = animal.imageId ? await ctx.db.get(animal.imageId) : null
                const imageUrl = image ? await ctx.storage.getUrl(image.storageId) : undefined
                return {
                    ...animal,
                    herd: {
                        _id: herd!._id,
                        name: herd!.name,
                        slug: herd!.slug,
                    },
                    image: (image && imageUrl) ? {
                        _id: image._id,
                        fileName: image.fileName,
                        originalName: image.originalName,
                        mimeType: image.mimeType,
                        size: image.size,
                        storageId: image.storageId,
                        altText: image.altText,
                        description: image.description,
                        isPublic: image.isPublic,
                        width: image.width,
                        height: image.height,
                        url: imageUrl,
                    } : undefined,
                }
            })
        )

        return animalsWithHerdsAndImages
    },
})

// Get a specific animal by ID
export const getAnimal = query({
    args: { id: v.id("animals") },
    returns: v.union(v.null(), v.object({
        _id: v.id("animals"),
        _creationTime: v.number(),
        name: v.string(),
        slug: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        herdId: v.id("herds"),
        description: v.string(),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        ambassador: v.boolean(),
        inMemoriam: v.boolean(),
        public: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
        herd: v.object({
            _id: v.id("herds"),
            name: v.string(),
            slug: v.string(),
        }),
        image: v.optional(v.object({
            _id: v.id("images"),
            fileName: v.string(),
            originalName: v.string(),
            mimeType: v.string(),
            size: v.number(),
            storageId: v.id("_storage"),
            altText: v.optional(v.string()),
            description: v.optional(v.string()),
            isPublic: v.boolean(),
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            url: v.string(),
        })),
    })),
    handler: async (ctx, args) => {
        const animal = await ctx.db.get(args.id)
        if (!animal) return null

        const herd = await ctx.db.get(animal.herdId)
        if (!herd) return null

        const image = animal.imageId ? await ctx.db.get(animal.imageId) : null
        const imageUrl = image ? await ctx.storage.getUrl(image.storageId) : undefined

        return {
            ...animal,
            herd: {
                _id: herd._id,
                name: herd.name,
                slug: herd.slug,
            },
            image: (image && imageUrl) ? {
                _id: image._id,
                fileName: image.fileName,
                originalName: image.originalName,
                mimeType: image.mimeType,
                size: image.size,
                storageId: image.storageId,
                altText: image.altText,
                description: image.description,
                isPublic: image.isPublic,
                width: image.width,
                height: image.height,
                url: imageUrl,
            } : undefined,
        }
    },
})

// Get animal by slug
export const getAnimalBySlug = query({
    args: { slug: v.string() },
    returns: v.union(v.null(), v.object({
        _id: v.id("animals"),
        _creationTime: v.number(),
        name: v.string(),
        slug: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        herdId: v.id("herds"),
        description: v.string(),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        ambassador: v.boolean(),
        inMemoriam: v.boolean(),
        public: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
        herd: v.object({
            _id: v.id("herds"),
            name: v.string(),
            slug: v.string(),
        }),
        image: v.optional(v.object({
            _id: v.id("images"),
            fileName: v.string(),
            originalName: v.string(),
            mimeType: v.string(),
            size: v.number(),
            storageId: v.id("_storage"),
            altText: v.optional(v.string()),
            description: v.optional(v.string()),
            isPublic: v.boolean(),
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            url: v.string(),
        })),
    })),
    handler: async (ctx, args) => {
        const animal = await ctx.db
            .query("animals")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique()

        if (!animal) return null

        const herd = await ctx.db.get(animal.herdId)
        if (!herd) return null

        const image = animal.imageId ? await ctx.db.get(animal.imageId) : null
        const imageUrl = image ? await ctx.storage.getUrl(image.storageId) : undefined

        return {
            ...animal,
            herd: {
                _id: herd._id,
                name: herd.name,
                slug: herd.slug,
            },
            image: (image && imageUrl) ? {
                _id: image._id,
                fileName: image.fileName,
                originalName: image.originalName,
                mimeType: image.mimeType,
                size: image.size,
                storageId: image.storageId,
                altText: image.altText,
                description: image.description,
                isPublic: image.isPublic,
                width: image.width,
                height: image.height,
                url: imageUrl,
            } : undefined,
        }
    },
})

// Create a new animal
export const createAnimal = mutation({
    args: {
        name: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        herdId: v.id("herds"),
        description: v.string(),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        ambassador: v.optional(v.boolean()),
        inMemoriam: v.optional(v.boolean()),
        public: v.optional(v.boolean()),
    },
    returns: v.id("animals"),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Must be authenticated to create animals")
        }

        // Verify the herd exists
        const herd = await ctx.db.get(args.herdId)
        if (!herd) {
            throw new Error("Herd not found")
        }

        const slug = generateSlug(args.name)

        // Check if slug already exists
        const existingAnimal = await ctx.db
            .query("animals")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique()

        if (existingAnimal) {
            throw new Error("An animal with this name already exists")
        }

        const now = Date.now()
        return await ctx.db.insert("animals", {
            name: args.name,
            slug,
            type: args.type,
            herdId: args.herdId,
            description: args.description,
            content: args.content,
            imageId: args.imageId,
            ambassador: args.ambassador ?? false,
            inMemoriam: args.inMemoriam ?? false,
            public: args.public ?? false,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
        })
    },
})

// Update an animal
export const updateAnimal = mutation({
    args: {
        id: v.id("animals"),
        name: v.optional(v.string()),
        type: v.optional(v.union(v.literal("horse"), v.literal("burro"))),
        herdId: v.optional(v.id("herds")),
        description: v.optional(v.string()),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        ambassador: v.optional(v.boolean()),
        inMemoriam: v.optional(v.boolean()),
        public: v.optional(v.boolean()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Must be authenticated to update animals")
        }

        const animal = await ctx.db.get(args.id)
        if (!animal) {
            throw new Error("Animal not found")
        }

        const updates: any = {
            updatedAt: Date.now(),
        }

        if (args.name !== undefined) {
            const newSlug = generateSlug(args.name)

            // Check if the new slug conflicts with existing animals
            if (newSlug !== animal.slug) {
                const existingAnimal = await ctx.db
                    .query("animals")
                    .withIndex("by_slug", (q) => q.eq("slug", newSlug))
                    .unique()

                if (existingAnimal) {
                    throw new Error("An animal with this name already exists")
                }
                updates.slug = newSlug
            }

            updates.name = args.name
        }

        if (args.type !== undefined) {
            updates.type = args.type
        }

        if (args.herdId !== undefined) {
            // Verify the herd exists
            const herd = await ctx.db.get(args.herdId)
            if (!herd) {
                throw new Error("Herd not found")
            }
            updates.herdId = args.herdId
        }

        if (args.description !== undefined) {
            updates.description = args.description
        }

        if (args.content !== undefined) {
            updates.content = args.content
        }

        if (args.imageId !== undefined) {
            updates.imageId = args.imageId
        }

        if (args.ambassador !== undefined) {
            updates.ambassador = args.ambassador
        }

        if (args.inMemoriam !== undefined) {
            updates.inMemoriam = args.inMemoriam
        }

        if (args.public !== undefined) {
            updates.public = args.public
        }

        await ctx.db.patch(args.id, updates)
        return null
    },
})

// Delete an animal
export const deleteAnimal = mutation({
    args: { id: v.id("animals") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Must be authenticated to delete animals")
        }

        await ctx.db.delete(args.id)
        return null
    },
})

// Get animal statistics
export const getAnimalStats = query({
    args: {},
    returns: v.object({
        total: v.number(),
        horses: v.number(),
        burros: v.number(),
        ambassadors: v.number(),
        inMemoriam: v.number(),
        public: v.number(),
    }),
    handler: async (ctx) => {
        const allAnimals = await ctx.db.query("animals").collect()

        return {
            total: allAnimals.length,
            horses: allAnimals.filter(a => a.type === "horse").length,
            burros: allAnimals.filter(a => a.type === "burro").length,
            ambassadors: allAnimals.filter(a => a.ambassador).length,
            inMemoriam: allAnimals.filter(a => a.inMemoriam).length,
            public: allAnimals.filter(a => a.public).length,
        }
    },
})
