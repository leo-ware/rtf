import { Doc, Id } from "../_generated/dataModel"
import { MutationCtx, QMCtxType } from "../types"
import { removeUndefinedFields } from "../utils"
import { resolveImageId } from "./imageManager"
import LocationManager from "./locationManager"
import {
    ResolvedProgramDetails,
    ProgramCreateArgs,
    ProgramUpdateArgs,
} from "./programManager"

// Constants
const STANDALONE_EVENTS_GROUP_NAME = "Standalone Events"

// Event-specific fields for creation
type EventCreateFields = {
    title: string
    startDate: string
    endDate: string
    programId?: Id<"programs">
    registrationLink?: string
    status?: "scheduled" | "cancelled" | "sold_out"
}

// Event-specific fields for updates
type EventUpdateFields = {
    title?: string
    startDate?: string
    endDate?: string
    registrationLink?: string
    status?: "scheduled" | "cancelled" | "sold_out"
}

// Program fields adapted for event creation (some fields optional/renamed)
type EventProgramCreateFields = Omit<ProgramCreateArgs, "name" | "programGroupId" | "order" | "details" | "locationId"> & {
    longDescription?: string
    location?: string
    locationId?: Id<"locations">
}

// Program fields adapted for event updates
type EventProgramUpdateFields = Omit<ProgramUpdateArgs, "name" | "programGroupId" | "order" | "details"> & {
    longDescription?: string
    location?: string
}

// Combined create args using intersection
type CreateArgs = EventCreateFields & EventProgramCreateFields

// Combined update args using intersection
type UpdateArgs = EventUpdateFields & EventProgramUpdateFields

// Event with flattened program details
export type EventWithProgram = Doc<"events"> & ResolvedProgramDetails

export default class EventManager {
    id: Id<"events">

    constructor(id: Id<"events">) {
        this.id = id
    }

    static async create(ctx: MutationCtx, args: CreateArgs): Promise<EventManager> {
        let programId = args.programId

        // If no programId provided, create a standalone program
        if (!programId) {
            const programGroupId = await EventManager.getOrCreateStandaloneEventsGroup(ctx)

            // Get or create location
            let locationId = args.locationId
            if (!locationId) {
                const locationManager = await LocationManager.getOrCreateByName(
                    ctx,
                    args.location || "TBD"
                )
                locationId = locationManager.id
            }

            // Get max order for programs in the standalone group
            const existingPrograms = await ctx.db
                .query("programs")
                .withIndex("by_program_group", q => q.eq("programGroupId", programGroupId))
                .collect()
            const maxOrder = existingPrograms.reduce(
                (max, p) => Math.max(max, p.order),
                -1
            )

            // Create the program
            programId = await ctx.db.insert("programs", {
                programGroupId,
                order: maxOrder + 1,
                name: args.title,
                description: args.description,
                details: args.longDescription || "",
                ticketPriceText: args.ticketPriceText,
                locationId,
                maxAttendees: args.maxAttendees,
                requiresRegistration: args.requiresRegistration,
                contactEmail: args.contactEmail,
                contactPhone: args.contactPhone,
                isPublic: args.isPublic,
                imageId: args.imageId,
            })
        }

        // Create the event
        const eventId = await ctx.db.insert("events", {
            title: args.title,
            programId,
            startDate: args.startDate,
            endDate: args.endDate,
            dateNumber: Date.parse(args.startDate),
            registrationLink: args.registrationLink,
            status: args.status ?? "scheduled",
        })

        return new EventManager(eventId)
    }

