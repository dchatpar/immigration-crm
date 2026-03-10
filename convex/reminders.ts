import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("reminders").collect();
    },
});
