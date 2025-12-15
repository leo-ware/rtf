import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QMCtxType } from "../types";
import { removeUndefinedFields } from "../utils";
import ArticleMetadataManager from "./articleMetadataManager";
import { resolveImageId } from "./imageManager";

type CreateArgs = {
    title: string,
    slug: string,
    excerpt: string,
    date: number,
    content?: string,
    imageId: Id<"images">,
    authorCredit?: string,
}

type UpdateArgs = {
    slug?: string,
    content?: string,
    imageId?: Id<"images">,
    authorCredit?: string,
}

export default class ArticleManager {
    id: Id<"articles">
    constructor(id: Id<"articles">) {
        this.id = id;
    }

    static async create(ctx: MutationCtx, args: CreateArgs) {
        await ArticleManager.helperCheckSlugUnique(ctx, args.slug);
        const articleMetadataManager = await ArticleMetadataManager.create(ctx, {
            imageId: args.imageId,
            title: args.title,
            excerpt: args.title,
            herdIds: [],
            animalIds: [],
            date: args.date || Date.now(),
            public: false,
        });
        const articleId = await ctx.db.insert("articles", {
            slug: args.slug,
            content: args.content || "",
            articleMetadataId: articleMetadataManager.id,
            imageId: args.imageId,
            authorCredit: args.authorCredit,
        });
        await articleMetadataManager.assignArticle(ctx, {
            articleId: articleId,
        });
        return new ArticleManager(articleId);
    }

    async update(ctx: MutationCtx, args: UpdateArgs) {
        if (args.slug !== undefined) {
            await ArticleManager.helperCheckSlugUnique(ctx, args.slug, this.id);
        }
        const patch = removeUndefinedFields(args);
        await ctx.db.patch(this.id, patch);
        if (patch.imageId) {
            const article = await this.get(ctx);
            if (!article) {
                throw new Error("Article not found");
            }
            const articleMetadataManager = new ArticleMetadataManager(article.articleMetadataId);
            await articleMetadataManager.update(ctx, {
                imageId: patch.imageId,
            });
        }
    }

    async delete(ctx: MutationCtx) {
        const article = await this.get(ctx);
        if (!article) {
            throw new Error("Article not found");
        }
        const metadataManager = new ArticleMetadataManager(article.articleMetadataId);
        await metadataManager.delete(ctx);
        await ctx.db.delete(this.id);
    }

    private static async assembleRelations(ctx: QMCtxType, article: Doc<"articles">) {
        const articleMetadataManager = new ArticleMetadataManager(article.articleMetadataId);
        const [image, articleMetadata] = await Promise.all([
            article.imageId ? resolveImageId(ctx, article.imageId) : null,
            article.articleMetadataId
                ? articleMetadataManager.get(ctx)
                : null,
        ]);
        if (!articleMetadata) {
            return null
        }
        return {
            ...article,
            image,
            articleMetadata,
        };
    }

    async get(ctx: QMCtxType) {
        return await ctx.db.get(this.id);
    }

    async getWithRelations(ctx: QMCtxType) {
        const article = await this.get(ctx);
        if (!article) {
            return null
        }
        return await ArticleManager.assembleRelations(ctx, article);
    }

    static async getBySlug(ctx: QMCtxType, slug: string) {
        const article = await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();
        if (!article) {
            return null
        }
        return await this.assembleRelations(ctx, article);
    }

    static async helperCheckSlugUnique (ctx: QMCtxType, slug: string, id?: Id<"articles">) {
        const existingArticle = await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();
    
        if (existingArticle) {
            if (!id || existingArticle._id !== id) {
                throw new Error("An article with this slug already exists");
            }
        }
    }
}