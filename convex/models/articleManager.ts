import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QMCtxType } from "../types";
import { removeUndefinedFields } from "../utils";
import ArticleMetadataManager, { TopicNameType } from "./articleMetadataManager";
import { resolveImageId } from "./imageManager";

type CreateArgs = {
    title: string,
    slug: string,
    excerpt: string,
    date: number,
    content?: string,
    imageId: Id<"images">,
    authorCredit?: string,
    authors?: Id<"people">[],
    tags?: Id<"tags">[],
    herdIds?: Id<"herds">[],
    animalIds?: Id<"animals">[],
    topics?: TopicNameType[],
}

type UpdateArgs = {
    slug?: string,
    content?: string,
    imageId?: Id<"images">,
    authorCredit?: string,
    authors?: Id<"people">[],
    tags?: Id<"tags">[],
    herdIds?: Id<"herds">[],
    animalIds?: Id<"animals">[],
    topics?: TopicNameType[],
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
            excerpt: args.excerpt,
            herdIds: args.herdIds,
            animalIds: args.animalIds,
            date: args.date || Date.now(),
            public: false,
            tags: args.tags,
            topics: args.topics,
        });
        const articleId = await ctx.db.insert("articles", {
            slug: args.slug,
            content: args.content || "",
            articleMetadataId: articleMetadataManager.id,
            imageId: args.imageId,
            authorCredit: args.authorCredit,
            authors: args.authors,
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
        const articlePatch = removeUndefinedFields({
            slug: args.slug,
            content: args.content,
            imageId: args.imageId,
            authorCredit: args.authorCredit,
        });
        if (Object.keys(articlePatch).length > 0) {
            await ctx.db.patch(this.id, articlePatch);
        }

        const hasMetadataUpdates = args.imageId !== undefined || args.tags !== undefined || args.herdIds !== undefined || args.animalIds !== undefined || args.topics !== undefined;

        if (hasMetadataUpdates) {
            const article = await this.get(ctx);
            if (!article) {
                throw new Error("Article not found");
            }
            const articleMetadataManager = new ArticleMetadataManager(article.articleMetadataId);
            await articleMetadataManager.update(ctx, {
                imageId: args.imageId,
                tags: args.tags,
                herdIds: args.herdIds,
                animalIds: args.animalIds,
                topics: args.topics,
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
        const authorNames: string[] = []
        if (article.authors && article.authors.length > 0) {
            const people = await Promise.all(
                article.authors.map(id => ctx.db.get(id))
            )
            for (const person of people) {
                if (person?.name) authorNames.push(person.name)
            }
        }
        return {
            ...article,
            image,
            articleMetadata,
            authorNames,
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
