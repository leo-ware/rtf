import { query } from "./_generated/server"
import { v } from "convex/values"

const landingVideoId = "kg20pszgzw1tfzphqctjtj1trs7sdh6d"

export const getLandingVideoUrl = query({
    args: {},
    returns: v.union(v.string(), v.null()),
    handler: async (ctx, args) => {
        const url = await ctx.storage.getUrl(landingVideoId)
        return url
    },
})