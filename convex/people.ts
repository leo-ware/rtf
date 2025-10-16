import { GenericId, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { indexArray } from "./utils";


export const listPeople = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100;

        const people = await ctx.db
            .query("people")
            .order("desc")
            .take(limit)

        const getImages = async (ppl: typeof people) => Promise.all(
            people.map(async (person) => {
                const imageRes = person.imageId ? await ctx.db.get(person.imageId) : null;
                const imageUrl = imageRes ? await ctx.storage.getUrl(imageRes.storageId) : null;
                return {
                    ...imageRes,
                    imageUrl,
                }
            })
        )

        const getBoards = async (ppl: typeof people) => {
            const peopleAdvisoryBoardsPromise = ctx.db
                .query("peopleAdvisoryBoards")
                .take(500)

            const boardsPromise = ctx.db
                .query("advisoryBoards")
                .order("desc")
                .take(100)
                .then(boards => boards.sort((a, b) => a.order - b.order))

            const [peopleAdvisoryBoards, boards] = await Promise.all([peopleAdvisoryBoardsPromise, boardsPromise])

            const peopleAdvisoryBoardsMap = indexArray(peopleAdvisoryBoards, pab => pab.personId)
            const boardsMap = indexArray(boards, board => board._id)

            const boardsForPeople = people.map(person => {
                const pabs = peopleAdvisoryBoardsMap.get(person._id) || []
                const boards = pabs
                    .map(pab => boardsMap.get(pab.advisoryBoardId) || [])
                    .flat()
                    .filter(x => !!x)
                return boards
            })

            return boardsForPeople
        }

        const [imagesForPeople, boardForPeople] = await Promise.all([getImages(people), getBoards(people)])

        return people.map((person, i) => {
            const image = imagesForPeople[i]
            const boards = boardForPeople[i]
            return {
                ...person,
                image,
                boards,
            }
        })
    },
});

export const getPerson = query({
    args: { id: v.id("people") },
    handler: async (ctx, args) => {
        const person = await ctx.db.get(args.id);
        if (!person) {
            return null;
        }

        const creator = await ctx.db.get(person.createdBy);
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
            creator: creator ? {
                id: creator._id,
                email: creator.email,
                name: creator.name ?? creator.email
            } : null,
        };
    },
});

