import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const incomingCall = httpAction(async (ctx, request) => {
    const formData = await request.formData();
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const callStatus = formData.get("CallStatus") as string;

    // We need to call an internal mutation to update the DB
    await ctx.runMutation(internal.twilio.processIncomingCall, {
        callSid,
        from,
        to,
        callStatus,
    });

    // Return TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling. Your call is being recorded for quality assurance.</Say>
  <Record maxLength="600" action="/api/webhooks/twilio/recording-complete" /> 
  <Say>Thank you. We will contact you shortly.</Say>
</Response>`;

    return new Response(twiml, {
        status: 200,
        headers: {
            "Content-Type": "text/xml",
        },
    });
});

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const processIncomingCall = internalMutation({
    args: {
        callSid: v.string(),
        from: v.string(),
        to: v.string(),
        callStatus: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if lead exists
        const existingLead = await ctx.db
            .query("leads")
            .withIndex("by_phone", (q) => q.eq("phone", args.from))
            .first();

        let leadId;
        const now = Date.now();

        if (existingLead) {
            leadId = existingLead._id;
            await ctx.db.patch(existingLead._id, {
                status: "CONTACTED", // Update status logic as needed
                updatedAt: now,
            });
        } else {
            leadId = await ctx.db.insert("leads", {
                firstName: "Unknown",
                lastName: "Caller",
                phone: args.from,
                source: "INCOMING_CALL",
                status: "NEW",
                priority: "MEDIUM",
                createdAt: now,
                updatedAt: now,
            });
        }

        // Log activity
        await ctx.db.insert("activities", {
            leadId,
            type: "CALL_RECEIVED",
            action: "Incoming call received",
            description: `Call from ${args.from} (${args.callStatus})`,
            metadata: JSON.stringify(args),
            createdAt: now,
        });
    },
});
