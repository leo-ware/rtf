import { query } from "./_generated/server"
import { v } from "convex/values"
import {
    articleMetadataAggregate,
    eventsAggregate,
    imagesAggregate,
    animalsAggregate,
    peopleAggregate,
    sponsorsAggregate,
} from "./aggregates"

export const getArticleMetadataCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        return await articleMetadataAggregate.count(ctx)
    },
})

export const getEventsCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        return await eventsAggregate.count(ctx)
    },
})

export const getImagesCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        return await imagesAggregate.count(ctx)
    },
})

export const getAnimalsCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        return await animalsAggregate.count(ctx)
    },
})

export const getPeopleCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        return await peopleAggregate.count(ctx)
    },
})

export const getSponsorsCount = query({
    args: {},
    returns: v.number(),
    handler: async (ctx) => {
        return await sponsorsAggregate.count(ctx)
    },
})

// Dashboard-specific query that returns all counts in one call
export const getDashboardCounts = query({
    args: {},
    returns: v.object({
        articles: v.number(),
        events: v.number(),
        images: v.number(),
        animals: v.number(),
        people: v.number(),
        sponsors: v.number(),
    }),
    handler: async (ctx) => {
        const [articles, events, images, animals, people, sponsors] = await Promise.all([
            articleMetadataAggregate.count(ctx),
            eventsAggregate.count(ctx),
            imagesAggregate.count(ctx),
            animalsAggregate.count(ctx),
            peopleAggregate.count(ctx),
            sponsorsAggregate.count(ctx),
        ])

        return {
            articles,
            events,
            images,
            animals,
            people,
            sponsors,
        }
    },
})
