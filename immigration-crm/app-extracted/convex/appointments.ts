import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        caseId: v.optional(v.id("cases")),
        from: v.optional(v.number()),
        to: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let appointments;

        if (args.caseId) {
            appointments = await ctx.db
                .query("appointments")
                .withIndex("by_caseId_scheduledAt", (q) => q.eq("caseId", args.caseId!))
                .collect();
            // Filter by range if needed
            if (args.from) appointments = appointments.filter(a => a.scheduledAt >= args.from!);
            if (args.to) appointments = appointments.filter(a => a.scheduledAt <= args.to!);
        } else {
            // Global calendar view
            appointments = await ctx.db.query("appointments").collect();
            if (args.from) appointments = appointments.filter(a => a.scheduledAt >= args.from!);
            if (args.to) appointments = appointments.filter(a => a.scheduledAt <= args.to!);
        }

        // Enrich with case details
        return await Promise.all(
            appointments.map(async (apt) => {
                let caseDetails = null;
                // If caseId is present (it should be)
                const caseData = await ctx.db.get(apt.caseId);
                if (caseData) {
                    caseDetails = {
                        id: caseData._id,
                        caseNumber: caseData.caseNumber,
                        clientFirstName: caseData.clientFirstName,
                        clientLastName: caseData.clientLastName,
                    };
                }

                return {
                    ...apt,
                    case: caseDetails,
                };
            })
        );
    },
});

export const create = mutation({
    args: {
        caseId: v.id("cases"),
        title: v.string(),
        description: v.optional(v.string()),
        appointmentType: v.string(),
        scheduledAt: v.number(),
        duration: v.number(),
        location: v.optional(v.string()),
        meetingLink: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const endTime = args.scheduledAt + (args.duration * 60 * 1000);

        const appointmentId = await ctx.db.insert("appointments", {
            ...args,
            status: "SCHEDULED",
            endTime,
            reminderSent: false,
            confirmationSent: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return appointmentId;
    },
});

export const update = mutation({
    args: {
        id: v.id("appointments"),
        status: v.optional(v.string()), // "SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"
        rescheduleTo: v.optional(v.number()),
        meetingSummary: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const updates: any = { updatedAt: Date.now() };
        if (args.status) updates.status = args.status;
        if (args.meetingSummary) updates.meetingSummary = args.meetingSummary;

        if (args.status === "COMPLETED") updates.completedAt = Date.now();

        if (args.rescheduleTo) {
            const oldAppt = await ctx.db.get(args.id);
            if (oldAppt && oldAppt.duration) {
                updates.scheduledAt = args.rescheduleTo;
                updates.endTime = args.rescheduleTo + (oldAppt.duration * 60 * 1000);
                updates.status = "RESCHEDULED";
            }
        }

        await ctx.db.patch(args.id, updates);
    },
});

import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("appointments").collect();
    },
});
