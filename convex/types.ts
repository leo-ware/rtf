import { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server"
import { DataModel } from "./_generated/dataModel"

export type ActionCtx = GenericActionCtx<DataModel>
export type MutationCtx = GenericMutationCtx<DataModel>
export type QueryCtx = GenericQueryCtx<DataModel>

export type CtxType = ActionCtx | MutationCtx | QueryCtx
export type QMCtxType = QueryCtx | MutationCtx