    async update(ctx: MutationCtx, args: UpdateArgs): Promise<void> {
        const existingEvent = await this.get(ctx)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        // Update event fields
        const eventUpdates: Partial<Doc<"events">> = {}
        if (args.title !== undefined) eventUpdates.title = args.title
        if (args.startDate !== undefined) {
            eventUpdates.startDate = args.startDate
            eventUpdates.dateNumber = Date.parse(args.startDate)
        }
        if (args.endDate !== undefined) eventUpdates.endDate = args.endDate
        if (args.registrationLink !== undefined) eventUpdates.registrationLink = args.registrationLink
        if (args.status !== undefined) eventUpdates.status = args.status

        if (Object.keys(eventUpdates).length > 0) {
            await ctx.db.patch(this.id, eventUpdates)
        }

        // Update program fields if event has a program
        if (existingEvent.programId) {
            const program = await ctx.db.get(existingEvent.programId)
            if (program) {
                const programUpdates: Record<string, any> = {}

                if (args.title !== undefined) programUpdates.name = args.title
                if (args.description !== undefined) programUpdates.description = args.description
                if (args.longDescription !== undefined) programUpdates.details = args.longDescription
                if (args.maxAttendees !== undefined) programUpdates.maxAttendees = args.maxAttendees
                if (args.isPublic !== undefined) programUpdates.isPublic = args.isPublic
                if (args.requiresRegistration !== undefined) programUpdates.requiresRegistration = args.requiresRegistration
                if (args.contactEmail !== undefined) programUpdates.contactEmail = args.contactEmail
                if (args.contactPhone !== undefined) programUpdates.contactPhone = args.contactPhone
                if (args.imageId !== undefined) programUpdates.imageId = args.imageId
                if (args.ticketPriceText !== undefined) programUpdates.ticketPriceText = args.ticketPriceText

                // Handle location update
                if (args.locationId !== undefined) {
                    programUpdates.locationId = args.locationId
                } else if (args.location !== undefined) {
                    const locationManager = await LocationManager.getOrCreateByName(
                        ctx,
                        args.location
                    )
                    programUpdates.locationId = locationManager.id
                }

                if (Object.keys(programUpdates).length > 0) {
                    await ctx.db.patch(existingEvent.programId, removeUndefinedFields(programUpdates))
                }
            }
        }
    }

    async delete(ctx: MutationCtx): Promise<void> {
        const existingEvent = await this.get(ctx)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        // Check if this is a standalone program that should be deleted
        if (existingEvent.programId) {
            const program = await ctx.db.get(existingEvent.programId)
            if (program) {
                const programGroup = await ctx.db.get(program.programGroupId)

                // Check if this is a standalone program (in the Standalone Events group)
                if (programGroup?.name === STANDALONE_EVENTS_GROUP_NAME) {
                    // Check if there are other events using this program
                    const otherEvents = await ctx.db
                        .query("events")
                        .withIndex("by_program", q => q.eq("programId", existingEvent.programId))
                        .collect()

                    // If this is the only event using this program, delete the program too
                    if (otherEvents.length <= 1) {
                        // Delete the ticket price if it exists
                        if (program.ticketPriceId) {
                            await ctx.db.delete(program.ticketPriceId)
                        }
                        await ctx.db.delete(program._id)
                    }
                }
            }
        }

        await ctx.db.delete(this.id)
    }

    async get(ctx: QMCtxType): Promise<Doc<"events"> | null> {
        return await ctx.db.get(this.id)
    }

    async getWithRelations(ctx: QMCtxType): Promise<EventWithProgram | null> {
        const event = await this.get(ctx)
        if (!event) {
            return null
        }
        return await EventManager.assembleRelations(ctx, event)
    }

    private static async assembleRelations(
        ctx: QMCtxType,
        event: Doc<"events">
    ): Promise<EventWithProgram | null> {
        if (!event.programId) {
            // Event without program - return minimal data
            return {
                ...event,
                description: "",
                longDescription: "",
                location: null,
                locationId: null,
                maxAttendees: undefined,
                ticketPriceId: null,
                ticketPriceText: undefined,
                isPublic: false,
                requiresRegistration: false,
                contactEmail: undefined,
                contactPhone: undefined,
                imageId: undefined,
                image: null,
                tickets: null,
            }
        }

        const program = await ctx.db.get(event.programId)
        if (!program) {
            return null
        }

        const [location, tickets, image] = await Promise.all([
            program.locationId ? ctx.db.get(program.locationId) : null,
            program.ticketPriceId ? ctx.db.get(program.ticketPriceId) : null,
            program.imageId ? resolveImageId(ctx, program.imageId) : null,
        ])

        return {
            ...event,
            description: program.description,
            longDescription: program.details,
            location: location?.name ?? null,
            locationId: program.locationId ?? null,
            maxAttendees: program.maxAttendees,
            ticketPriceId: program.ticketPriceId ?? null,
            ticketPriceText: program.ticketPriceText,
            isPublic: program.isPublic,
            requiresRegistration: program.requiresRegistration ?? false,
            contactEmail: program.contactEmail,
            contactPhone: program.contactPhone,
            imageId: program.imageId,
            image,
            tickets,
        }
    }

