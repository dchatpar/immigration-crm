import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Crypto is not available in Convex runtime in the same way, but we can use simple random string generation
function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const generatePortalToken = mutation({
    args: { caseId: v.id("cases") },
    handler: async (ctx, args) => {
        // Verify case exists
        const caseRecord = await ctx.db.get(args.caseId);
        if (!caseRecord) throw new Error("Case not found");

        const token = generateToken();
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

        await ctx.db.insert("customerPortalTokens", {
            caseId: args.caseId,
            token,
            expiresAt,
            isActive: true,
            createdAt: Date.now(),
        });

        // Send email (mock)
        // In real app, generate URL: `https://.../portal/${token}`
        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/portal/${token}`;

        // Log communication
        await ctx.db.insert("communications", {
            caseId: args.caseId,
            type: "GENERAL",
            channel: "EMAIL",
            direction: "OUTBOUND",
            subject: "Your Secure Document Upload Portal",
            body: `Dear ${caseRecord.clientFirstName},\n\nAccess your portal here: ${portalUrl}`,
            to: caseRecord.clientEmail,
            status: "PENDING",
            createdAt: Date.now()
        });

        return { token, portalUrl, expiresAt };
    },
});

export const verifyToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        const tokenRecord = await ctx.db
            .query("customerPortalTokens")
            .withIndex("by_token", (q) => q.eq("token", args.token))
            .first();

        if (!tokenRecord || !tokenRecord.isActive || tokenRecord.expiresAt < Date.now()) {
            return null;
        }

        const caseRecord = await ctx.db.get(tokenRecord.caseId);
        if (!caseRecord) return null;

        return {
            isValid: true,
            caseId: caseRecord._id,
            caseNumber: caseRecord.caseNumber,
            clientName: `${caseRecord.clientFirstName} ${caseRecord.clientLastName}`,
        };
    },
});
