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

    donationForms: defineTable({
        name: v.string(),
        notes: v.optional(v.string()),
        formId: v.string(),
        formTemplateId: v.string(),
        updatedAt: v.number(),
    }).searchIndex("searchName", {
        searchField: "name",
    }),

    donatePathways: defineTable({
        name: v.string(),
        imageId: v.id("images"),
        order: v.number(),
        // Mutually exclusive: exactly one must be set
        link: v.optional(v.string()),
        donationFormId: v.optional(v.id("donationForms")),
        showInDialog: v.optional(v.boolean()),
    })
        .index("by_order", ["order"]),

    tags: defineTable({
        name: v.string(),
        slug: v.string(),
        articleMetadataIds: v.optional(v.array(v.id("articleMetadata"))),
    }).index("by_slug", ["slug"]),

    takeActionArticle: defineTable({
        title: v.string(),
        slug: v.string(),
        imageId: v.optional(v.id("images")),
        description: v.string(),
        content: v.string(),
        isPublic: v.boolean(),

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
    })
        .index("by_isPublic", ["isPublic"])
        .index("by_image", ["imageId"])
        .index("by_slug", ["slug"]),

    educationArticles: defineTable({
        title: v.string(),
        slug: v.optional(v.string()),
        description: v.string(),
        content: v.string(),
        isPublic: v.boolean(),
        documentId: v.optional(v.id("documents")),
    })
        .index("by_is_public", ["isPublic"])
        .index("by_slug", ["slug"])
        .searchIndex("searchTitle", { searchField: "title", filterFields: ["isPublic"] }),

    educationArticleGroups: defineTable({
        title: v.string(),
        articleIds: v.array(v.id("educationArticles")),
    }),

    educationArticleSuperGroups: defineTable({
        title: v.string(),
        groupIds: v.array(v.id("educationArticleGroups")),
        order: v.optional(v.number()),
    }),

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
        tags: v.optional(v.array(v.id("tags"))),
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
                "public",
                "tags",
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
        ])
        .index("by_public_date", ["public", "date"]),

    articles: defineTable({
        slug: v.string(),
        content: v.string(),
        authorCredit: v.optional(v.string()),
        authors: v.optional(v.array(v.id("people"))),
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

    locations: defineTable({
        name: v.string(),
        address: v.optional(v.string()),
        notes: v.optional(v.string()),
        mapsUrl: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
    }).searchIndex("searchName", {
        searchField: "name",
    }),

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
        programGroupId: v.id("programGroups"),
        order: v.number(),
        name: v.string(),
        description: v.string(),
        details: v.string(), // html string

        ticketPriceId: v.optional(v.id("ticketPrice")),
        ticketPriceText: v.optional(v.string()),
        locationId: v.id("locations"),

        maxAttendees: v.optional(v.number()),
        requiresRegistration: v.optional(v.boolean()),

        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),

        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        gallery: v.optional(v.array(v.id("galleryItems"))),
    })
        .index("by_program_group", ["programGroupId"])
        .index("by_order", ["order"])
        .index("by_public", ["isPublic"])
    ,

    events: defineTable({
        title: v.string(),
        programId: v.optional(v.id("programs")),
        dateNumber: v.number(),
        startDate: v.string(),
        endDate: v.string(),
        registrationLink: v.optional(v.string()),
        status: v.optional(v.union(v.literal("scheduled"), v.literal("cancelled"), v.literal("sold_out"))),
    })
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
        authorCredit: v.optional(v.string()),
        authors: v.optional(v.array(v.id("people"))),
        searchText: v.optional(v.string()),
    })
        .searchIndex("searchTitle", {
            searchField: "searchText"
        }),

    contactMessages: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        organization: v.optional(v.string()),

        topic: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
        searchText: v.string(),

        emailOutboxId: v.optional(v.id("emailOutbox")),
        status: v.union(
            v.literal("new"),
            v.literal("read"),
            v.literal("replied"),
            v.literal("archived")
        ),

        readAt: v.optional(v.number()),
        repliedAt: v.optional(v.number()),
    })
        .index("by_status", ["status"])
        .index("by_email", ["email"])
        .index("by_email_outbox", ["emailOutboxId"])
        .searchIndex("searchText", {
            searchField: "searchText",
            filterFields: [
                "topic",
                "status"
            ]
        }),

    emailOutbox: defineTable({
        userName: v.optional(v.string()),
        userEmail: v.string(),
        internalEmail: v.string(),

        topic: v.optional(v.string()),
        subject: v.string(),
        body: v.string(),
        searchText: v.string(),

        pendingTimestamp: v.optional(v.number()),
        sentTimestamp: v.optional(v.number()),
        failedTimestamp: v.optional(v.number()),

        status: v.union(
            v.literal("queued"),
            v.literal("pending"),
            v.literal("sent"),
            v.literal("failed")
        ),
    })
        .index("by_status", ["status"])
        .index("by_pending_timestamp", ["pendingTimestamp"])
        .index("by_sent_timestamp", ["sentTimestamp"])
        .index("by_failed_timestamp", ["failedTimestamp"])
        .index("by_user_email", ["userEmail"])
        .searchIndex("searchText", {
            searchField: "searchText",
            filterFields: [
                "topic",
                "status"
            ]
        }),

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

    learnTimelines: defineTable({
        title: v.string(),
        slug: v.string(),
        isPublic: v.boolean(),
        order: v.number(),
    })
        .index("by_order", ["order"])
        .index("by_isPublic", ["isPublic"])
        .index("by_slug", ["slug"]),

    learnTimelineItems: defineTable({
        timelineId: v.id("learnTimelines"),
        order: v.number(),
        date: v.string(),
        title: v.string(),
        content: v.string(),
        imageId: v.optional(v.id("images")),
    })
        .index("by_timelineId", ["timelineId"])
        .index("by_timelineId_and_order", ["timelineId", "order"]),

    jobListings: defineTable({
        name: v.string(),
        description: v.string(),
        applicationDeadline: v.number(),
        applicationFormLink: v.string(),
        order: v.number(),
    }).index("by_application_deadline", ["applicationDeadline"]),

    herds: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        timeline: v.optional(v.array(v.id("timelineItem"))),
        createdAt: v.number(),
        updatedAt: v.number(),
        content: v.optional(v.string()),
        donationFormId: v.optional(v.id("donationForms")),

        articleMetadataIds: v.optional(v.array(v.id("articleMetadata"))),
    }).index("by_slug", ["slug"]),

    galleryItems: defineTable({
        type: v.union(v.literal("image"), v.literal("video")),
        // For images
        imageId: v.optional(v.id("images")),
        // For videos
        videoSource: v.optional(v.union(v.literal("youtube"), v.literal("vimeo"))),
        videoId: v.optional(v.string()),
        videoTitle: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
    }),

    animals: defineTable({
        name: v.string(),
        slug: v.string(),
        imageId: v.id("images"),
        type: v.union(v.literal("horse"), v.literal("burro")),
        description: v.string(),

        herdId: v.optional(v.id("herds")),
        content: v.optional(v.string()),
        gallery: v.optional(v.array(v.id("galleryItems"))),
        gender: v.optional(v.string()),
        dob: v.optional(v.number()),
        sanctuary: v.optional(v.string()),
        inMemoriam: v.optional(v.boolean()),
        promoted: v.optional(v.boolean()),
        adoptable: v.optional(v.boolean()),
        adoptionFee: v.optional(v.string()),

        donationFormId: v.optional(v.id("donationForms")),

        articleMetadataIds: v.optional(v.array(v.id("articleMetadata"))),
    })
        .index("by_slug", ["slug"])
        .index("by_type", ["type"])
        .index("by_herd", ["herdId"])
        .index("by_in_memoriam", ["inMemoriam"])
        .index("by_adoptable", ["adoptable"])
        .index("by_image", ["imageId"]),

    people: defineTable({
        name: v.string(),
        title: v.optional(v.string()),
        bio: v.optional(v.string()),
        imageId: v.optional(v.id("images")),

        isDirector: v.optional(v.boolean()),
        isStaff: v.optional(v.boolean()),
        isEquine: v.optional(v.boolean()),
        isStoryTeller: v.optional(v.boolean()),
        isAmbassador: v.optional(v.boolean()),
        isPhotographer: v.optional(v.boolean()),
        inMemoriam: v.optional(v.boolean()),

        link: v.optional(v.string()),

        directorOrder: v.optional(v.number()),
        staffOrder: v.optional(v.number()),
        equineOrder: v.optional(v.number()),
        storytellerOrder: v.optional(v.number()),
        ambassadorOrder: v.optional(v.number()),
        photographerOrder: v.optional(v.number()),
        inMemoriamOrder: v.optional(v.number()),
    })
        .index("by_image", ["imageId"])
        .index("by_is_director", ["isDirector"])
        .index("by_is_staff", ["isStaff"])
        .index("by_in_memoriam", ["inMemoriam"])
        .index("by_director_order", ["directorOrder"])
        .index("by_staff_order", ["staffOrder"])
        .index("by_equine_order", ["equineOrder"])
        .index("by_storyteller_order", ["storytellerOrder"])
        .index("by_ambassador_order", ["ambassadorOrder"])
        .index("by_is_photographer", ["isPhotographer"])
        .index("by_photographer_order", ["photographerOrder"])
        .index("by_in_memoriam_order", ["inMemoriamOrder"])
        .searchIndex("searchName", {
            searchField: "name",
        }),

    advisoryBoards: defineTable({
        name: v.string(),
        order: v.number(),
    })
        .index("by_order", ["order"]),

    peopleAdvisoryBoards: defineTable({
        personId: v.id("people"),
        advisoryBoardId: v.id("advisoryBoards"),
        order: v.number(),
    })
        .index("by_person", ["personId"])
        .index("by_advisory_board", ["advisoryBoardId"])
        .index("by_person_and_board", ["personId", "advisoryBoardId"]),

    sponsors: defineTable({
        name: v.string(),
        imageId: v.optional(v.id("images")),
    }),

    wishlistCategories: defineTable({
        name: v.string(),
        order: v.number(),
    }).index("by_order", ["order"]),

    wishlistItems: defineTable({
        name: v.string(),
        category: v.string(),
        order: v.number(),
        link: v.optional(v.string()),
    }).index("by_category", ["category", "order"]),

    documents: defineTable({
        name: v.string(),
        type: v.union(
            v.literal("annual_report"),
            v.literal("financial_documents"),
            v.literal("form_990"),
            v.literal("resource"),
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
