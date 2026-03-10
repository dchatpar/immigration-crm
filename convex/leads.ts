import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        status: v.optional(v.string()),
        assignedToId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        let leads;
        if (args.status && args.assignedToId) {
            leads = await ctx.db
                .query("leads")
                .withIndex("by_status_assigned", (q) =>
                    q.eq("status", args.status!).eq("assignedToId", args.assignedToId!)
                )
                .order("desc")
                .collect();
        } else {
            leads = await ctx.db.query("leads").order("desc").collect();
            // Apply memory filters if needed
            if (args.status) leads = leads.filter(l => l.status === args.status);
            if (args.assignedToId) leads = leads.filter(l => l.assignedToId === args.assignedToId);
        }

        // Enrich with assignee details
        return await Promise.all(
            leads.map(async (lead) => {
                let assignedTo = null;
                if (lead.assignedToId) {
                    const user = await ctx.db.get(lead.assignedToId);
                    if (user) {
                        assignedTo = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        };
                    }
                }
                return {
                    ...lead,
                    assignedTo,
                    // usage of _count would require separate queries or denormalization
                    _count: { notes: 0, activities: 0 }
                };
            })
        );
    },
});

export const get = query({
    args: { id: v.id("leads") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.optional(v.string()),
        phone: v.string(),
        alternatePhone: v.optional(v.string()),
        source: v.optional(v.string()),
        priority: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const leadId = await ctx.db.insert("leads", {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phone: args.phone,
            alternatePhone: args.alternatePhone,
            source: args.source || "OTHER",
            priority: args.priority || "MEDIUM",
            status: args.status || "NEW",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return leadId;
    },
});

export const update = mutation({
    args: {
        id: v.id("leads"),
        status: v.optional(v.string()),
        assignedToId: v.optional(v.id("users")),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

export const deleteLead = mutation({
    args: { id: v.id("leads") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("leads").collect();
    },
});
