import { PaginationOptions } from "convex/server";
import { type QMCtxType } from "../types"
import { topicNameToAttributeName, type TopicNameType } from "./articleMetadataManager"
import { Id } from "../_generated/dataModel";

export type ArticleSearchParams = {
    query?: string,
    topics?: TopicNameType[],
    external?: boolean,
    dateMin?: number,
    dateMax?: number,
    publicOnly?: boolean,
    herdId?: Id<"herds">,
    animalId?: Id<"animals">,
}

export default class ArticleSearchManager {
    args: ArticleSearchParams;

    constructor(args: ArticleSearchParams) {
        this.args = args;
    }

    static async search(ctx: QMCtxType, args: ArticleSearchParams, paginationOpts: PaginationOptions) {
        const manager = new ArticleSearchManager(args);
        return await manager.run(ctx, paginationOpts);
    }

    async _getJoinFilters(ctx: QMCtxType) {
        const herdIdFilter = this.args.herdId
            ? ctx.db.get(this.args.herdId)
                .then(herd => herd?.articleMetadataIds || [])
                .catch(() => {
                    console.warn(`Failed to retrieve herd ${this.args.herdId}`);
                    return [];
                })
            : []
        
        const animalIdFilter = this.args.animalId
            ? ctx.db.get(this.args.animalId)
                .then(animal => animal?.articleMetadataIds || [])
                .catch(() => {
                    console.warn(`Failed to retrieve animal ${this.args.animalId}`);
                    return [];
                })
            : []
        
        const [herdIds, animalIds] = await Promise.all([
            herdIdFilter,
            animalIdFilter,
        ])
        
        return {
            herdIds,
            animalIds,
        }
    }

    async _textSearchQuery(ctx: QMCtxType) {
        const query = ctx.db.query("articleMetadata");
        if (!this.args.query) {
            throw new Error("Query is required");
        }
        const indexedQuery = query.withSearchIndex(
            "searchText",
            (q) => {
                let search = q.search("searchText", this.args.query!);

                if (this.args.external !== undefined) {
                    search = search.eq("isExternal", this.args.external);
                }
                if (this.args.topics !== undefined) {
                    this.args.topics.forEach(topic => {
                        search = search.eq(topicNameToAttributeName(topic), true);
                    })
                }
                return search
            },
        )
        if (
            this.args.dateMin !== undefined ||
            this.args.dateMax !== undefined ||
            this.args.publicOnly
        ) {
            return indexedQuery.filter(q => {
                return q.and(...[
                    this.args.dateMin !== undefined
                        ? q.gte(q.field("date"), this.args.dateMin!)
                        : undefined,
                    this.args.dateMax !== undefined
                        ? q.lte(q.field("date"), this.args.dateMax!)
                        : undefined,
                    this.args.publicOnly
                        ? q.eq(q.field("public"), true)
                        : undefined,
                ].filter(x => x !== undefined))
            })
        } else {
            return indexedQuery;
        }
    }

    async _filterQuery(ctx: QMCtxType) {
        if (
            this.args.external === undefined &&
            this.args.dateMin === undefined &&
            this.args.dateMax === undefined &&
            this.args.topics === undefined
        ) {
            return ctx.db.query("articleMetadata");
        }

        const query = ctx.db
            .query("articleMetadata")
            .filter(q => {
                return q.and(...[
                    this.args.external != undefined
                        ? q.eq(q.field("isExternal"), this.args.external!)
                        : undefined,
                    this.args.dateMin
                        ? q.gte(q.field("date"), this.args.dateMin!)
                        : undefined,
                    this.args.dateMax
                        ? q.lte(q.field("date"), this.args.dateMax!)
                        : undefined,
                    this.args.publicOnly
                        ? q.eq(q.field("public"), true)
                        : undefined,
                    ...(this.args.topics || []).map(topic => (
                        q.eq(q.field(topicNameToAttributeName(topic)), true)
                    ))
                ].filter(x => x !== undefined))
            })
        return query
    }

    async run(ctx: QMCtxType, paginationOpts: PaginationOptions) {
        const query = this.args.query
            ? await this._textSearchQuery(ctx)
            : await this._filterQuery(ctx);
        return await query.paginate(paginationOpts);
    }
}