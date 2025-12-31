import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const ConvexValueRole = v.union(
    v.literal("guest"),
    v.literal("authorized"),
    v.literal("admin"),
    v.literal("dev")
)

export type RoleType = "guest" | "authorized" | "admin" | "dev"

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
    ...authTables,
    users: defineTable({
        name: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        externalId: v.string(),
        email: v.array(v.string()),
        role: ConvexValueRole,
    })
        .index("email", ["email"])
        .index("externalId", ["externalId"]),

    userInvites: defineTable({
        email: v.string(),
        role: ConvexValueRole,
        externalId: v.string(),
    })
        .index("email", ["email"]),

    // Emails that are allowed to create accounts but have not yet
    approvedUserEmails: defineTable({
        name: v.optional(v.string()),
        email: v.string(),
        role: v.union(
            v.literal("authorized"),
            v.literal("admin"),
            v.literal("dev")
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("email", ["email"]),

    articleMetadata: defineTable({
        date: v.number(),
        public: v.boolean(),
        imageId: v.id("images"),

        title: v.string(),
        excerpt: v.string(),
        herdIds: v.array(v.id("herds")),
        animalIds: v.array(v.id("animals")),
        searchText: v.string(),

        topic_homepage: v.optional(v.boolean()),
        topic_conservation: v.optional(v.boolean()),
        topic_sanctuary: v.optional(v.boolean()),
        topic_advocacy: v.optional(v.boolean()),
        topic_education: v.optional(v.boolean()),
        topic_herd_management: v.optional(v.boolean()),
        topic_population_management: v.optional(v.boolean()),
        topic_roundups: v.optional(v.boolean()),
        topic_horse_slaughter: v.optional(v.boolean()),
        topic_spirit: v.optional(v.boolean()),

        articleId: v.optional(v.id("articles")),
        externalArticleId: v.optional(v.id("externalArticles")),
        isExternal: v.boolean(),
    })
        .searchIndex(
            "searchText", {
            searchField: "searchText",
            filterFields: [
                "isExternal",
                "date",
                "topic_homepage",
                "topic_conservation",
                "topic_sanctuary",
                "topic_advocacy",
                "topic_education",
                "topic_herd_management",
                "topic_population_management",
                "topic_roundups",
                "topic_horse_slaughter",
                "topic_spirit",
            ]
        },
        )
        .index("topic_filter", [
            // "date",
            "isExternal",
            "topic_homepage",
            "topic_conservation",
            "topic_sanctuary",
            "topic_advocacy",
            "topic_education",
            "topic_herd_management",
            "topic_population_management",
            "topic_roundups",
            "topic_horse_slaughter",
            "topic_spirit",
        ]),

    articles: defineTable({
        slug: v.string(),
        content: v.string(),
        authorCredit: v.optional(v.string()),
        articleMetadataId: v.id("articleMetadata"),
        imageId: v.id("images"),
    })
        .index("by_slug", ["slug"])
    ,

    externalArticles: defineTable({
        link: v.string(),
        title: v.string(),
        imageId: v.optional(v.id("images")),
        blurb: v.string(),
        organization: v.string(),
        articleMetadataId: v.id("articleMetadata"),
    })
        .index("by_organization", ["organization"])
        .index("by_image", ["imageId"]),

    programGroups: defineTable({
        name: v.string(),
        description: v.string(),
        imageId: v.optional(v.id("images")),
        order: v.number(),
        isPublic: v.boolean(),
    })
        .index("by_order", ["order"])
        .index("by_public", ["isPublic"])
    ,

    programs: defineTable({
        name: v.string(),
        description: v.string(),
        details: v.string(),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        location: v.string(),
        maxAttendees: v.optional(v.number()),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
    })
        .index("by_program_group", ["programGroupId"])
        .index("by_order", ["order"])
        .index("by_public", ["isPublic"])
    ,

    events: defineTable({
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        dateNumber: v.number(),
        startDate: v.string(),
        endDate: v.string(),
        location: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        programId: v.optional(v.id("programs")),
    })
        .index("by_public", ["isPublic"])
        .index("by_program", ["programId"])
        .index("by_date_number", ["dateNumber"])
    ,

    ticketPrice: defineTable({
        options: v.array(v.object({
            name: v.string(),
            description: v.optional(v.string()),
            price: v.number(),
            availableBefore: v.optional(v.number()),
            availableAfter: v.optional(v.number()),
        })),
    }),

    rsvp: defineTable({
        eventId: v.id("events"),
        email: v.string(),
        name: v.string(),
        tickets: v.array(v.object({
            name: v.string(),
            description: v.optional(v.string()),
            price: v.number(),
        })),
        additionalDonation: v.optional(v.number()),
        discountCode: v.optional(v.id("discountCodes")),
        priceBeforeDiscount: v.number(),
        finalPrice: v.number(),
    })
        .index("by_event", ["eventId"])
        .index("by_email", ["email"])
    ,

    discountCodes: defineTable({
        code: v.string(),
        description: v.optional(v.string()),
        revoked: v.boolean(),
        discountType: v.union(
            v.literal("percentage"),
            v.literal("fixed"),
            v.literal("free"),
            v.literal("tickets")
        ),
        discountQuantity: v.optional(v.number()),
        programLock: v.optional(v.id("programs")),
        eventLock: v.optional(v.id("events")),
    })
        .index("by_code", ["code"])
    ,

    images: defineTable({
        fileName: v.string(),
        originalName: v.string(),
        title: v.string(),
        mimeType: v.string(),
        size: v.number(),
        storageId: v.id("_storage"),
        altText: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
    })
        .searchIndex("searchTitle", {
            searchField: "title"
        }),

    contactMessages: defineTable({
            name: v.string(),
            email: v.string(),
            phone: v.optional(v.string()),
            subject: v.string(),
            message: v.string(),
            status: v.union(
                v.literal("new"),
                v.literal("read"),
                v.literal("replied"),
                v.literal("archived")
            ),
            priority: v.union(
                v.literal("low"),
                v.literal("normal"),
                v.literal("high"),
                v.literal("urgent")
            ),
            source: v.optional(v.string()),
            ipAddress: v.optional(v.string()),
            userAgent: v.optional(v.string()),
            createdAt: v.number(),
            readAt: v.optional(v.number()),
            repliedAt: v.optional(v.number()),
        }).index("by_status", ["status"])
        .index("by_created_at", ["createdAt"])
        .index("by_email", ["email"])
        .index("by_priority", ["priority"]),

    newsletterSubscribers: defineTable({
        email: v.string(),
        name: v.optional(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("unsubscribed"),
            v.literal("bounced")
        ),
        source: v.optional(v.string()),
        interests: v.optional(v.array(v.string())),
        confirmationToken: v.optional(v.string()),
        unsubscribeToken: v.optional(v.string()),
        subscribedAt: v.number(),
        confirmedAt: v.optional(v.number()),
        unsubscribedAt: v.optional(v.number()),
        lastEmailSent: v.optional(v.number()),
        ipAddress: v.optional(v.string()),
    }).index("by_email", ["email"])
        .index("by_status", ["status"])
        .index("by_subscribed_at", ["subscribedAt"])
        .index("by_confirmation_token", ["confirmationToken"])
        .index("by_unsubscribe_token", ["unsubscribeToken"]),

    timelineItem: defineTable({
        order: v.number(),
        date: v.string(),
        title: v.string(),
        description: v.string(),
        imageId: v.optional(v.id("images")),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    herds: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        timeline: v.optional(v.array(v.id("timelineItem"))),
        createdAt: v.number(),
        updatedAt: v.number(),
        content: v.optional(v.string()),
        donateForm: v.optional(v.string()),

        articleMetadataIds: v.optional(v.array(v.id("articleMetadata"))),
    }).index("by_slug", ["slug"]),

    animals: defineTable({
        name: v.string(),
        slug: v.string(),
        imageId: v.id("images"),
        type: v.union(v.literal("horse"), v.literal("burro")),
        description: v.string(),

        herdId: v.optional(v.id("herds")),
        content: v.optional(v.string()),
        gallery: v.optional(v.array(v.id("images"))),
        gender: v.optional(v.string()),
        dob: v.optional(v.number()),
        sanctuary: v.optional(v.string()),
        inMemoriam: v.optional(v.boolean()),
        createdAt: v.number(),
        updatedAt: v.number(),
        donateForm: v.optional(v.string()),
        
        articleMetadataIds: v.optional(v.array(v.id("articleMetadata"))),
    }).index("by_slug", ["slug"])
        .index("by_type", ["type"])
        .index("by_herd", ["herdId"])
        .index("by_in_memoriam", ["inMemoriam"])
        .index("by_updated_at", ["updatedAt"])
        .index("by_image", ["imageId"]),

    people: defineTable({
        name: v.string(),
        title: v.string(),
        bio: v.string(),
        imageId: v.optional(v.id("images")),
        isDirector: v.boolean(),
        isStaff: v.optional(v.boolean()),
        isEquine: v.optional(v.boolean()),
        isStoryTeller: v.optional(v.boolean()),
        isAmbassador: v.optional(v.boolean()),
        inMemoriam: v.boolean(),
        directorOrder: v.optional(v.number()),
        staffOrder: v.optional(v.number()),
        equineOrder: v.optional(v.number()),
        storytellerOrder: v.optional(v.number()),
        ambassadorOrder: v.optional(v.number()),
        inMemoriamOrder: v.optional(v.number()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_created_by", ["createdBy"])
        .index("by_created_at", ["createdAt"])
        .index("by_updated_at", ["updatedAt"])
        .index("by_image", ["imageId"])
        .index("by_is_director", ["isDirector"])
        .index("by_is_staff", ["isStaff"])
        .index("by_in_memoriam", ["inMemoriam"])
        .index("by_director_order", ["directorOrder"])
        .index("by_staff_order", ["staffOrder"])
        .index("by_equine_order", ["equineOrder"])
        .index("by_storyteller_order", ["storytellerOrder"])
        .index("by_ambassador_order", ["ambassadorOrder"])
        .index("by_in_memoriam_order", ["inMemoriamOrder"]),

    advisoryBoards: defineTable({
        name: v.string(),
        order: v.number(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_order", ["order"])
        .index("by_created_by", ["createdBy"])
        .index("by_created_at", ["createdAt"])
        .index("by_updated_at", ["updatedAt"]),

    peopleAdvisoryBoards: defineTable({
        personId: v.id("people"),
        advisoryBoardId: v.id("advisoryBoards"),
        createdBy: v.id("users"),
        createdAt: v.number(),
    }).index("by_person", ["personId"])
        .index("by_advisory_board", ["advisoryBoardId"])
        .index("by_created_by", ["createdBy"])
        .index("by_created_at", ["createdAt"])
        .index("by_person_and_board", ["personId", "advisoryBoardId"]),
    
    sponsors: defineTable({
        name: v.string(),
        imageId: v.optional(v.id("images")),
    }),

    documents: defineTable({
        name: v.string(),
        type: v.union(
            v.literal("annual_report"),
            v.literal("financial_documents"),
            v.literal("form_990"),
            v.literal("other")
        ),
        year: v.number(),
        fileId: v.id("_storage"),
        isPublic: v.boolean(),
    })
        .index("by_type", ["type"])
        .index("by_public", ["isPublic"])
        .index("by_year", ["year"])
        .searchIndex("searchName", {
            searchField: "name",
            filterFields: [
                "type",
                "isPublic",
                "year",
            ]
        }),
})
