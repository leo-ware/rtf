import { v } from "convex/values"
import { paginationOptsValidator } from "convex/server"
import { query, mutation } from "./_generated/server"
import { indexArray } from "./utils"
import { getCurrentUserOrThrow } from "./users"
import { peopleAggregate } from "./aggregates"
import { resolveImageId } from "./images"
import { Doc, Id } from "./_generated/dataModel"

export const searchPeopleLight = query({
    args: {
        query: v.string(),
    },
    handler: async (ctx, args) => {
        let people
        if (!args.query.trim()) {
            people = await ctx.db
                .query("people")
                .take(20)
        } else {
            people = await ctx.db
                .query("people")
                .withSearchIndex("searchName", (q) => q.search("name", args.query))
                .take(20)
        }
        return people.map(p => ({ _id: p._id, name: p.name }))
    },
})

export const searchPeoplePaginated = query({
    args: {
        query: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        if (!args.query.trim()) {
            const results = await ctx.db
                .query("people")
                .order("desc")
                .paginate(args.paginationOpts)
            return {
                ...results,
                page: results.page.map(p => ({ _id: p._id, name: p.name })),
            }
        }
        const results = await ctx.db
            .query("people")
            .withSearchIndex("searchName", (q) => q.search("name", args.query))
            .paginate(args.paginationOpts)
        return {
            ...results,
            page: results.page.map(p => ({ _id: p._id, name: p.name })),
        }
    },
})

export const searchPeople = query({
    args: {
        query: v.string(),
    },
    handler: async (ctx, args) => {
        if (!args.query.trim()) {
            return await ctx.db
                .query("people")
                .take(100);
        }

        return await ctx.db
            .query("people")
            .withSearchIndex("searchName", (q) => q.search("name", args.query))
            .take(100);
    },
});

