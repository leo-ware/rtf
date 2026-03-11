import { Doc, Id } from "../_generated/dataModel"
import { MutationCtx, QMCtxType } from "../types"
import { removeUndefinedFields } from "../utils"
import { resolveImageId, ResolvedImage } from "./imageManager"
import { resolveGalleryItem } from "../galleryItems"

// Shared types for ticket pricing
export type TicketPriceOption = {
    name: string
    description?: string
    price: number
    availableBefore?: number
    availableAfter?: number
}

// Program details that can be flattened onto related entities (like events)
export type ProgramDetails = {
    description: string
    details: string
    locationId: Id<"locations">
    ticketPriceId?: Id<"ticketPrice">
    ticketPriceText?: string
    isPublic: boolean
    imageId?: Id<"images">
    requiresRegistration?: boolean
    contactEmail?: string
    contactPhone?: string
    maxAttendees?: number
    gallery?: Id<"galleryItems">[]
}

// Resolved program details with related documents
export type ResolvedProgramDetails = {
    description: string
    longDescription: string
    location: string | null
    locationId: Id<"locations"> | null
    ticketPriceId: Id<"ticketPrice"> | null
    ticketPriceText: string | undefined
    isPublic: boolean
    imageId: Id<"images"> | undefined
    image: ResolvedImage | null
    tickets: Doc<"ticketPrice"> | null
    requiresRegistration: boolean
    contactEmail: string | undefined
    contactPhone: string | undefined
    maxAttendees: number | undefined
}

// Args for creating a program
export type ProgramCreateArgs = {
    name: string
    description: string
    details: string
    locationId: Id<"locations">
    isPublic: boolean
    imageId?: Id<"images">
    programGroupId: Id<"programGroups">
    order: number
    requiresRegistration?: boolean
    contactEmail?: string
    contactPhone?: string
    maxAttendees?: number
    ticketPriceText?: string
    gallery?: Id<"galleryItems">[]
}

// Args for updating a program
export type ProgramUpdateArgs = {
    name?: string
    description?: string
    details?: string
    locationId?: Id<"locations">
    isPublic?: boolean
    imageId?: Id<"images">
    programGroupId?: Id<"programGroups">
    order?: number
    requiresRegistration?: boolean
    contactEmail?: string
    contactPhone?: string
    maxAttendees?: number
    ticketPriceText?: string
    gallery?: Id<"galleryItems">[]
}

// Internal aliases for class usage
type CreateArgs = ProgramCreateArgs
type UpdateArgs = ProgramUpdateArgs

export type ResolvedGalleryItem = NonNullable<Awaited<ReturnType<typeof resolveGalleryItem>>>

export type ProgramWithRelations = Doc<"programs"> & {
    image: ResolvedImage | null
    events: Array<Doc<"events">>
    programGroup?: Doc<"programGroups">
    ticketPrice?: Doc<"ticketPrice"> | null
    location?: Doc<"locations"> | null
    galleryItems?: ResolvedGalleryItem[]
}

export default class ProgramManager {
    id: Id<"programs">

    constructor(id: Id<"programs">) {
        this.id = id
    }

    static async create(ctx: MutationCtx, args: CreateArgs): Promise<ProgramManager> {
        // Verify program group exists
        const programGroup = await ctx.db.get(args.programGroupId)
        if (!programGroup) {
            throw new Error("Program group not found")
        }

        // Verify location exists
        const location = await ctx.db.get(args.locationId)
        if (!location) {
            throw new Error("Location not found")
        }

        const programId = await ctx.db.insert("programs", args)

        return new ProgramManager(programId)
    }

    async update(ctx: MutationCtx, args: UpdateArgs): Promise<void> {
        const updates = args

        // If changing program group, verify it exists
        if (updates.programGroupId) {
            const programGroup = await ctx.db.get(updates.programGroupId)
            if (!programGroup) {
                throw new Error("Program group not found")
            }
        }

        // If changing location, verify it exists
        if (updates.locationId) {
            const location = await ctx.db.get(updates.locationId)
            if (!location) {
                throw new Error("Location not found")
            }
        }

        const existingProgram = await this.get(ctx)
        if (!existingProgram) {
            throw new Error("Program not found")
        }

        await ctx.db.patch(this.id, {
            ...removeUndefinedFields({
                ...updates,
            }),
        })
    }

    async delete(ctx: MutationCtx): Promise<void> {
        const existingProgram = await this.get(ctx)
        if (!existingProgram) {
            throw new Error("Program not found")
        }

        // Delete all associated events first
        const associatedEvents = await this.getEvents(ctx)
        for (const event of associatedEvents) {
            await ctx.db.delete(event._id)
        }

        // Delete associated gallery items
        if (existingProgram.gallery) {
            for (const galleryItemId of existingProgram.gallery) {
                await ctx.db.delete(galleryItemId)
            }
        }

        // Delete the program
        await ctx.db.delete(this.id)
    }

