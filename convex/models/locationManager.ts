import { Doc, Id } from "../_generated/dataModel"
import { MutationCtx, QMCtxType } from "../types"
import { removeUndefinedFields } from "../utils"
import { resolveImageId, ResolvedImage } from "./imageManager"

type CreateArgs = {
    name: string
    address?: string
    notes?: string
    mapsUrl?: string
    imageId?: Id<"images">
}

type UpdateArgs = {
    name?: string
    address?: string
    notes?: string
    mapsUrl?: string
    imageId?: Id<"images">
}

export type LocationWithImage = Doc<"locations"> & {
    image: ResolvedImage | null
}

export default class LocationManager {
    id: Id<"locations">

    constructor(id: Id<"locations">) {
        this.id = id
    }

    static async create(ctx: MutationCtx, args: CreateArgs): Promise<LocationManager> {
        const locationId = await ctx.db.insert("locations", {
            name: args.name,
            address: args.address,
            notes: args.notes,
            mapsUrl: args.mapsUrl,
            imageId: args.imageId,
        })
        return new LocationManager(locationId)
    }

    async update(ctx: MutationCtx, args: UpdateArgs): Promise<void> {
        const patch = removeUndefinedFields(args)
        await ctx.db.patch(this.id, patch)
    }

    async delete(ctx: MutationCtx): Promise<void> {
        await ctx.db.delete(this.id)
    }

    async get(ctx: QMCtxType): Promise<Doc<"locations"> | null> {
        return await ctx.db.get(this.id)
    }

    async getWithImage(ctx: QMCtxType): Promise<LocationWithImage | null> {
        const location = await this.get(ctx)
        if (!location) return null
        return await LocationManager.assembleWithImage(ctx, location)
    }

    private static async assembleWithImage(
        ctx: QMCtxType,
        location: Doc<"locations">
    ): Promise<LocationWithImage> {
        const image = location.imageId
            ? await resolveImageId(ctx, location.imageId)
            : null
        return { ...location, image }
    }

    static async search(
        ctx: QMCtxType,
        query: string,
        paginationOpts: { numItems: number; cursor: string | null }
    ) {
        if (!query.trim()) {
            const results = await ctx.db
                .query("locations")
                .order("asc")
                .paginate(paginationOpts)

            return {
                ...results,
                page: await Promise.all(
                    results.page.map(loc => LocationManager.assembleWithImage(ctx, loc))
                ),
            }
        }

        const results = await ctx.db
            .query("locations")
            .withSearchIndex("searchName", q => q.search("name", query))
            .paginate(paginationOpts)

        return {
            ...results,
            page: await Promise.all(
                results.page.map(loc => LocationManager.assembleWithImage(ctx, loc))
            ),
        }
    }

    static async getOrCreateByName(ctx: MutationCtx, name: string): Promise<LocationManager> {
        const trimmedName = name.trim() || "TBD"

        // Search for existing location with this name
        const existingLocations = await ctx.db
            .query("locations")
            .withSearchIndex("searchName", q => q.search("name", trimmedName))
            .take(10)

        const exactMatch = existingLocations.find(
            l => l.name.toLowerCase() === trimmedName.toLowerCase()
        )

        if (exactMatch) {
            return new LocationManager(exactMatch._id)
        }

        // Create new location
        return await LocationManager.create(ctx, { name: trimmedName })
    }
}

