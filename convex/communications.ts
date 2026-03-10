import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";

export const log = mutation({
    args: {
        caseId: v.id("cases"),
        type: v.string(), // "EMAIL", "SMS"
        channel: v.string(),
        direction: v.string(),
        subject: v.optional(v.string()),
        body: v.string(),
        from: v.optional(v.string()),
        to: v.optional(v.string()),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("communications", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const list = query({
    args: { caseId: v.id("cases") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("communications")
            .withIndex("by_caseId_type", (q) => q.eq("caseId", args.caseId))
            .order("desc")
            .collect();
    },
});

// Action to send email via SendGrid (needs API key)
export const sendEmail = action({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
        caseId: v.id("cases"),
    },
    handler: async (ctx, args) => {
        // In a real implementation:
        // import sgMail from '@sendgrid/mail';
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // await sgMail.send({...});

        console.log(`Sending email to ${args.to}: ${args.subject}`);

        // Log success
        await ctx.runMutation(api.communications.log, {
            caseId: args.caseId,
            type: "EMAIL",
            channel: "SENDGRID",
            direction: "OUTBOUND",
            subject: args.subject,
            body: args.html, // Or a snippet
            to: args.to,
            status: "SENT",
        });

        return true;
    },
});

import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("communications").collect();
    },
});
