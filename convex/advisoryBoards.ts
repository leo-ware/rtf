import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getCurrentUserOrThrow } from "./users";
import { resolveImageId } from "./images";

export const listAdvisoryBoards = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100;

        const advisoryBoards = await ctx.db
            .query("advisoryBoards")
            .withIndex("by_order", (q) => q)
            .order("asc")
            .take(limit);

        return advisoryBoards;
    },
});

export const getAdvisoryBoard = query({
    args: { id: v.id("advisoryBoards") },
    handler: async (ctx, args) => {
        const board = await ctx.db.get(args.id);
        return board
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

                return {
                    ...pab,
                    person: {
                        ...person,
                        image: person.imageId
                            ? await resolveImageId(ctx, person.imageId)
                            : null,
                    }
                };
            })
        );

        return {
            ...board,
            peopleAdvisoryBoards: people.filter(x => !!x),
        };
    },
});

export const createAdvisoryBoard = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions to create advisory boards");
        }

        // Get the highest order number and add 1
        const allBoards = await ctx.db
            .query("advisoryBoards")
            .withIndex("by_order", (q) => q)
            .order("desc")
            .take(1);

        const nextOrder = allBoards.length > 0 ? allBoards[0].order + 1 : 0;

        const boardId = await ctx.db.insert("advisoryBoards", {
            name: args.name,
            order: nextOrder,
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
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions to create advisory boards");
        }

        const existingBoard = await ctx.db.get(args.id);
        if (!existingBoard) {
            throw new Error("Advisory board not found");
        }

        const updateData: any = {};

        if (args.name !== undefined) updateData.name = args.name;
        if (args.order !== undefined) updateData.order = args.order;

        await ctx.db.patch(args.id, updateData);

        return args.id;
    },
});

export const updatePeopleAdvisoryBoards = mutation({
    args: {
        id: v.id("advisoryBoards"),
        people: v.array(v.id("people")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const existingBoard = await ctx.db.get(args.id);
        if (!existingBoard) {
            throw new Error("Advisory board not found");
        }

        const newPabList = args.people
            .map((personId, index) => ({ personId, order: index }))

        const previousPabList = (await ctx.db.query("peopleAdvisoryBoards")
            .withIndex("by_advisory_board", (q) => q.eq("advisoryBoardId", args.id))
            .collect())
            .sort((a, b) => a.order - b.order)
        
        const pabListToDelete = previousPabList
            .filter(pab => !newPabList.some(newPab => newPab.personId === pab.personId))
        
        const pabListToUpdate = previousPabList
            .map(pab => {
                const newPab = newPabList.find(newPab => newPab.personId === pab.personId)
                if (newPab) {
                    return {...pab, order: newPab.order}
                }
                return null;
            })
            .filter(x => !!x)
        
        const pabListToCreate = newPabList
            .filter(pab => !previousPabList.some(prevPab => prevPab.personId === pab.personId))
        
        await Promise.all([
            ...pabListToDelete.map(async (pab) => await ctx.db.delete(pab._id)),
            ...pabListToUpdate.map(async (pab) => await ctx.db.patch(pab._id, { order: pab.order })),
            ...pabListToCreate.map(async (pab) => await ctx.db.insert("peopleAdvisoryBoards", {
                personId: pab.personId,
                advisoryBoardId: args.id,
                order: pab.order,
            })),
        ])
    }
})

export const deleteAdvisoryBoard = mutation({
    args: {
        id: v.id("advisoryBoards"),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions to create advisory boards");
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
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions to create advisory boards");
        }

        // Update all advisory boards with new order
        await Promise.all(
            args.boards.map(async (board) => {
                await ctx.db.patch(board.id, {
                    order: board.order,
                });
            })
        );

        return { success: true };
    },
});