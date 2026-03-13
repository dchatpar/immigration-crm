import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        caseId: v.id("cases"),
    },
    handler: async (ctx, args) => {
        const activities = await ctx.db
            .query("activities")
            .withIndex("by_caseId_createdAt", (q) => q.eq("caseId", args.caseId))
            .order("desc")
            .collect();

        // Enrich with user details
        return await Promise.all(
            activities.map(async (activity) => {
                let user = null;
                if (activity.userId) {
                    const userData = await ctx.db.get(activity.userId);
                    if (userData) {
                        user = {
                            id: userData._id,
                            name: userData.name,
                            email: userData.email,
                        };
                    }
                }
                return {
                    ...activity,
                    user,
                };
            })
        );
    },
});

export const create = mutation({
    args: {
        caseId: v.id("cases"),
        userId: v.optional(v.id("users")),
        type: v.string(),
        action: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const activityId = await ctx.db.insert("activities", {
            caseId: args.caseId,
            userId: args.userId,
            type: args.type,
            action: args.action,
            description: args.description,
            createdAt: Date.now(),
        });
        return activityId;
    },
});

export const listRecent = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        const activities = await ctx.db
            .query("activities")
            .order("desc")
            .take(limit);

        return await Promise.all(
            activities.map(async (activity) => {
                let caseData = null;
                let user = null;

                if (activity.caseId) {
                    caseData = await ctx.db.get(activity.caseId);
                }
                if (activity.userId) {
                    const userData = await ctx.db.get(activity.userId);
                    if (userData) {
                        user = {
                            id: userData._id,
                            name: userData.name,
                        };
                    }
                }
                return {
                    ...activity,
                    case: caseData ? {
                        id: caseData._id,
                        caseNumber: caseData.caseNumber,
                        clientName: `${caseData.clientFirstName} ${caseData.clientLastName}`,
                    } : null,
                    user,
                };
            })
        );
    },
});
