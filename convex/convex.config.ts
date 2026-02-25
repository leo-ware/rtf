import { defineApp } from "convex/server"
import aggregate from "@convex-dev/aggregate/convex.config"

const app = defineApp()
app.use(aggregate, { name: "articleMetadataAggregate" })
app.use(aggregate, { name: "eventsAggregate" })
app.use(aggregate, { name: "imagesAggregate" })
app.use(aggregate, { name: "animalsAggregate" })
app.use(aggregate, { name: "peopleAggregate" })
app.use(aggregate, { name: "sponsorsAggregate" })

export default app