export const getPersonWithAdvisoryBoards = query({
    args: { id: v.id("people") },
    handler: async (ctx, args) => {
        const person = await ctx.db.get(args.id);
        if (!person) {
            return null;
        }

        // Get associated advisory boards
        const personAdvisoryBoards = await ctx.db
            .query("peopleAdvisoryBoards")
            .withIndex("by_person", (q) => q.eq("personId", args.id))
            .collect();

        const advisoryBoards = await Promise.all(
            personAdvisoryBoards.map(async (pab) => {
                return await ctx.db.get(pab.advisoryBoardId);
            })
        );

        const creator = await ctx.db.get(person.createdBy);
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
            advisoryBoards: advisoryBoards.filter(Boolean),
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

export const createPerson = mutation({
    args: {
        name: v.string(),
        title: v.string(),
        bio: v.string(),
        imageId: v.optional(v.id("images")),
        isDirector: v.boolean(),
        isStaff: v.boolean(),
        isEquine: v.boolean(),
        isStoryTeller: v.boolean(),
        isAmbassador: v.boolean(),
        inMemoriam: v.boolean(),
        advisoryBoardIds: v.optional(v.array(v.id("advisoryBoards"))),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to create people");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to create people");
        }

        const now = Date.now();

        const personId = await ctx.db.insert("people", {
            name: args.name,
            title: args.title,
            bio: args.bio,
            imageId: args.imageId,
            isDirector: args.isDirector,
            isStaff: args.isStaff ?? false,
            isEquine: args.isEquine ?? false,
            isStoryTeller: args.isStoryTeller ?? false,
            isAmbassador: args.isAmbassador ?? false,
            inMemoriam: args.inMemoriam,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
        });

        // Add advisory board associations if provided
        if (args.advisoryBoardIds && args.advisoryBoardIds.length > 0) {
            await Promise.all(
                args.advisoryBoardIds.map(async (boardId) => {
                    await ctx.db.insert("peopleAdvisoryBoards", {
                        personId,
                        advisoryBoardId: boardId,
                        createdBy: userId,
                        createdAt: now,
                    });
                })
            );
        }

        return personId;
    },
});

export const updatePerson = mutation({
    args: {
        id: v.id("people"),
        name: v.optional(v.string()),
        title: v.optional(v.string()),
        bio: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        isDirector: v.optional(v.boolean()),
        isStaff: v.optional(v.boolean()),
        isEquine: v.optional(v.boolean()),
        isStoryTeller: v.optional(v.boolean()),
        isAmbassador: v.optional(v.boolean()),
        inMemoriam: v.optional(v.boolean()),
        advisoryBoardIds: v.optional(v.array(v.id("advisoryBoards"))),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update people");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to update people");
        }

        const existingPerson = await ctx.db.get(args.id);
        if (!existingPerson) {
            throw new Error("Person not found");
        }

        const updateData: any = {
            updatedAt: Date.now(),
        };

        if (args.name !== undefined) updateData.name = args.name;
        if (args.title !== undefined) updateData.title = args.title;
        if (args.bio !== undefined) updateData.bio = args.bio;
        if (args.imageId !== undefined) updateData.imageId = args.imageId;
        if (args.isDirector !== undefined) updateData.isDirector = args.isDirector;
        if (args.isStaff !== undefined) updateData.isStaff = args.isStaff;
        if (args.isEquine !== undefined) updateData.isEquine = args.isEquine;
        if (args.isStoryTeller !== undefined) updateData.isStoryTeller = args.isStoryTeller;
        if (args.isAmbassador !== undefined) updateData.isAmbassador = args.isAmbassador;
        if (args.inMemoriam !== undefined) updateData.inMemoriam = args.inMemoriam;

        await ctx.db.patch(args.id, updateData);

        // Update advisory board associations if provided
        if (args.advisoryBoardIds !== undefined) {
            // Remove existing associations
            const existingAssociations = await ctx.db
                .query("peopleAdvisoryBoards")
                .withIndex("by_person", (q) => q.eq("personId", args.id))
                .collect();

            await Promise.all(
                existingAssociations.map(async (association) => {
                    await ctx.db.delete(association._id);
                })
            );

            // Add new associations
            if (args.advisoryBoardIds.length > 0) {
                await Promise.all(
                    args.advisoryBoardIds.map(async (boardId) => {
                        await ctx.db.insert("peopleAdvisoryBoards", {
                            personId: args.id,
                            advisoryBoardId: boardId,
                            createdBy: userId,
                            createdAt: Date.now(),
                        });
                    })
                );
            }
        }

        return args.id;
    },
});

export const deletePerson = mutation({
    args: {
        id: v.id("people"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete people");
        }

        if (!(await hasEditPermission(ctx))) {
            throw new Error("Insufficient permissions to delete people");
        }

        const person = await ctx.db.get(args.id);
        if (!person) {
            throw new Error("Person not found");
        }

        // Remove advisory board associations
        const associations = await ctx.db
            .query("peopleAdvisoryBoards")
            .withIndex("by_person", (q) => q.eq("personId", args.id))
            .collect();

        await Promise.all(
            associations.map(async (association) => {
                await ctx.db.delete(association._id);
            })
        );

        // Delete the person
        await ctx.db.delete(args.id);

        return { success: true };
    },
});

export const listPeopleByAdvisoryBoard = query({
    args: {
        advisoryBoardId: v.id("advisoryBoards"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;

        // Get people associated with the advisory board
        const peopleAdvisoryBoards = await ctx.db
            .query("peopleAdvisoryBoards")
            .withIndex("by_advisory_board", (q) => q.eq("advisoryBoardId", args.advisoryBoardId))
            .take(limit);

        const people = await Promise.all(
            peopleAdvisoryBoards.map(async (pab) => {
                const person = await ctx.db.get(pab.personId);
                if (!person) return null;

                const creator = await ctx.db.get(person.createdBy);
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
                    creator: creator ? {
                        id: creator._id,
                        email: creator.email,
                        name: creator.name ?? creator.email
                    } : null,
                };
            })
        );

        return people.filter(Boolean);
    },
});