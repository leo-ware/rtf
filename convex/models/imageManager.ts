import { PaginationOptions, PaginationResult } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QMCtxType } from "../types";
import { removeUndefinedFields } from "../utils";

type CreateArgs = {
    storageId: Id<"_storage">,
    title: string,
    fileName: string,
    originalName: string,
    mimeType: string,
    size: number,
    altText?: string,
    width?: number,
    height?: number,
    authorCredit?: string,
    authors?: Id<"people">[],
}

type UpdateArgs = {
    title?: string,
    altText?: string,
    width?: number,
    height?: number,
    authorCredit?: string,
    authors?: Id<"people">[],
}

export const resolveImageId = async (ctx: QMCtxType, imageId: Id<"images">) => {
    const manager = new ImageManager(imageId);
    return await manager.get(ctx);
}

export type ResolvedImage = Awaited<ReturnType<typeof resolveImageId>>;

const resolvePaginationResult = async (
    ctx: QMCtxType,
    result: PaginationResult<Doc<"images">>
): Promise<PaginationResult<ResolvedImage>> => {
    const images = await Promise.all(result.page.map(async (image) => (
        resolveImageId(ctx, image._id)
    )))
    return {
        ...result,
        page: images,
    }
}

export const buildSearchText = async (
    ctx: MutationCtx,
    fields: { title: string, authors?: Id<"people">[], authorCredit?: string }
): Promise<string> => {
    const parts = [fields.title]
    if (fields.authors && fields.authors.length > 0) {
        const people = await Promise.all(fields.authors.map(id => ctx.db.get(id)))
        for (const person of people) {
            if (person?.name) parts.push(person.name)
        }
    }
    if (fields.authorCredit) parts.push(fields.authorCredit)
    return parts.join(" ")
}

export default class ImageManager {
    id: Id<"images">
    constructor(id: Id<"images">) {
        this.id = id;
    }

    static async generateUploadUrl(ctx: MutationCtx) {
        return await ctx.storage.generateUploadUrl();
    }

    static async create(ctx: MutationCtx, args: CreateArgs) {
        const searchText = await buildSearchText(ctx, {
            title: args.title,
            authors: args.authors,
            authorCredit: args.authorCredit,
        })
        const imageId = await ctx.db.insert("images", {
            ...args,
            searchText,
        });
        return new ImageManager(imageId);
    }

    static async list(ctx: QMCtxType, args: {paginationOpts: PaginationOptions}) {
        const pagination = await ctx.db.query("images")
            .order("desc")
            .paginate(args.paginationOpts)
        return await resolvePaginationResult(ctx, pagination);
    }

    static async search(ctx: QMCtxType, args: {query: string, paginationOpts: PaginationOptions}) {
        const pagination = await ctx.db.query("images")
            .withSearchIndex("searchTitle", (q) => q.search("searchText", args.query))
            .paginate(args.paginationOpts)
        return await resolvePaginationResult(ctx, pagination);
    }

    async get(ctx: QMCtxType) {
        const image = await ctx.db.get(this.id)
        if (!image) {
            return null;
        }
        const imageUrl = await ctx.storage.getUrl(image.storageId)
        const authorNames: string[] = []
        if (image.authors && image.authors.length > 0) {
            const people = await Promise.all(
                image.authors.map(id => ctx.db.get(id))
            )
            for (const person of people) {
                if (person?.name) authorNames.push(person.name)
            }
        }
        return {
            ...image,
            url: imageUrl || null,
            authorNames,
            blurDataUrl: image.blurDataUrl,
        }
    }

    async update(ctx: MutationCtx, args: UpdateArgs) {
        await ctx.db.patch(this.id, removeUndefinedFields(args));
        // Recompute searchText with the latest field values
        const updated = await ctx.db.get(this.id)
        if (updated) {
            const searchText = await buildSearchText(ctx, {
                title: updated.title,
                authors: updated.authors,
                authorCredit: updated.authorCredit,
            })
            await ctx.db.patch(this.id, { searchText })
        }
    }

    async delete(ctx: MutationCtx) {
        const image = await this.get(ctx);
        if (!image) {
            throw new Error("Image not found");
        }
        await ctx.storage.delete(image.storageId);
        await ctx.db.delete(this.id);
    }
}