    // Static query methods

    static async getAll(
        ctx: QMCtxType,
        options?: { isPublic?: boolean }
    ): Promise<Array<EventWithProgram>> {
        const events = await ctx.db
            .query("events")
            .withIndex("by_date_number")
            .order("desc")
            .collect()

        const eventsWithRelations = await Promise.all(
            events.map(event => EventManager.assembleRelations(ctx, event))
        )

        let filtered = eventsWithRelations.filter(
            (e): e is EventWithProgram => e !== null
        )

        if (options?.isPublic !== undefined) {
            filtered = filtered.filter(e => e.isPublic === options.isPublic)
        }

        return filtered
    }

    static async getPaginated(
        ctx: QMCtxType,
        options: { publicOnly?: boolean },
        paginationOpts: { numItems: number; cursor: string | null }
    ) {
        const result = await ctx.db
            .query("events")
            .withIndex("by_date_number")
            .order("asc")
            .paginate(paginationOpts)

        const eventsWithRelations = await Promise.all(
            result.page.map(event => EventManager.assembleRelations(ctx, event))
        )
        const eventsFiltered = eventsWithRelations
            .filter((e): e is EventWithProgram => e !== null)
            .filter(e => (!options.publicOnly || e.isPublic))

        return {
            ...result,
            page: eventsFiltered,
        }
    }

    static async getUpcomingPaginated(
        ctx: QMCtxType,
        options: { publicOnly?: boolean },
        paginationOpts: { numItems: number; cursor: string | null }
    ) {
        const now = Date.now()

        const result = await ctx.db
            .query("events")
            .withIndex("by_date_number", q => q.gte("dateNumber", now))
            .order("asc")
            .paginate(paginationOpts)

        const eventsWithRelations = await Promise.all(
            result.page.map(event => EventManager.assembleRelations(ctx, event))
        )
        const eventsFiltered = eventsWithRelations
            .filter((e): e is EventWithProgram => e !== null)
            .filter(e => (!options.publicOnly || e.isPublic))

        return {
            ...result,
            page: eventsFiltered,
        }
    }

    static async getUpcomingStandalone(
        ctx: QMCtxType
    ): Promise<Array<EventWithProgram>> {
        const now = Date.now()

        const events = await ctx.db
            .query("events")
            .withIndex("by_date_number", q => q.gte("dateNumber", now))
            .order("asc")
            .collect()

        const eventsWithRelations = await Promise.all(
            events.map(event => EventManager.assembleRelations(ctx, event))
        )

        const filtered: EventWithProgram[] = []
        for (const event of eventsWithRelations) {
            if (!event || !event.isPublic || !event.programId) continue
            const program = await ctx.db.get(event.programId)
            if (!program) continue
            const programGroup = await ctx.db.get(program.programGroupId)
            if (!programGroup || programGroup.name !== STANDALONE_EVENTS_GROUP_NAME) continue
            filtered.push(event)
        }

        return filtered
    }

    static async getById(
        ctx: QMCtxType,
        id: Id<"events">
    ): Promise<EventWithProgram | null> {
        const manager = new EventManager(id)
        return await manager.getWithRelations(ctx)
    }

    // Helper methods

    private static async getOrCreateStandaloneEventsGroup(
        ctx: MutationCtx
    ): Promise<Id<"programGroups">> {
        // Look for existing standalone events group
        const existingGroups = await ctx.db
            .query("programGroups")
            .collect()

        const standaloneGroup = existingGroups.find(
            g => g.name === STANDALONE_EVENTS_GROUP_NAME
        )

        if (standaloneGroup) {
            return standaloneGroup._id
        }

        // Get the highest order number
        const maxOrder = existingGroups.reduce(
            (max, g) => Math.max(max, g.order),
            -1
        )

        // Create new standalone events group
        return await ctx.db.insert("programGroups", {
            name: STANDALONE_EVENTS_GROUP_NAME,
            description: "Auto-generated group for standalone events",
            order: maxOrder + 1,
            isPublic: false,
        })
    }

    private static async createTicketPrice(ctx: MutationCtx): Promise<Id<"ticketPrice">> {
        return await ctx.db.insert("ticketPrice", {
            options: [],
        })
    }

    static isStandaloneEvent(programGroupName: string | undefined): boolean {
        return programGroupName === STANDALONE_EVENTS_GROUP_NAME
    }
}
