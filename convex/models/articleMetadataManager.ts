import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QMCtxType } from "../types";
import { PaginationOptions } from "convex/server";
import ArticleSearchManager, { ArticleSearchParams } from "./articleSearchManager";
import { resolveImageId } from "./imageManager";

// keep in sync with lib/topicType.ts
export const topicNameList = [
    "homepage",
    "conservation",
    "sanctuary",
    "advocacy",
    "education",
    "herd_management",
    "population_management",
    "roundups",
    "horse_slaughter",
    "spirit",
] as const;
export const convexTopicEnum = v.union(
    ...topicNameList.map(topic => v.literal(topic))
);
export type TopicNameType = (typeof topicNameList)[number];

export const topicNameToAttributeName = (topic: TopicNameType) => (`topic_${topic}` as const);
export const attributeNameToTopicName = (attribute: TopicAttributeType) => {
    return attribute.replace("topic_", "") as TopicNameType;
}
const topicAttributeList = topicNameList.map(topicNameToAttributeName)
type TopicAttributeType = (typeof topicAttributeList)[number];
// end of necessary sync

export const extractTopicsList = <T extends Partial<Record<TopicAttributeType, boolean | undefined>>>(obj: T) => {
    const topics: TopicNameType[] = []
    topicAttributeList.forEach(attribute => {
        if (attribute in obj) {
            if (obj[attribute]) {
                topics.push(attributeNameToTopicName(attribute))
            }
        }
    })
    return topics
}

type CreateArgs = {
    title: string,
    articleId?: Id<"articles">,
    externalArticleId?: Id<"externalArticles">,
    excerpt?: string,
    date?: number,
    public?: boolean,
    herdIds?: Id<"herds">[],
    animalIds?: Id<"animals">[],
    topics?: TopicNameType[],
    imageId: Id<"images">,
}

type UpdateArgs = Exclude<Partial<CreateArgs>, "articleId" | "externalArticleId">

const resolvePaginatedResult = async (ctx: QMCtxType, articleMetadata: Doc<"articleMetadata">) => {
    const link = articleMetadata.isExternal
        ? `/api/redirect/external-article/${articleMetadata.externalArticleId}`
        : `/api/redirect/article/${articleMetadata.articleId}`
    const image = await resolveImageId(ctx, articleMetadata.imageId);
    return {
        ...articleMetadata,
        link,
        image,
    }
}

class ArticleMetadataManager {
    id: Id<"articleMetadata">;
    constructor(id: Id<"articleMetadata">) {
        this.id = id;
    }

    static async create(ctx: MutationCtx, args: CreateArgs) {
        const now = Date.now();
        const articleMetadataId = await ctx.db.insert("articleMetadata", {
            title: args.title,
            articleId: args.articleId,
            externalArticleId: args.externalArticleId,
            excerpt: args.excerpt || "",
            date: args.date || now,
            public: args.public || false,
            herdIds: [],
            animalIds: [],
            searchText: `${args.title} ${args.excerpt || ""}`,
            isExternal: !!args.externalArticleId,
            imageId: args.imageId,
        });
        const manager = new ArticleMetadataManager(articleMetadataId)
        if (args.herdIds) {
            await manager.setHerds(ctx, { herdIds: args.herdIds });
        }
        if (args.animalIds) {
            await manager.setAnimals(ctx, { animalIds: args.animalIds });
        }
        if (args.topics) {
            await manager.setTopics(ctx, articleMetadataId, args.topics);
        }
        return manager
    }

    async update(ctx: MutationCtx, args: UpdateArgs) {
        if (args.articleId && args.externalArticleId) {
            throw new Error("Cannot specify both articleId and externalArticleId");
        }
        if (args.herdIds) {
            await this.setHerds(ctx, { herdIds: args.herdIds });
        }
        if (args.animalIds) {
            await this.setAnimals(ctx, { animalIds: args.animalIds });
        }
        if (args.topics) {
            await this.setTopics(ctx, this.id, args.topics);
        }

        const item = await this.get(ctx);
        if (!item) {
            throw new Error("Article metadata not found");
        }

        const patch: Partial<Doc<"articleMetadata">> = {
            title: item.title,
            excerpt: item.excerpt,
        }
        if (args.title) {
            patch.title = args.title
        }
        if (args.excerpt) {
            patch.excerpt = args.excerpt
        }
        if (args.date) {
            patch.date = args.date;
        }
        if (args.public) {
            patch.public = args.public;
        }
        if (args.imageId) {
            patch.imageId = args.imageId;
        }
        patch.searchText = `${item.title || patch.title} ${item.excerpt || patch.excerpt || ""}`;
        await ctx.db.patch(this.id, patch);
    }

    async delete(ctx: MutationCtx) {
        await ctx.db.delete(this.id);
    }

    async get(ctx: QMCtxType) {
        return await ctx.db.get(this.id);
    }

