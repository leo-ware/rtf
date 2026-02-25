import { TableAggregate } from "@convex-dev/aggregate"
import { DataModel } from "./_generated/dataModel"
import { components } from "./_generated/api"
import { query } from "./_generated/server"
import { v } from "convex/values"

// Aggregate for counting article metadata (both internal and external articles)
export const articleMetadataAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "articleMetadata"
}>(components.articleMetadataAggregate, {
    sortKey: () => null,
})

// Aggregate for counting events
export const eventsAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "events"
}>(components.eventsAggregate, {
    sortKey: () => null,
})

// Aggregate for counting images
export const imagesAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "images"
}>(components.imagesAggregate, {
    sortKey: () => null,
})

// Aggregate for counting animals
export const animalsAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "animals"
}>(components.animalsAggregate, {
    sortKey: () => null,
})

// Aggregate for counting people
export const peopleAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "people"
}>(components.peopleAggregate, {
    sortKey: () => null,
})

// Aggregate for counting sponsors
export const sponsorsAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "sponsors"
}>(components.sponsorsAggregate, {
    sortKey: () => null,
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
