import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        status: v.optional(v.string()),
        assignedToId: v.optional(v.id("users")),
        searchTerm: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let cases;

        if (args.status && args.assignedToId) {
            cases = await ctx.db
                .query("cases")
                .withIndex("by_status_assigned", (q) =>
                    q.eq("status", args.status!).eq("assignedToId", args.assignedToId!)
                )
                .order("desc")
                .collect();
        } else {
            cases = await ctx.db.query("cases").order("desc").collect();
            if (args.status) cases = cases.filter(c => c.status === args.status);
            if (args.assignedToId) cases = cases.filter(c => c.assignedToId === args.assignedToId);
        }

        if (args.searchTerm) {
            const lowerTerm = args.searchTerm.toLowerCase();
            cases = cases.filter(c =>
                c.caseNumber.toLowerCase().includes(lowerTerm) ||
                c.clientFirstName.toLowerCase().includes(lowerTerm) ||
                c.clientLastName.toLowerCase().includes(lowerTerm) ||
                c.clientEmail.toLowerCase().includes(lowerTerm)
            );
        }

        // Enrich with assignee details and counts
        return await Promise.all(
            cases.map(async (c) => {
                let assignedTo = null;
                if (c.assignedToId) {
                    const user = await ctx.db.get(c.assignedToId);
                    if (user) {
                        assignedTo = {
                            id: user._id,
                            name: user.name,
                        };
                    }
                }

                // Count related items
                // Note: In a high-volume app, these should be denormalized counters on the case object
                const docCount = (await ctx.db.query("documents").withIndex("by_caseId_status", q => q.eq("caseId", c._id)).collect()).length;
                // Appointments: caseId index needed? yes, appointments has it.
                // But appointments index is compound? Let's check schema.
                // Assuming appointments has index on caseId. If not, this is slow. 
                // We'll proceed with filtering for migration speed, optimize later.
                const apptCount = (await ctx.db.query("appointments").filter(q => q.eq(q.field("caseId"), c._id)).collect()).length;
                const commCount = (await ctx.db.query("communications").withIndex("by_caseId_type", q => q.eq("caseId", c._id)).collect()).length;

                return {
                    ...c,
                    assignedTo,
                    _count: {
                        documents: docCount,
                        appointments: apptCount,
                        communications: commCount
                    }
                };
            })
        );
    },
});

export const get = query({
    args: { id: v.id("cases") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByCaseNumber = query({
    args: { caseNumber: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("cases")
            .withIndex("by_caseNumber", (q) => q.eq("caseNumber", args.caseNumber))
            .first();
    },
});

export const create = mutation({
    args: {
        caseNumber: v.string(),
        leadId: v.optional(v.id("leads")),
        clientFirstName: v.string(),
        clientLastName: v.string(),
        clientEmail: v.string(),
        clientPhone: v.string(),
        serviceType: v.string(),
        assignedToId: v.id("users"),
        dateOfBirth: v.optional(v.number()),
        nationality: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const caseId = await ctx.db.insert("cases", {
            ...args,
            status: "INITIATED",
            serviceTier: "STANDARD",
            priority: "MEDIUM",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return caseId;
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("cases"),
        status: v.string(),
        note: v.optional(v.string()),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const oldCase = await ctx.db.get(args.id);
        if (!oldCase) throw new Error("Case not found");

        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: Date.now(),
        });

        // Log status update
        await ctx.db.insert("statusUpdates", {
            caseId: args.id,
            oldStatus: oldCase.status,
            newStatus: args.status,
            updateType: "MANUAL",
            summary: `Status changed to ${args.status}`,
            details: args.note,
            isAutomatic: false,
            notificationSent: false,
            createdAt: Date.now(),
        });
    },
});

import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("cases").collect();
    },
});
