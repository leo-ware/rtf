/**
 * Migration script to convert existing animal gallery (image IDs) to galleryItems records.
 *
 * Run this migration once after deploying the schema changes.
 *
 * To run:
 * npx convex run migrations/migrateGalleryToGalleryItems:migrateAllAnimals
 */

import { internalMutation } from "../_generated/server"
import { v } from "convex/values"
import { Id } from "../_generated/dataModel"

// Migrate a single animal's gallery
export const migrateAnimalGallery = internalMutation({
    args: {
        animalId: v.id("animals"),
    },
    returns: v.object({
        success: v.boolean(),
        itemsCreated: v.number(),
        error: v.optional(v.string()),
    }),
    handler: async (ctx, args) => {
        const animal = await ctx.db.get(args.animalId)
        if (!animal) {
            return { success: false, itemsCreated: 0, error: "Animal not found" }
        }

        const oldGallery = animal.gallery || []
        if (oldGallery.length === 0) {
            return { success: true, itemsCreated: 0 }
        }

        // Check if the first item is already a gallery item
        const firstItem = await ctx.db.get(oldGallery[0] as Id<"galleryItems">)
        if (firstItem && "type" in firstItem) {
            // Already migrated
            return { success: true, itemsCreated: 0, error: "Already migrated" }
        }

        // Create gallery items for each image
        const newGalleryItemIds: Id<"galleryItems">[] = []

        for (const imageId of oldGallery) {
            // Verify the image exists (cast through unknown for migration from old schema)
            const imageIdTyped = imageId as unknown as Id<"images">
            const image = await ctx.db.get(imageIdTyped)
            if (!image) {
                console.warn(`Image ${imageId} not found, skipping`)
                continue
            }

            // Create a gallery item for this image
            const galleryItemId = await ctx.db.insert("galleryItems", {
                type: "image",
                imageId: imageIdTyped,
            })

            newGalleryItemIds.push(galleryItemId)
        }

        // Update the animal's gallery to use the new gallery item IDs
        await ctx.db.patch(args.animalId, {
            gallery: newGalleryItemIds,
        })

        return {
            success: true,
            itemsCreated: newGalleryItemIds.length,
        }
    },
})

// Migrate all animals
export const migrateAllAnimals = internalMutation({
    args: {},
    returns: v.object({
        totalAnimals: v.number(),
        migratedAnimals: v.number(),
        totalItemsCreated: v.number(),
        errors: v.array(v.string()),
    }),
    handler: async (ctx) => {
        const animals = await ctx.db.query("animals").collect()

        let migratedAnimals = 0
        let totalItemsCreated = 0
        const errors: string[] = []

        for (const animal of animals) {
            const oldGallery = animal.gallery || []
            if (oldGallery.length === 0) {
                continue
            }

            // Check if the first item is already a gallery item
            const firstItem = await ctx.db.get(oldGallery[0] as Id<"galleryItems">)
            if (firstItem && "type" in firstItem) {
                // Already migrated
                continue
            }

            // Create gallery items for each image
            const newGalleryItemIds: Id<"galleryItems">[] = []

            for (const imageId of oldGallery) {
                // Verify the image exists (cast through unknown for migration from old schema)
                const imageIdTyped = imageId as unknown as Id<"images">
                const image = await ctx.db.get(imageIdTyped)
                if (!image) {
                    errors.push(`Animal ${animal._id}: Image ${imageId} not found, skipping`)
                    continue
                }

                // Create a gallery item for this image
                const galleryItemId = await ctx.db.insert("galleryItems", {
                    type: "image",
                    imageId: imageIdTyped,
                })

                newGalleryItemIds.push(galleryItemId)
            }

            // Update the animal's gallery to use the new gallery item IDs
            await ctx.db.patch(animal._id, {
                gallery: newGalleryItemIds,
            })

            migratedAnimals++
            totalItemsCreated += newGalleryItemIds.length
        }

        return {
            totalAnimals: animals.length,
            migratedAnimals,
            totalItemsCreated,
            errors,
        }
    },
})
