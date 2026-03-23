import { PaginationOptions } from "convex/server";
import { type QMCtxType } from "../types"
import { topicNameToAttributeName, type TopicNameType, type CategoryNameType } from "./articleMetadataManager"

export type ArticleSearchParams = {
    query?: string,
    topics?: TopicNameType[],
    external?: boolean,
    category?: CategoryNameType,
    dateMin?: number,
    dateMax?: number,
    publicOnly?: boolean,
}

function buildTextSearchQuery(ctx: QMCtxType, args: ArticleSearchParams) {
    const query = ctx.db.query("articleMetadata");
    if (!args.query) {
        throw new Error("Query is required");
    }
    const indexedQuery = query.withSearchIndex(
        "searchText",
        (q) => {
            let search = q.search("searchText", args.query!);

            if (args.external !== undefined) {
                search = search.eq("isExternal", args.external);
            }
            if (args.publicOnly) {
                search = search.eq("public", true);
            }
            if (args.category !== undefined) {
                search = search.eq("category", args.category);
            }
            return search
        },
    )
    if (
        args.dateMin !== undefined ||
        args.dateMax !== undefined ||
        (args.topics !== undefined && args.topics.length > 0)
    ) {
        return indexedQuery.filter(q => {
            return q.and(...[
                args.dateMin !== undefined
                    ? q.gte(q.field("date"), args.dateMin!)
                    : undefined,
                args.dateMax !== undefined
                    ? q.lte(q.field("date"), args.dateMax!)
                    : undefined,
                args.topics && args.topics.length > 0
                    ? q.or(...args.topics.map(topic =>
                        q.eq(q.field(topicNameToAttributeName(topic)), true)
                      ))
                    : undefined,
            ].filter((x): x is Exclude<typeof x, undefined> => x !== undefined))
        })
    } else {
        return indexedQuery;
    }
}

function buildFilterQuery(ctx: QMCtxType, args: ArticleSearchParams) {
    if (
        args.external === undefined &&
        args.category === undefined &&
        args.dateMin === undefined &&
        args.dateMax === undefined &&
        args.topics === undefined &&
        !args.publicOnly
    ) {
        return ctx.db.query("articleMetadata");
    }

    const baseQuery = ctx.db.query("articleMetadata");
    const query = args.publicOnly
        ? baseQuery.withIndex("by_public_date", q => q.eq("public", true))
        : baseQuery;

    return query.order("desc")
        .filter(q => {
            return q.and(...[
                args.external !== undefined
                    ? q.eq(q.field("isExternal"), args.external!)
                    : undefined,
                args.category !== undefined
                    ? q.eq(q.field("category"), args.category!)
                    : undefined,
                args.dateMin
                    ? q.gte(q.field("date"), args.dateMin!)
                    : undefined,
                args.dateMax
                    ? q.lte(q.field("date"), args.dateMax!)
                    : undefined,
                args.topics && args.topics.length > 0
                    ? q.or(...args.topics.map(topic =>
                        q.eq(q.field(topicNameToAttributeName(topic)), true)
                      ))
                    : undefined,
            ].filter((x): x is Exclude<typeof x, undefined> => x !== undefined))
        })
}

export async function searchArticles(ctx: QMCtxType, args: ArticleSearchParams, paginationOpts: PaginationOptions) {
    const query = args.query
        ? buildTextSearchQuery(ctx, args)
        : buildFilterQuery(ctx, args)
    return await query.paginate(paginationOpts)
}
