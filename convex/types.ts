import { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server"
import { DataModel } from "./_generated/dataModel"

type ActionCtx = GenericActionCtx<DataModel>
type MutationCtx = GenericMutationCtx<DataModel>
type QueryCtx = GenericQueryCtx<DataModel>

export type CtxType = ActionCtx | MutationCtx | QueryCtx
export type QMCtxType = QueryCtx | MutationCtx
