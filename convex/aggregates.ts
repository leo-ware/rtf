import { TableAggregate } from "@convex-dev/aggregate"
import { DataModel } from "./_generated/dataModel"
import { components } from "./_generated/api"

// Aggregate for counting article metadata (both internal and external articles)
export const articleMetadataAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "articleMetadata"
}>(components.aggregate, {
    sortKey: () => null,
})

// Aggregate for counting events
export const eventsAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "events"
}>(components.aggregate, {
    sortKey: () => null,
})

// Aggregate for counting images
export const imagesAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "images"
}>(components.aggregate, {
    sortKey: () => null,
})

// Aggregate for counting animals
export const animalsAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "animals"
}>(components.aggregate, {
    sortKey: () => null,
})

// Aggregate for counting people
export const peopleAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "people"
}>(components.aggregate, {
    sortKey: () => null,
})

// Aggregate for counting sponsors
export const sponsorsAggregate = new TableAggregate<{
    Key: null
    DataModel: DataModel
    TableName: "sponsors"
}>(components.aggregate, {
    sortKey: () => null,
})
