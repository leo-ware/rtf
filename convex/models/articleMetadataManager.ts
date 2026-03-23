import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QMCtxType } from "../types";
import { PaginationOptions } from "convex/server";
import { searchArticles, ArticleSearchParams } from "./articleSearchManager";
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
    "about",
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
// Article categories - keep in sync with lib/topicType.ts
export const categoryNameList = ["featured_news", "rtf_e_news", "field_notes", "press_release"] as const
export type CategoryNameType = (typeof categoryNameList)[number]
export const convexCategoryEnum = v.union(
    ...categoryNameList.map(c => v.literal(c))
)
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
    tags?: Id<"tags">[],
    category?: CategoryNameType,
    from_import?: boolean,
    imageId: Id<"images">,
}

type UpdateArgs = Omit<Partial<CreateArgs>, "articleId" | "externalArticleId">

export const resolvePaginatedResult = async (ctx: QMCtxType, articleMetadata: Doc<"articleMetadata">) => {
    const link = articleMetadata.isExternal
        ? `/api/redirect/external-article/${articleMetadata.externalArticleId}`
        : `/api/redirect/article/${articleMetadata.articleId}`
    const image = await resolveImageId(ctx, articleMetadata.imageId);

    // Fetch author credit and authors if this is an internal article
    let authorCredit: string | undefined = undefined
    let authorNames: string[] = []
    if (articleMetadata.articleId) {
        const article = await ctx.db.get(articleMetadata.articleId)
        if (article?.authorCredit) {
            authorCredit = article.authorCredit
        }
        if (article?.authors && article.authors.length > 0) {
            const people = await Promise.all(
                article.authors.map(id => ctx.db.get(id))
            )
            for (const person of people) {
                if (person?.name) authorNames.push(person.name)
            }
        }
    }

    // Fetch organization if this is an external article
    let organization: string | undefined = undefined
    if (articleMetadata.externalArticleId) {
        const externalArticle = await ctx.db.get(articleMetadata.externalArticleId)
        organization = externalArticle?.organization
    }

    return {
        ...articleMetadata,
        link,
        image,
        authorCredit,
        authorNames,
        organization,
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
            tags: [],
            herdIds: args.herdIds || [],
            animalIds: args.animalIds || [],
            searchText: `${args.title} ${args.excerpt || ""}`,
            isExternal: !!args.externalArticleId,
            imageId: args.imageId,
            category: args.category,
            from_import: args.from_import,
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
        if (args.tags) {
            await manager.setTags(ctx, { tagIds: args.tags });
        }
        return manager
    }

    async update(ctx: MutationCtx, args: UpdateArgs) {
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
        if (args.title !== undefined) {
            patch.title = args.title
        }
        if (args.excerpt !== undefined) {
            patch.excerpt = args.excerpt
        }
        if (args.date !== undefined) {
            patch.date = args.date;
        }
        if (args.public !== undefined) {
            patch.public = args.public;
        }
        if (args.tags !== undefined) {
            await this.setTags(ctx, { tagIds: args.tags });
        }
        if (args.imageId !== undefined) {
            patch.imageId = args.imageId;
        }
        if (args.category !== undefined) {
            patch.category = args.category as Doc<"articleMetadata">["category"];
        }
        patch.searchText = `${patch.title || item.title} ${patch.excerpt || item.excerpt || ""}`;
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
        const articleMetadata = await ctx.db.get(this.id);
        if (!articleMetadata) {
            throw new Error("Failed to retrieve article metadata");
        }

        const oldHerdIds = articleMetadata.herdIds;
        const removedHerdIds = oldHerdIds.filter(id => !args.herdIds.includes(id));

        const [newHerds, removedHerds] = await Promise.all([
            Promise.all(args.herdIds.map(id => ctx.db.get(id))),
            Promise.all(removedHerdIds.map(id => ctx.db.get(id))),
        ]);

        const foundHerdIds: Id<"herds">[] = [];
        const patches: Promise<void>[] = [];

        for (const herd of newHerds) {
            if (!herd) continue;
            foundHerdIds.push(herd._id);
            patches.push(ctx.db.patch(herd._id, {
                articleMetadataIds: [...new Set([...(herd.articleMetadataIds ?? []), this.id])]
            }));
        }
        for (const herd of removedHerds) {
            if (!herd) continue;
            patches.push(ctx.db.patch(herd._id, {
                articleMetadataIds: (herd.articleMetadataIds ?? []).filter(id => id !== this.id)
            }));
        }

        patches.push(ctx.db.patch(this.id, { herdIds: foundHerdIds }));
        await Promise.all(patches);
    }

    async setAnimals(ctx: MutationCtx, args: {
        animalIds: Id<"animals">[]
    }) {
        const articleMetadata = await ctx.db.get(this.id);
        if (!articleMetadata) {
            throw new Error("Failed to retrieve article metadata");
        }

        const oldAnimalIds = articleMetadata.animalIds;
        const removedAnimalIds = oldAnimalIds.filter(id => !args.animalIds.includes(id));

        const [newAnimals, removedAnimals] = await Promise.all([
            Promise.all(args.animalIds.map(id => ctx.db.get(id))),
            Promise.all(removedAnimalIds.map(id => ctx.db.get(id))),
        ]);

        const foundAnimalIds: Id<"animals">[] = [];
        const patches: Promise<void>[] = [];

        for (const animal of newAnimals) {
            if (!animal) continue;
            foundAnimalIds.push(animal._id);
            patches.push(ctx.db.patch(animal._id, {
                articleMetadataIds: [...new Set([...(animal.articleMetadataIds ?? []), this.id])]
            }));
        }
        for (const animal of removedAnimals) {
            if (!animal) continue;
            patches.push(ctx.db.patch(animal._id, {
                articleMetadataIds: (animal.articleMetadataIds ?? []).filter(id => id !== this.id)
            }));
        }

        patches.push(ctx.db.patch(this.id, { animalIds: foundAnimalIds }));
        await Promise.all(patches);
    }

    async setTags(ctx: MutationCtx, args: {
        tagIds: Id<"tags">[]
    }) {
        const articleMetadata = await ctx.db.get(this.id);
        if (!articleMetadata) {
            throw new Error("Failed to retrieve article metadata");
        }

        const oldTagIds = articleMetadata.tags ?? [];
        const removedTagIds = oldTagIds.filter(id => !args.tagIds.includes(id));

        const [newTags, removedTags] = await Promise.all([
            Promise.all(args.tagIds.map(id => ctx.db.get(id))),
            Promise.all(removedTagIds.map(id => ctx.db.get(id))),
        ]);

        const foundTagIds: Id<"tags">[] = [];
        const patches: Promise<void>[] = [];

        for (const tag of newTags) {
            if (!tag) continue;
            foundTagIds.push(tag._id);
            patches.push(ctx.db.patch(tag._id, {
                articleMetadataIds: [...new Set([...(tag.articleMetadataIds ?? []), this.id])]
            }));
        }
        for (const tag of removedTags) {
            if (!tag) continue;
            patches.push(ctx.db.patch(tag._id, {
                articleMetadataIds: (tag.articleMetadataIds ?? []).filter(id => id !== this.id)
            }));
        }

        patches.push(ctx.db.patch(this.id, { tags: foundTagIds }));
        await Promise.all(patches);
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
        const pagination = await searchArticles(
            ctx,
            searchArgs,
            paginationOpts
        );
        return {
            ...pagination,
            page: await Promise.all(pagination.page.map(
                async (articleMetadata: Doc<"articleMetadata">) => await resolvePaginatedResult(ctx, articleMetadata)
            )),
        }
    }

    static async carouselSearch(ctx: QMCtxType, searchArgs: ArticleSearchParams, paginationOpts: PaginationOptions,) {
        return await ArticleMetadataManager.search(ctx, searchArgs, paginationOpts);
    }
}

export default ArticleMetadataManager