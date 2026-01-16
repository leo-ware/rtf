import { Id } from "../_generated/dataModel"
import { MutationCtx } from "../types"
import { removeUndefinedFields } from "../utils"

type CreateArgs = {
    name: string,
    notes?: string,
    formId: string,
    formTemplateId: string,
}

type UpdateArgs = Partial<CreateArgs>

export default class DonationFormManager {
    id: Id<"donationForms">

    constructor(id: Id<"donationForms">) {
        this.id = id;
    }

    static async create(ctx: MutationCtx, args: CreateArgs) {
        const id = await ctx.db.insert("donationForms", {
            name: args.name,
            notes: args.notes,
            formId: args.formId,
            formTemplateId: args.formTemplateId,
            updatedAt: Date.now(),
        })
        return new DonationFormManager(id)
    }

    async update(ctx: MutationCtx, args: UpdateArgs) {
        await ctx.db.patch(this.id, {
            ...removeUndefinedFields(args),
            updatedAt: Date.now(),
        })
    }

    async delete(ctx: MutationCtx) {
        await ctx.db.delete(this.id)
    }
}