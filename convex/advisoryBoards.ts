import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listAdvisoryBoards = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;

        const advisoryBoards = await ctx.db
            .query("advisoryBoards")
            .withIndex("by_order", (q) => q)
            .order("asc")
            .take(limit);

        // Get creator info for each advisory board
        const advisoryBoardsWithDetails = await Promise.all(
            advisoryBoards.map(async (board) => {
                const creator = await ctx.db.get(board.createdBy);

                return {
                    ...board,
                    creator: creator ? {
                        id: creator._id,
                        email: creator.email,
                        name: creator.name ?? creator.email
                    } : null,
                };
            })
        );

        return advisoryBoardsWithDetails;
    },
});

export const getAdvisoryBoard = query({
    args: { id: v.id("advisoryBoards") },
    handler: async (ctx, args) => {
        const board = await ctx.db.get(args.id);
        if (!board) {
            return null;
        }

        const creator = await ctx.db.get(board.createdBy);

        return {
            ...board,
            creator: creator ? {
                id: creator._id,
                email: creator.email,
                name: creator.name ?? creator.email
            } : null,
        };
    },
});

export const getAdvisoryBoardWithPeople = query({
    args: { id: v.id("advisoryBoards") },
    handler: async (ctx, args) => {
        const board = await ctx.db.get(args.id);
        if (!board) {
            return null;
        }

        // Get associated people
        const peopleAdvisoryBoards = await ctx.db
            .query("peopleAdvisoryBoards")
            .withIndex("by_advisory_board", (q) => q.eq("advisoryBoardId", args.id))
            .collect();

        const people = await Promise.all(
            peopleAdvisoryBoards.map(async (pab) => {
                const person = await ctx.db.get(pab.personId);
                if (!person) return null;

                let imageUrl = null;
                if (person.imageId) {
                    const image = await ctx.db.get(person.imageId);
                    if (image) {
                        imageUrl = await ctx.storage.getUrl(image.storageId);
                    }
                }

                return {
                    ...person,
                    imageUrl,
                };
            })
        );

        const creator = await ctx.db.get(board.createdBy);

        return {
            ...board,
            people: people.filter(Boolean),
            creator: creator ? {
                id: creator._id,
                email: creator.email,
                name: creator.name ?? creator.email
            } : null,
        };
    },
});

const hasEditPermission = async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        return false;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
        return false;
    }

    const userRole = user.role || "authorized";
    return userRole === "admin" || userRole === "dev" || userRole === "authorized";
};

export const createAdvisoryBoard = mutation({
    args: {
        name: v.string(),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to create advisory boards");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to create advisory boards");
        }

        // Check if order number is already taken
        const existingBoard = await ctx.db
            .query("advisoryBoards")
            .withIndex("by_order", (q) => q.eq("order", args.order))
            .first();

        if (existingBoard) {
            throw new Error("An advisory board with this order number already exists");
        }

        const now = Date.now();

        const boardId = await ctx.db.insert("advisoryBoards", {
            name: args.name,
            order: args.order,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
        });

        return boardId;
    },
});

export const updateAdvisoryBoard = mutation({
    args: {
        id: v.id("advisoryBoards"),
        name: v.optional(v.string()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update advisory boards");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to update advisory boards");
        }

        const existingBoard = await ctx.db.get(args.id);
        if (!existingBoard) {
            throw new Error("Advisory board not found");
        }

        const updateData: any = {
            updatedAt: Date.now(),
        };

        if (args.name !== undefined) updateData.name = args.name;

        // Handle order update
        if (args.order !== undefined && args.order !== existingBoard.order) {
            // Check if new order number is already taken (excluding current board)
            const existingOrderBoard = await ctx.db
                .query("advisoryBoards")
                .withIndex("by_order", (q) => q.eq("order", args.order!))
                .first();

            if (existingOrderBoard && existingOrderBoard._id !== args.id) {
                throw new Error("An advisory board with this order number already exists");
            }
            updateData.order = args.order;
        }

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const deleteAdvisoryBoard = mutation({
    args: {
        id: v.id("advisoryBoards"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete advisory boards");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to delete advisory boards");
        }

        const board = await ctx.db.get(args.id);
        if (!board) {
            throw new Error("Advisory board not found");
        }

        // Remove people associations
        const associations = await ctx.db
            .query("peopleAdvisoryBoards")
            .withIndex("by_advisory_board", (q) => q.eq("advisoryBoardId", args.id))
            .collect();

        await Promise.all(
            associations.map(async (association) => {
                await ctx.db.delete(association._id);
            })
        );

        // Delete the advisory board
        await ctx.db.delete(args.id);

        return { success: true };
    },
});

export const reorderAdvisoryBoards = mutation({
    args: {
        boards: v.array(v.object({
            id: v.id("advisoryBoards"),
            order: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to reorder advisory boards");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to reorder advisory boards");
        }

        // Update all advisory boards with new order
        await Promise.all(
            args.boards.map(async (board) => {
                await ctx.db.patch(board.id, {
                    order: board.order,
                    updatedAt: Date.now(),
                });
            })
        );

        return { success: true };
    },
});