import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
    ...authTables,
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerified: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerified: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        role: v.optional(v.union(
            v.literal("authorized"),
            v.literal("admin"),
            v.literal("dev")
        )),
    }).index("email", ["email"]),

    articles: defineTable({
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.string(),
        imageUrl: v.optional(v.string()),
        authorId: v.id("users"),
        published: v.boolean(),
        publishedAt: v.optional(v.number()),
    }).index("by_published", ["published"])
        .index("by_author", ["authorId"])
        .index("by_published_date", ["published", "publishedAt"])
        .index("by_slug", ["slug"]),

    donations: defineTable({
        amount: v.number(),
        currency: v.string(),
        donorName: v.string(),
        donorEmail: v.string(),
        donorPhone: v.optional(v.string()),
        isAnonymous: v.boolean(),
        isRecurring: v.boolean(),
        dedicationType: v.optional(v.union(v.literal("honor"), v.literal("memory"))),
        dedicationName: v.optional(v.string()),
        dedicationMessage: v.optional(v.string()),
        paymentMethod: v.string(),
        paymentStatus: v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("completed"),
            v.literal("failed")
        ),
        transactionId: v.optional(v.string()),
        failureReason: v.optional(v.string()),
        createdAt: v.number(),
        completedAt: v.optional(v.number()),
    }).index("by_status", ["paymentStatus"])
        .index("by_created_at", ["createdAt"])
        .index("by_donor_email", ["donorEmail"]),

    events: defineTable({
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.number(),
        endDate: v.number(),
        location: v.optional(v.string()),
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
        maxAttendees: v.optional(v.number()),
        currentAttendees: v.number(),
        price: v.optional(v.number()),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_start_date", ["startDate"])
        .index("by_event_type", ["eventType"])
        .index("by_public", ["isPublic"])
        .index("by_created_by", ["createdBy"])
        .index("by_date_range", ["startDate", "endDate"]),

    images: defineTable({
        fileName: v.string(),
        originalName: v.string(),
        mimeType: v.string(),
        size: v.number(),
        storageId: v.id("_storage"),
        uploadedBy: v.id("users"),
        altText: v.optional(v.string()),
        description: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        isPublic: v.boolean(),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        uploadedAt: v.number(),
    }).index("by_uploaded_by", ["uploadedBy"])
        .index("by_uploaded_at", ["uploadedAt"])
        .index("by_public", ["isPublic"])
        .index("by_tags", ["tags"]),

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

    pages: defineTable({
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.optional(v.string()),
        category: v.union(
            v.literal("about"),
            v.literal("what-we-do"),
            v.literal("learn"),
            v.literal("take-action")
        ),
        imageId: v.optional(v.id("images")),
        isPublished: v.boolean(),
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        lastEditedBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_category", ["category"])
        .index("by_published", ["isPublished"])
        .index("by_slug", ["slug"])
        .index("by_updated_at", ["updatedAt"])
        .index("by_last_edited_by", ["lastEditedBy"])
        .index("by_image", ["imageId"]),

    herds: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_slug", ["slug"])
        .index("by_created_by", ["createdBy"])
        .index("by_created_at", ["createdAt"]),

    animals: defineTable({
        name: v.string(),
        slug: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        herdId: v.id("herds"),
        description: v.string(),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        ambassador: v.boolean(),
        inMemoriam: v.boolean(),
        public: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_slug", ["slug"])
        .index("by_type", ["type"])
        .index("by_herd", ["herdId"])
        .index("by_public", ["public"])
        .index("by_ambassador", ["ambassador"])
        .index("by_in_memoriam", ["inMemoriam"])
        .index("by_created_by", ["createdBy"])
        .index("by_updated_at", ["updatedAt"])
        .index("by_image", ["imageId"]),

    externalArticles: defineTable({
        link: v.string(),
        title: v.string(),
        imageId: v.optional(v.id("images")),
        blurb: v.string(),
        organization: v.string(),
        createdBy: v.id("users"),
        createdAt: v.number(),
    }).index("by_organization", ["organization"])
        .index("by_created_by", ["createdBy"])
        .index("by_created_at", ["createdAt"])
        .index("by_image", ["imageId"]),
});
