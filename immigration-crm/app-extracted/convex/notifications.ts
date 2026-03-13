import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("notifications")
            .withIndex("by_userId_isRead", (q) => q.eq("userId", args.userId))
            .order("desc") // Sort by creation time (descending) - requires compound index or memory sort if using partial index
            .collect();
    },
});

export const unreadCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const unread = await ctx.db
            .query("notifications")
            .withIndex("by_userId_isRead", (q) => q.eq("userId", args.userId).eq("isRead", false))
            .collect();
        return unread.length;
    },
});

export const markAsRead = mutation({
    args: { id: v.id("notifications") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            isRead: true,
            readAt: Date.now(),
        });
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        type: v.string(),
        title: v.string(),
        message: v.string(),
        actionUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("notifications", {
            ...args,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});
