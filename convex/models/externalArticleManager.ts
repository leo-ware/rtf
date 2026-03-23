import { PaginationOptions, PaginationResult } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QMCtxType } from "../types";
import ArticleMetadataManager from "./articleMetadataManager";
import { resolveImageId } from "./imageManager";
import { removeUndefinedFields } from "../utils";

type CreateArgs = {
    link: string,
    title: string,
    imageId: Id<"images">,
    blurb: string,
    organization: string,
    date: number,
    tags?: Id<"tags">[],
}

type UpdateArgs = Partial<CreateArgs> & {
    id: Id<"externalArticles">,
}

const resolveExternalArticle = async (ctx: QMCtxType, externalArticleId: Id<"externalArticles">) => {
    const manager = new ExternalArticleManager(externalArticleId);
    return await manager.get(ctx);
}
type ResolvedExternalArticle = Awaited<ReturnType<typeof resolveExternalArticle>>;

const resolvePaginatedResult = async (
    ctx: QMCtxType,
    result: PaginationResult<Doc<"externalArticles">>
): Promise<PaginationResult<ResolvedExternalArticle>> => {
    const externalArticles = await Promise.all(result.page.map(async (externalArticle) => (
        resolveExternalArticle(ctx, externalArticle._id)
    )))
    return {
        ...result,
        page: externalArticles,
    }
}

export default class ExternalArticleManager {
    id: Id<"externalArticles">
    constructor(id: Id<"externalArticles">) {
        this.id = id;
    }

    static async create(ctx: MutationCtx, args: CreateArgs) {
        const articleMetadataManager = await ArticleMetadataManager.create(ctx, {
            imageId: args.imageId,
            title: args.title,
            excerpt: args.blurb,
            date: args.date,
            public: true,
            tags: args.tags,
        });

        const externalArticleId = await ctx.db.insert("externalArticles", {
            link: args.link,
            title: args.title,
            imageId: args.imageId,
            blurb: args.blurb,
            organization: args.organization,
            articleMetadataId: articleMetadataManager.id,
        });

        await articleMetadataManager.assignExternalArticle(
            ctx,
            {externalArticleId: externalArticleId}
        )

        return new ExternalArticleManager(externalArticleId);
    }

    static async list(ctx: QMCtxType, args: {paginationOpts: PaginationOptions}) {
        const pagination = await ctx.db.query("externalArticles")
            .order("desc")
            .paginate(args.paginationOpts)
        return await resolvePaginatedResult(ctx, pagination);
    }

    async get(ctx: QMCtxType) {
        const externalArticle = await ctx.db.get(this.id);
        if (!externalArticle) {
            return null;
        }
        return {
            ...externalArticle,
            image: externalArticle.imageId
                ? await resolveImageId(ctx, externalArticle.imageId)
                : null,
        }
    }

    async update(ctx: MutationCtx, args: UpdateArgs) {
        await ctx.db.patch(this.id, removeUndefinedFields(args));
    }

    async delete(ctx: MutationCtx) {
        const externalArticle = await this.get(ctx);
        if (!externalArticle) {
            throw new Error("External article not found");
        }
        await ctx.db.delete(externalArticle.articleMetadataId);
        await ctx.db.delete(this.id);
    }
}