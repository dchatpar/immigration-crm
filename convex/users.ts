import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sync = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        role: v.string(),
        avatar: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            // Update if changed
            if (existing.name !== args.name || existing.avatar !== args.avatar) {
                await ctx.db.patch(existing._id, {
                    name: args.name,
                    avatar: args.avatar,
                    lastLogin: Date.now(),
                    updatedAt: Date.now(),
                });
            }
            return existing._id;
        }

        // Create new
        return await ctx.db.insert("users", {
            ...args,
            role: args.role || "CASE_OFFICER", // Default
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const getCurrentUser = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});
