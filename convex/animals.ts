import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { Doc, Id } from "./_generated/dataModel"
import { getCurrentUserOrThrow } from "./users"
import { resolveImageId } from "./images"
import { resolveGalleryItem } from "./galleryItems"
import { generateSlug } from "./utils"
import { animalsAggregate } from "./aggregates"
import { QMCtxType } from "./types"
import { paginationOptsValidator } from "convex/server"

const resolveAnimalRelations = async (ctx: QMCtxType, animals: Doc<"animals">[]) => {
    const [herds, images] = await Promise.all([
        Promise.all(animals.map(async (animal) => {
            return animal.herdId ? ctx.db.get(animal.herdId) : null
        })),
        Promise.all(animals.map(async (animal) => {
            return animal.imageId ? resolveImageId(ctx, animal.imageId) : null
        })),
    ])

    return animals.map((animal, index) => ({
        ...animal,
        herd: herds[index],
        image: images[index],
    }))
}

// List all animals with optional filters
export const listAnimals = query({
    args: {
        type: v.optional(v.union(v.literal("horse"), v.literal("burro"))),
        herdId: v.optional(v.id("herds")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        let query = ctx.db.query("animals")

        if (args.herdId) {
            query = query.filter((q) => q.eq(q.field("herdId"), args.herdId!))
        }
        if (args.type) {
            query = query.filter((q) => q.eq(q.field("type"), args.type!))
        }

        const animals = await query
            .order("desc")
            .paginate(args.paginationOpts)

        return {
            ...animals,
            page: await resolveAnimalRelations(ctx, animals.page),
        }
    },
})

// Get a specific animal by ID
export const getAnimal = query({
    args: { id: v.id("animals") },
    handler: async (ctx, args) => {
        const animal = await ctx.db.get(args.id)
        if (!animal) return null

        const [herd, image] = await Promise.all([
            animal.herdId ? ctx.db.get(animal.herdId) : null,
            animal.imageId ? resolveImageId(ctx, animal.imageId) : null,
        ])

        return {
            ...animal,
            herd,
            image
        }
    },
})

// Get animal by slug
export const getAnimalBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const animal = await ctx.db
            .query("animals")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique()

        if (!animal) return null

        const [herd, image] = await Promise.all([
            animal.herdId ? ctx.db.get(animal.herdId) : null,
            animal.imageId ? resolveImageId(ctx, animal.imageId) : null,
        ])

        return {
            ...animal,
            herd,
            image
        }
    },
})

export const createAnimal = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        slug: v.optional(v.string()),
        herdId: v.optional(v.id("herds")),
        imageId: v.id("images"),
        donationFormId: v.optional(v.id("donationForms")),
    },
    returns: v.id("animals"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const slug = args.slug || generateSlug(args.name)

        // Check if slug already exists
        const existingAnimal = await ctx.db
            .query("animals")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique()

        if (existingAnimal) {
            throw new Error("An animal with this name already exists")
        }

        if (args.herdId) {
            const herd = await ctx.db.get(args.herdId)
            if (!herd) {
                throw new Error("Herd not found")
            }
        }

        if (args.donationFormId) {
            const donationForm = await ctx.db.get(args.donationFormId)
            if (!donationForm) {
                throw new Error("Donation form not found")
            }
        }

        const animalId = await ctx.db.insert("animals", {
            name: args.name,
            slug,
            type: args.type,
            description: args.description,
            herdId: args.herdId,
            imageId: args.imageId,
            donationFormId: args.donationFormId,
        })
        const animal = await ctx.db.get(animalId)
        if (animal) {
            await animalsAggregate.insert(ctx, animal)
        }
        return animalId
    },
})

