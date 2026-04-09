import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUser, getCurrentUserOrThrow } from "./users"
import { Doc, Id } from "./_generated/dataModel"
import { removeUndefinedFields } from "./utils"
import { paginationOptsValidator } from "convex/server"

export const documentTypeValidator = v.union(
    v.literal("annual_report"),
    v.literal("financial_documents"),
    v.literal("form_990"),
    v.literal("resource"),
    v.literal("other")
)

export type DocumentType = "annual_report" | "financial_documents" | "form_990" | "resource" | "other"

export const documentTypeLabels: Record<DocumentType, string> = {
    annual_report: "Annual Report",
    financial_documents: "Financial Documents",
    form_990: "Form 990",
    resource: "Resource",
    other: "Other",
}

// Generate an upload URL for file storage
export const generateUploadUrl = mutation({
    args: {},
    returns: v.string(),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        return await ctx.storage.generateUploadUrl()
    },
})

// Create a new document
export const createDocument = mutation({
    args: {
        name: v.string(),
        type: documentTypeValidator,
        year: v.number(),
        fileId: v.id("_storage"),
        isPublic: v.boolean(),
    },
    returns: v.id("documents"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const now = Date.now()
        const documentId = await ctx.db.insert("documents", {
            name: args.name,
            type: args.type,
            year: args.year,
            fileId: args.fileId,
            isPublic: args.isPublic,
        })

        return documentId
    },
})

// Update an existing document
export const updateDocument = mutation({
    args: {
        id: v.id("documents"),
        name: v.optional(v.string()),
        type: v.optional(documentTypeValidator),
        year: v.optional(v.number()),
        fileId: v.optional(v.id("_storage")),
        isPublic: v.optional(v.boolean()),
    },
    returns: v.id("documents"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existingDocument = await ctx.db.get(args.id)
        if (!existingDocument) {
            throw new Error("Document not found")
        }

        // If a new file is being uploaded, delete the old one
        if (args.fileId && args.fileId !== existingDocument.fileId) {
            await ctx.storage.delete(existingDocument.fileId)
        }

        const patch: Partial<Doc<"documents">> = removeUndefinedFields({
            name: args.name,
            type: args.type,
            year: args.year,
            fileId: args.fileId,
            isPublic: args.isPublic,
        })

        await ctx.db.patch(args.id, patch)
        return args.id
    },
})

// Toggle isPublic status
export const toggleDocumentPublic = mutation({
    args: {
        id: v.id("documents"),
    },
    returns: v.boolean(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const document = await ctx.db.get(args.id)
        if (!document) {
            throw new Error("Document not found")
        }

        const newIsPublic = !document.isPublic
        await ctx.db.patch(args.id, {
            isPublic: newIsPublic,
        })

        return newIsPublic
    },
})

// Delete a document and its file
export const deleteDocument = mutation({
    args: {
        id: v.id("documents"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const document = await ctx.db.get(args.id)
        if (!document) {
            throw new Error("Document not found")
        }

        // Delete the file from storage
        await ctx.storage.delete(document.fileId)
        // Delete the document record
        await ctx.db.delete(args.id)

        return null
    },
})

// Helper function to resolve document with file URL
const resolveDocument = async (ctx: { storage: { getUrl: (id: Id<"_storage">) => Promise<string | null> } }, document: Doc<"documents">) => {
    const fileUrl = await ctx.storage.getUrl(document.fileId)
    return {
        ...document,
        fileUrl,
    }
}

// Get a single document by ID
export const getDocument = query({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id)
        if (!document) {
            return null
        }

        // If document is not public, require authentication
        if (!document.isPublic) {
            const user = await getCurrentUser(ctx)
            if (!user?.atLeastAuthorized) {
                return null
            }
        }

        return await resolveDocument(ctx, document)
    },
})

// List public documents - anyone can access
export const listPublicDocuments = query({
    args: {
        type: v.optional(documentTypeValidator),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("desc")
            .paginate(args.paginationOpts)
        
        const resolvedDocuments = {
            ...documents,
            page: await Promise.all(documents.page
                .filter((doc) => {
                    if (args.type) {
                        if (doc.type !== args.type) {
                            return false
                        }
                    }
                    return true
                })
                .map(async (doc) => {
                    return await resolveDocument(ctx, doc)
                })
            ),
        }

        return resolvedDocuments
    },
})

// List all public documents of a given type. Not paginated — intended for
// small, bounded sets like financial reports where we need every record.
export const listPublicDocumentsByType = query({
    args: {
        type: documentTypeValidator,
    },
    handler: async (ctx, args) => {
        const docs = await ctx.db
            .query("documents")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect()
        const publicDocs = docs.filter((d) => d.isPublic)
        return await Promise.all(
            publicDocs.map((d) => resolveDocument(ctx, d))
        )
    },
})

// List all documents - only authorized users can access
export const listAllDocuments = query({
    args: {
        type: v.optional(documentTypeValidator),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const documents = await ctx.db
            .query("documents")
            .order("desc")
            .paginate(args.paginationOpts)
        
        const resolvedDocuments = {
            ...documents,
            page: await Promise.all(documents.page
                .filter((doc) => {
                    if (args.type) {
                        if (doc.type !== args.type) {
                            return false
                        }
                    }
                    return true
                })
                .map(async (doc) => {
                    await resolveDocument(ctx, doc)
                })
            ),
        }

        return resolvedDocuments
    },
})

export const searchDocuments = query({
    args: {
        query: v.optional(v.string()),
        type: v.optional(documentTypeValidator),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const dbQuery = await ctx.db.query("documents")
        const fQuery = (args.query && args.type)
            ? dbQuery.withSearchIndex("searchName", (q) => q.search("name", args.query!))
            : args.query
                ? dbQuery.withSearchIndex("searchName", (q) => q.search("name", args.query!))
                : args.type
                    ? dbQuery.withIndex("by_type", (q) => q.eq("type", args.type!))
                    : dbQuery.order("desc")

        const documents = await fQuery.paginate(args.paginationOpts)
        
        const resolvedDocuments = {
            ...documents,
            page: await Promise.all(documents.page
                .filter((doc) => {
                    if (args.type) {
                        if (doc.type !== args.type) {
                            return false
                        }
                    }
                    return true
                })
                .map(async (doc) => {
                    return await resolveDocument(ctx, doc)
                })
            ),
        }

        return resolvedDocuments
    },
})
