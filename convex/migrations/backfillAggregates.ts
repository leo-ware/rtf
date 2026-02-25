/**
 * Backfill migration to rebuild all dashboard aggregate counts from scratch.
 *
 * Run this once after deploying the aggregate tracking fixes.
 *
 * To run:
 * npx convex run migrations/backfillAggregates:backfillAllAggregates
 * npx convex run migrations/backfillAggregates:backfillAllAggregates --prod
 */

import { internalMutation } from "../_generated/server"
import { v } from "convex/values"
import {
    articleMetadataAggregate,
    eventsAggregate,
    imagesAggregate,
    animalsAggregate,
    peopleAggregate,
    sponsorsAggregate,
} from "../aggregates"

export const backfillAllAggregates = internalMutation({
    args: {},
    returns: v.object({
        articleMetadata: v.number(),
        events: v.number(),
        images: v.number(),
        animals: v.number(),
        people: v.number(),
        sponsors: v.number(),
    }),
    handler: async (ctx) => {
        // Clear all aggregates
        await articleMetadataAggregate.clear(ctx)
        await eventsAggregate.clear(ctx)
        await imagesAggregate.clear(ctx)
        await animalsAggregate.clear(ctx)
        await peopleAggregate.clear(ctx)
        await sponsorsAggregate.clear(ctx)

        // Rebuild articleMetadata aggregate
        const allArticleMetadata = await ctx.db.query("articleMetadata").collect()
        for (const row of allArticleMetadata) {
            await articleMetadataAggregate.insert(ctx, row)
        }

        // Rebuild events aggregate
        const allEvents = await ctx.db.query("events").collect()
        for (const row of allEvents) {
            await eventsAggregate.insert(ctx, row)
        }

        // Rebuild images aggregate
        const allImages = await ctx.db.query("images").collect()
        for (const row of allImages) {
            await imagesAggregate.insert(ctx, row)
        }

        // Rebuild animals aggregate
        const allAnimals = await ctx.db.query("animals").collect()
        for (const row of allAnimals) {
            await animalsAggregate.insert(ctx, row)
        }

        // Rebuild people aggregate
        const allPeople = await ctx.db.query("people").collect()
        for (const row of allPeople) {
            await peopleAggregate.insert(ctx, row)
        }

        // Rebuild sponsors aggregate
        const allSponsors = await ctx.db.query("sponsors").collect()
        for (const row of allSponsors) {
            await sponsorsAggregate.insert(ctx, row)
        }

        return {
            articleMetadata: allArticleMetadata.length,
            events: allEvents.length,
            images: allImages.length,
            animals: allAnimals.length,
            people: allPeople.length,
            sponsors: allSponsors.length,
        }
    },
})