export const updateAnimal = mutation({
    args: {
        id: v.id("animals"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        dob: v.optional(v.number()),
        type: v.optional(v.union(v.literal("horse"), v.literal("burro"))),
        herdId: v.optional(v.id("herds")),
        description: v.optional(v.string()),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        gallery: v.optional(v.array(v.id("galleryItems"))),
        gender: v.optional(v.string()),
        age: v.optional(v.number()),
        sanctuary: v.optional(v.string()),
        inMemoriam: v.optional(v.boolean()),
        adoptable: v.optional(v.boolean()),
        adoptionFee: v.optional(v.string()),
        donationFormId: v.optional(v.id("donationForms")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const animal = await ctx.db.get(args.id)
        if (!animal) {
            throw new Error("Animal not found")
        }

        const updates: any = {}

        if (args.name !== undefined) {
            updates.name = args.name
        }

        if (args.slug !== undefined) {
            // Check if the new slug conflicts with existing animals
            if (args.slug !== animal.slug) {
                const existingAnimal = await ctx.db
                    .query("animals")
                    .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
                    .unique()

                if (existingAnimal) {
                    throw new Error("An animal with this slug already exists")
                }
                updates.slug = args.slug
            }
        }

        if (args.type !== undefined) {
            updates.type = args.type
        }

        if (args.dob !== undefined) {
            updates.dob = args.dob
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

        if (args.gallery !== undefined) {
            updates.gallery = args.gallery
        }

        if (args.gender !== undefined) {
            updates.gender = args.gender
        }

        if (args.age !== undefined) {
            updates.age = args.age
        }

        if (args.sanctuary !== undefined) {
            updates.sanctuary = args.sanctuary
        }

        if (args.inMemoriam !== undefined) {
            updates.inMemoriam = args.inMemoriam
        }

        if (args.adoptable !== undefined) {
            updates.adoptable = args.adoptable
        }

        if (args.adoptionFee !== undefined) {
            updates.adoptionFee = args.adoptionFee
        }

        if (args.donationFormId !== undefined) {
            updates.donationFormId = args.donationFormId
        }

        await ctx.db.patch(args.id, updates)
        return null
    },
})

export const deleteAnimal = mutation({
    args: { id: v.id("animals") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const animal = await ctx.db.get(args.id)
        if (animal) {
            await animalsAggregate.delete(ctx, animal)
        }
        await ctx.db.delete(args.id)
        return null
    },
})

export const getPromotedAnimalForSponsorship = query({
    args: {
        type: v.union(v.literal("horse"), v.literal("burro")),
    },
    handler: async (ctx, args) => {
        const hasLiveDonationForm = async (animal: { donationFormId?: Id<"donationForms"> }) => {
            if (!animal.donationFormId) return false
            const form = await ctx.db.get(animal.donationFormId)
            return form !== null
        }

        const promotedRaw = await ctx.db
            .query("animals")
            .filter((q) => q.eq(q.field("promoted"), true))
            .filter((q) => q.neq(q.field("inMemoriam"), true))
            .filter((q) => q.eq(q.field("type"), args.type!))
            .filter((q) => q.neq(q.field("donationFormId"), undefined))
            .order("desc")
            .take(20)
        const promotedAnimals = (await Promise.all(
            promotedRaw.map(async (a) => (await hasLiveDonationForm(a)) ? a : null)
        )).filter((a): a is typeof promotedRaw[number] => a !== null)

        let animals = promotedAnimals
        if (animals.length === 0) {
            const fallbackRaw = await ctx.db.query("animals")
                .filter((q) => q.neq(q.field("inMemoriam"), true))
                .filter((q) => q.eq(q.field("type"), args.type!))
                .filter((q) => q.neq(q.field("donationFormId"), undefined))
                .order("desc")
                .take(20)
            animals = (await Promise.all(
                fallbackRaw.map(async (a) => (await hasLiveDonationForm(a)) ? a : null)
            )).filter((a): a is typeof fallbackRaw[number] => a !== null)
        }

        const selectedAnimal = animals[Math.floor(Math.random() * animals.length)]

        const herdPromise = selectedAnimal?.herdId ? ctx.db.get(selectedAnimal.herdId) : null
        const imagePromise = selectedAnimal?.imageId ? resolveImageId(ctx, selectedAnimal.imageId) : null
        const galleryItemsPromise = selectedAnimal?.gallery
            ? Promise.all(selectedAnimal.gallery.map(async (itemId) => resolveGalleryItem(ctx, itemId as Id<"galleryItems">)))
            : null

        const [herd, image, galleryItems] = await Promise.all([
            herdPromise,
            imagePromise,
            galleryItemsPromise,
        ])

        // Filter to just images for backwards compatibility
        const galleryImages = galleryItems
            ?.filter(item => item !== null && item.type === "image")
            .map(item => item?.image) || null

        return {
            ...selectedAnimal,
            herd,
            image,
            galleryImages,
            galleryItems: galleryItems?.filter(item => item !== null) || null,
        }
    }
})

export const getAnimalsForSponsorship = query({
    args: {
        herdId: v.optional(v.id("herds")),
        type: v.optional(v.union(v.literal("horse"), v.literal("burro"))),
        promoted: v.optional(v.boolean()),
        includeInMemoriam: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        let query = ctx.db.query("animals")
        if (!args.includeInMemoriam) {
            query = query.filter((q) => q.neq(q.field("inMemoriam"), true))
        }
        query = query.filter((q) => q.neq(q.field("donationFormId"), undefined))
        if (args.herdId) {
            query = query.filter((q) => q.eq(q.field("herdId"), args.herdId!))
        }
        if (args.type) {
            query = query.filter((q) => q.eq(q.field("type"), args.type!))
        }
        if (args.promoted !== undefined) {
            if (args.promoted) {
                query = query.filter((q) => q.eq(q.field("promoted"), true))
            } else {
                query = query.filter((q) => q.neq(q.field("promoted"), true))
            }
        }
        const animalsResult = await query.order("desc").paginate(args.paginationOpts)
        const animals = animalsResult.page

        const animalsWithHerdsAndImages = await Promise.all(animals.map(async (animal) => {
            const [herd, image, donationForm] = await Promise.all([
                animal.herdId ? ctx.db.get(animal.herdId) : null,
                animal.imageId ? resolveImageId(ctx, animal.imageId) : null,
                animal.donationFormId ? ctx.db.get(animal.donationFormId) : null,
            ])
            return {
                ...animal,
                herd,
                image,
                _hasLiveDonationForm: donationForm !== null,
            }
        }))

        const filteredAnimals = animalsWithHerdsAndImages.filter((a) => a._hasLiveDonationForm)

        return {
            ...animalsResult,
            page: filteredAnimals.map(({ _hasLiveDonationForm, ...rest }) => rest),
        }
    },
})

export const getAnimalGalleryImages = query({
    args: { ids: v.array(v.id("animals")) },
    handler: async (ctx, args) => {
        return await Promise.all(args.ids.map(async (id) => {
            const animal = await ctx.db.get(id)
            if (!animal) return null

            const galleryIds = animal.gallery || []

            const itemsForAnimal = await Promise.all(
                galleryIds.map(async (itemId) => resolveGalleryItem(ctx, itemId))
            )

            // Filter to only image items and extract the image data for backwards compatibility
            const imageItems = itemsForAnimal.filter(item => item !== null && item.type === "image")
            const images = imageItems.map(item => {
                if (item && item.type === "image") {
                    return item.image
                }
                return null
            })

            return {
                animalId: animal._id,
                items: itemsForAnimal.filter(item => item !== null),
                images: images.filter(img => img !== null)
            }
        }))
    },
})

export const getAnimalGalleryItems = query({
    args: { ids: v.array(v.id("animals")) },
    handler: async (ctx, args) => {
        return await Promise.all(args.ids.map(async (id) => {
            const animal = await ctx.db.get(id)
            if (!animal) return null

            const galleryIds = animal.gallery || []

            const itemsForAnimal = await Promise.all(
                galleryIds.map(async (itemId) => resolveGalleryItem(ctx, itemId))
            )

            return {
                animalId: animal._id,
                items: itemsForAnimal.filter(item => item !== null)
            }
        }))
    },
})

export const getAnimalStats = query({
    args: {},
    returns: v.object({
        total: v.number(),
        horses: v.number(),
        burros: v.number(),
        inMemoriam: v.number(),
    }),
    handler: async (ctx) => {
        const allAnimals = await ctx.db.query("animals").collect()

        return {
            total: allAnimals.length,
            horses: allAnimals.filter(a => a.type === "horse").length,
            burros: allAnimals.filter(a => a.type === "burro").length,
            inMemoriam: allAnimals.filter(a => a.inMemoriam).length,
        }
    },
})

export const getAdoptableAnimals = query({
    args: {},
    handler: async (ctx) => {
        const animals = await ctx.db
            .query("animals")
            .withIndex("by_adoptable", (q) => q.eq("adoptable", true))
            .collect()

        return await resolveAnimalRelations(ctx, animals)
    },
})

export const listPublicSlugs = query({
    args: {},
    returns: v.array(v.string()),
    handler: async (ctx) => {
        const animals = await ctx.db
            .query("animals")
            .filter((q) => q.neq(q.field("inMemoriam"), true))
            .collect()

        return animals.map((a) => a.slug)
    },
})