    private static async attachRelations(ctx: QMCtxType, articleMetadata: Doc<"articleMetadata">) {
        if (!articleMetadata) {
            return null;
        }
        const herdsPromise = Promise.all(articleMetadata.herdIds
            .map(async (herdId) => ctx.db.get(herdId)));
        const animalsPromise = Promise.all(articleMetadata.animalIds
            .map(async (animalId) => ctx.db.get(animalId)));
        const articlePromise = articleMetadata.articleId
            ? ctx.db.get(articleMetadata.articleId)
            : null;
        const externalArticlePromise = articleMetadata.externalArticleId
            ? ctx.db.get(articleMetadata.externalArticleId)
            : null;

        const [herds, animals, article, externalArticle] = await Promise.all([
            herdsPromise,
            animalsPromise,
            articlePromise,
            externalArticlePromise,
        ])

        return {
            ...articleMetadata,
            herds,
            animals,
            article,
            externalArticle,
        }
    }

    private static async attachArticle(ctx: QMCtxType, articleMetadata: Doc<"articleMetadata">) {
        const [article, externalArticle] = await Promise.all([
            articleMetadata.articleId ? ctx.db.get(articleMetadata.articleId) : null,
            articleMetadata.externalArticleId ? ctx.db.get(articleMetadata.externalArticleId) : null,
        ])
        return {
            ...articleMetadata,
            article,
            externalArticle,
        }
    }

    async getWithRelations(ctx: QMCtxType) {
        const articleMetadata = await this.get(ctx);
        if (!articleMetadata) {
            return null;
        }
        return await ArticleMetadataManager.attachRelations(ctx, articleMetadata);
    }

    async getWithArticle(ctx: QMCtxType) {
        const articleMetadata = await this.get(ctx);
        if (!articleMetadata) {
            return null;
        }
        return await ArticleMetadataManager.attachArticle(ctx, articleMetadata);
    }

    async assignArticle(ctx: MutationCtx, args: {
        articleId: Id<"articles">,
    }) {
        await ctx.db.patch(this.id, {
            articleId: args.articleId,
            externalArticleId: undefined,
            isExternal: false,
        })
    }

    async assignExternalArticle(ctx: MutationCtx, args: {
        externalArticleId: Id<"externalArticles">,
    }) {
        await ctx.db.patch(this.id, {
            externalArticleId: args.externalArticleId,
            articleId: undefined,
            isExternal: true,
        })
    }

    async setHerds(ctx: MutationCtx, args: {
        herdIds: Id<"herds">[]
    }) {
        const [herds, articleMetadata] = await Promise.all([
            Promise.all(args.herdIds.map(async (herdId) => ctx.db.get(herdId))),
            ctx.db.get(this.id),
        ])

        if (!articleMetadata) {
            throw new Error("Failed to retrieve article metadata");
        }

        const herdPatches = herds
            .filter(herd => !!herd)
            .map(herd => ({
                ...herd,
                articleMetadataIds: (herd.articleMetadataIds || [])
                    .filter(id => id !== this.id)
                    .concat([this.id])
            }))
        const foundHerdIds = herdPatches
            .map(herd => herd._id)
            .filter(id => !!id);
        const articleMetadataPatch = {
            ...articleMetadata,
            herdIds: foundHerdIds
        }
        await Promise.all([
            ctx.db.patch(this.id, articleMetadataPatch),
            Promise.all(herdPatches.map(herd => ctx.db.patch(herd._id, herd))),
        ])
    }

    async setAnimals(ctx: MutationCtx, args: {
        animalIds: Id<"animals">[]
    }) {
        const { animalIds } = args;
        const [animals, articleMetadata] = await Promise.all([
            Promise.all(animalIds.map(async (animalId) => ctx.db.get(animalId))),
            ctx.db.get(this.id),
        ])
        if (!articleMetadata) {
            throw new Error("Failed to retrieve article metadata");
        }

        const animalPatches = animals
            .filter(animal => !!animal)
            .map(animal => ({
                ...animal,
                articleMetadataIds: (animal.articleMetadataIds || [])
                    .filter(id => id !== this.id)
                    .concat([this.id])
            }))
        const foundAnimalIds = animalPatches
            .map(animal => animal._id)
            .filter(id => !!id);
        const articleMetadataPatch = {
            ...articleMetadata,
            animalIds: foundAnimalIds
        }

        await Promise.all([
            ctx.db.patch(this.id, articleMetadataPatch),
            Promise.all(animalPatches.map(animal => ctx.db.patch(animal._id, animal))),
        ])
    }

    async setTopics(
        ctx: MutationCtx,
        articleMetadataId: Id<"articleMetadata">,
        topics: TopicNameType[]
    ) {
        const patch = Object.fromEntries(topicNameList.map(topicName => [
            topicNameToAttributeName(topicName),
            topics.includes(topicName)
        ])) as Record<TopicAttributeType, boolean>

        await ctx.db.patch(articleMetadataId, patch);
        return articleMetadataId;
    }

    static async search(ctx: QMCtxType, searchArgs: ArticleSearchParams, paginationOpts: PaginationOptions,) {
        const pagination = await ArticleSearchManager.search(
            ctx,
            searchArgs,
            paginationOpts
        );
        return {
            ...pagination,
            page: await Promise.all(pagination.page.map(
                async (articleMetadata) => await resolvePaginatedResult(ctx, articleMetadata)
            )),
        }
    }

    static async carouselSearch(ctx: QMCtxType, searchArgs: ArticleSearchParams, paginationOpts: PaginationOptions,) {
        return await ArticleMetadataManager.search(ctx, searchArgs, paginationOpts);
    }
}

export default ArticleMetadataManager