export const listPeople = query({
    args: {
        limit: v.optional(v.number()),
        personType: v.optional(v.union(
            v.literal("director"),
            v.literal("staff"),
            v.literal("equine"),
            v.literal("storyteller"),
            v.literal("ambassador"),
            v.literal("photographer"),
            v.literal("inMemoriam")
        )),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100;

        let people;

        if (args.personType) {
            // Query based on person type and order
            switch (args.personType) {
                case "director":
                    people = await ctx.db
                        .query("people")
                        .withIndex("by_is_director", (q) => q.eq("isDirector", true))
                        .collect()
                        .then(p => p.sort((a, b) => (a.directorOrder ?? Infinity) - (b.directorOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
                case "staff":
                    people = await ctx.db
                        .query("people")
                        .withIndex("by_is_staff", (q) => q.eq("isStaff", true))
                        .collect()
                        .then(p => p.sort((a, b) => (a.staffOrder ?? Infinity) - (b.staffOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
                case "equine":
                    people = await ctx.db
                        .query("people")
                        .collect()
                        .then(p => p.filter(person => person.isEquine))
                        .then(p => p.sort((a, b) => (a.equineOrder ?? Infinity) - (b.equineOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
                case "storyteller":
                    people = await ctx.db
                        .query("people")
                        .collect()
                        .then(p => p.filter(person => person.isStoryTeller))
                        .then(p => p.sort((a, b) => (a.storytellerOrder ?? Infinity) - (b.storytellerOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
                case "ambassador":
                    people = await ctx.db
                        .query("people")
                        .collect()
                        .then(p => p.filter(person => person.isAmbassador))
                        .then(p => p.sort((a, b) => (a.ambassadorOrder ?? Infinity) - (b.ambassadorOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
                case "photographer":
                    people = await ctx.db
                        .query("people")
                        .withIndex("by_is_photographer", (q) => q.eq("isPhotographer", true))
                        .collect()
                        .then(p => p.sort((a, b) => (a.photographerOrder ?? Infinity) - (b.photographerOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
                case "inMemoriam":
                    people = await ctx.db
                        .query("people")
                        .withIndex("by_in_memoriam", (q) => q.eq("inMemoriam", true))
                        .collect()
                        .then(p => p.sort((a, b) => (a.inMemoriamOrder ?? Infinity) - (b.inMemoriamOrder ?? Infinity)))
                        .then(p => p.slice(0, limit));
                    break;
            }
        } else {
            people = await ctx.db
                .query("people")
                .order("desc")
                .take(limit);
        }

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
                    .map(pab => {
                        const boardsForId = boardsMap.get(pab.advisoryBoardId) || []
                        return boardsForId.map(board => ({ ...board, pabOrder: pab.order }))
                    })
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

        return {
            ...person,
            image: person.imageId
                ? await resolveImageId(ctx, person.imageId)
                : null
        };
    },
});

export const getPersonFast = query({
    args: { id: v.id("people") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
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
                const advisoryBoard = await ctx.db.get(pab.advisoryBoardId);
                return advisoryBoard ? {
                    advisoryBoard,
                    ...pab
                } : null;
            })
        );

        return {
            ...person,
            image: person.imageId
                ? await resolveImageId(ctx, person.imageId)
                : null,
            advisoryBoards: advisoryBoards.filter(Boolean),
        };
    },
});

export const createPerson = mutation({
    args: {
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
        advisoryBoardIds: v.optional(v.array(v.id("advisoryBoards"))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const personId = await ctx.db.insert("people", {
            name: args.name,
            title: args.title,
            bio: args.bio,
            imageId: args.imageId,
            link: args.link,
            isDirector: args.isDirector,
            isStaff: args.isStaff ?? false,
            isEquine: args.isEquine ?? false,
            isStoryTeller: args.isStoryTeller ?? false,
            isAmbassador: args.isAmbassador ?? false,
            isPhotographer: args.isPhotographer ?? false,
            inMemoriam: args.inMemoriam,

            directorOrder: 1000 + Math.floor(Math.random() * 1000),
            staffOrder: 1000 + Math.floor(Math.random() * 1000),
            equineOrder: 1000 + Math.floor(Math.random() * 1000),
            storytellerOrder: 1000 + Math.floor(Math.random() * 1000),
            ambassadorOrder: 1000 + Math.floor(Math.random() * 1000),
            photographerOrder: 1000 + Math.floor(Math.random() * 1000),
            inMemoriamOrder: 1000 + Math.floor(Math.random() * 1000),
        })

        const person = await ctx.db.get(personId)
        if (person) {
            await peopleAggregate.insert(ctx, person)
        }

        // Add advisory board associations if provided
        if (args.advisoryBoardIds && args.advisoryBoardIds.length > 0) {
            await Promise.all(
                args.advisoryBoardIds.map(async (boardId) => {
                    await ctx.db.insert("peopleAdvisoryBoards", {
                        personId,
                        advisoryBoardId: boardId,
                        order: 1000 + Math.floor(Math.random() * 1000),
                    })
                })
            )
        }

        return personId
    },
})

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
        isPhotographer: v.optional(v.boolean()),
        inMemoriam: v.optional(v.boolean()),
        link: v.optional(v.string()),
        advisoryBoardIds: v.optional(v.array(v.id("advisoryBoards"))),

        directorOrder: v.optional(v.number()),
        staffOrder: v.optional(v.number()),
        equineOrder: v.optional(v.number()),
        storytellerOrder: v.optional(v.number()),
        ambassadorOrder: v.optional(v.number()),
        photographerOrder: v.optional(v.number()),
        inMemoriamOrder: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const existingPerson = await ctx.db.get(args.id);
        if (!existingPerson) {
            throw new Error("Person not found");
        }

        const updateData: Partial<Exclude<Doc<"people">, "_id">> = {};

        if (args.name !== undefined) updateData.name = args.name;
        if (args.title !== undefined) updateData.title = args.title;
        if (args.bio !== undefined) updateData.bio = args.bio;
        if (args.imageId !== undefined) updateData.imageId = args.imageId;
        if (args.isDirector !== undefined) updateData.isDirector = args.isDirector;
        if (args.isStaff !== undefined) updateData.isStaff = args.isStaff;
        if (args.isEquine !== undefined) updateData.isEquine = args.isEquine;
        if (args.isStoryTeller !== undefined) updateData.isStoryTeller = args.isStoryTeller;
        if (args.isAmbassador !== undefined) updateData.isAmbassador = args.isAmbassador;
        if (args.isPhotographer !== undefined) updateData.isPhotographer = args.isPhotographer;
        if (args.inMemoriam !== undefined) updateData.inMemoriam = args.inMemoriam;
        if (args.link !== undefined) updateData.link = args.link;
        if (args.directorOrder !== undefined) updateData.directorOrder = args.directorOrder;
        if (args.staffOrder !== undefined) updateData.staffOrder = args.staffOrder;
        if (args.equineOrder !== undefined) updateData.equineOrder = args.equineOrder;
        if (args.storytellerOrder !== undefined) updateData.storytellerOrder = args.storytellerOrder;
        if (args.ambassadorOrder !== undefined) updateData.ambassadorOrder = args.ambassadorOrder;
        if (args.photographerOrder !== undefined) updateData.photographerOrder = args.photographerOrder;
        if (args.inMemoriamOrder !== undefined) updateData.inMemoriamOrder = args.inMemoriamOrder;

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
                            order:  1000 + Math.floor(Math.random() * 1000),
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
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const person = await ctx.db.get(args.id)
        if (!person) {
            throw new Error("Person not found")
        }

        // Remove advisory board associations
        const associations = await ctx.db
            .query("peopleAdvisoryBoards")
            .withIndex("by_person", (q) => q.eq("personId", args.id))
            .collect()

        await Promise.all(
            associations.map(async (association) => {
                await ctx.db.delete(association._id)
            })
        )

        // Delete the person
        await peopleAggregate.delete(ctx, person)
        await ctx.db.delete(args.id)

        return { success: true }
    },
})

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

                return {
                    ...person,
                    image: person.imageId
                        ? await resolveImageId(ctx, person.imageId)
                        : null,
                };
            })
        );

        return people.filter(Boolean);
    },
});

export const updatePersonOrder = mutation({
    args: {
        id: v.id("people"),
        personType: v.union(
            v.literal("director"),
            v.literal("staff"),
            v.literal("equine"),
            v.literal("storyteller"),
            v.literal("ambassador"),
            v.literal("photographer"),
            v.literal("inMemoriam")
        ),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const person = await ctx.db.get(args.id);
        if (!person) {
            throw new Error("Person not found");
        }

        const updateData: any = {};

        // Update the appropriate order field based on person type
        switch (args.personType) {
            case "director":
                updateData.directorOrder = args.order;
                break;
            case "staff":
                updateData.staffOrder = args.order;
                break;
            case "equine":
                updateData.equineOrder = args.order;
                break;
            case "storyteller":
                updateData.storytellerOrder = args.order;
                break;
            case "ambassador":
                updateData.ambassadorOrder = args.order;
                break;
            case "photographer":
                updateData.photographerOrder = args.order;
                break;
            case "inMemoriam":
                updateData.inMemoriamOrder = args.order;
                break;
        }

        await ctx.db.patch(args.id, updateData);

        return args.id;
    },
});