    async createEvent(
        ctx: MutationCtx,
        args: { startDate: string; endDate: string; title?: string; registrationLink?: string }
    ): Promise<Id<"events">> {
        const program = await this.get(ctx)
        if (!program) {
            throw new Error("Program not found")
        }

        return await ctx.db.insert("events", {
            title: args.title || program.name,
            programId: this.id,
            dateNumber: Date.parse(args.startDate),
            startDate: args.startDate,
            endDate: args.endDate,
            registrationLink: args.registrationLink,
        })
    }

    static async reorder(
        ctx: MutationCtx,
        ids: Array<Id<"programs">>
    ): Promise<void> {
        const previousPrograms = await ctx.db.query("programs").collect()
        const previousProgramIds = previousPrograms
            .sort((a, b) => a.order - b.order)
            .map((program) => program._id)

        const allSortedIds = [...ids]
        previousProgramIds.forEach((id) => {
            if (!allSortedIds.includes(id)) {
                allSortedIds.push(id)
            }
        })

        await Promise.all(
            allSortedIds.map(async (id, order) => await ctx.db.patch(id, { order }))
        )
    }

    private static async assembleRelations(
        ctx: QMCtxType,
        program: Doc<"programs">
    ): Promise<ProgramWithRelations> {
        const [image, events, ticketPrice, location, galleryItems] = await Promise.all([
            program.imageId ? resolveImageId(ctx, program.imageId) : null,
            ctx.db
                .query("events")
                .withIndex("by_program", (q) => q.eq("programId", program._id))
                .order("desc")
                .collect(),
            program.ticketPriceId ? ctx.db.get(program.ticketPriceId) : null,
            program.locationId ? ctx.db.get(program.locationId) : null,
            program.gallery
                ? Promise.all(program.gallery.map(id => resolveGalleryItem(ctx, id)))
                : [],
        ])

        return {
            ...program,
            image,
            events,
            ticketPrice,
            location,
            galleryItems: galleryItems.filter((item): item is NonNullable<typeof item> => item !== null) as ResolvedGalleryItem[],
        }
    }

    async get(ctx: QMCtxType): Promise<Doc<"programs"> | null> {
        return await ctx.db.get(this.id)
    }

    async getWithRelations(ctx: QMCtxType): Promise<ProgramWithRelations | null> {
        const program = await this.get(ctx)
        if (!program) {
            return null
        }
        return await ProgramManager.assembleRelations(ctx, program)
    }

    async getEvents(ctx: QMCtxType): Promise<Array<Doc<"events">>> {
        return await ctx.db
            .query("events")
            .withIndex("by_program", (q) => q.eq("programId", this.id))
            .order("desc")
            .collect()
    }

    static async getAll(
        ctx: QMCtxType,
        options?: { isPublic?: boolean }
    ): Promise<Array<ProgramWithRelations>> {
        const programsQuery = options?.isPublic !== undefined
            ? ctx.db.query("programs").withIndex("by_public", (q) => q.eq("isPublic", options.isPublic!))
            : ctx.db.query("programs")

        const [programs, programGroups] = await Promise.all([
            programsQuery.order("asc").collect(),
            ctx.db.query("programGroups").collect(),
        ])

        const programGroupsMap: Map<Id<"programGroups">, Doc<"programGroups">> = new Map(
            programGroups.map((group) => [group._id, group])
        )

        return await Promise.all(
            programs.map(async (program) => {
                const manager = new ProgramManager(program._id)
                const [image, events, ticketPrice, location] = await Promise.all([
                    program.imageId ? resolveImageId(ctx, program.imageId) : null,
                    manager.getEvents(ctx),
                    program.ticketPriceId ? ctx.db.get(program.ticketPriceId) : null,
                    program.locationId ? ctx.db.get(program.locationId) : null,
                ])

                return {
                    ...program,
                    programGroup: programGroupsMap.get(program.programGroupId),
                    events: events.sort((a, b) => a.dateNumber - b.dateNumber),
                    image,
                    ticketPrice,
                    location,
                }
            })
        )
    }

    static async getByProgramGroup(
        ctx: QMCtxType,
        programGroupId: Id<"programGroups">
    ): Promise<Array<Doc<"programs"> & { image: ResolvedImage | null, galleryItems: ResolvedGalleryItem[] }>> {
        const programs = await ctx.db
            .query("programs")
            .withIndex("by_program_group", (q) =>
                q.eq("programGroupId", programGroupId)
            )
            .order("asc")
            .collect()

        return await Promise.all(
            programs.map(async (program) => {
                const [image, galleryItems] = await Promise.all([
                    program.imageId
                        ? resolveImageId(ctx, program.imageId)
                        : null,
                    program.gallery
                        ? Promise.all(program.gallery.map(id => resolveGalleryItem(ctx, id)))
                        : [],
                ])
                return {
                    ...program,
                    image,
                    galleryItems: galleryItems.filter((item): item is NonNullable<typeof item> => item !== null) as ResolvedGalleryItem[],
                }
            })
        )
    }
}

