import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { caseId: v.id("cases") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("statusUpdates")
            .withIndex("by_caseId_createdAt", (q) => q.eq("caseId", args.caseId))
            .order("desc")
            .collect();
    },
});
