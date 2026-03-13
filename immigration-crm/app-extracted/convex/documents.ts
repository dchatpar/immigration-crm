import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const save = mutation({
    args: {
        caseId: v.id("cases"),
        storageId: v.string(), // ID returned from storage upload
        fileName: v.string(),
        fileSize: v.number(),
        mimeType: v.string(),
        documentType: v.string(), // "Passport", "Visa", "Form", etc.
        category: v.string(),     // "Legal", "Personal", "Correspondence"
    },
    handler: async (ctx, args) => {
        const docId = await ctx.db.insert("documents", {
            ...args,
            status: "PENDING",
            uploadedAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return docId;
    },
});

export const list = query({
    args: {
        caseId: v.optional(v.id("cases")),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let docs;
        if (args.caseId) {
            docs = await ctx.db
                .query("documents")
                .withIndex("by_caseId_status", (q) => q.eq("caseId", args.caseId!))
                .collect();
        } else {
            docs = await ctx.db.query("documents").collect();
        }

        if (args.status) {
            docs = docs.filter(d => d.status === args.status);
        }

        // Enrich with URL and Case details
        return await Promise.all(
            docs.map(async (doc) => {
                const url = doc.storageId && !doc.storageId.includes('placeholder')
                    ? await ctx.storage.getUrl(doc.storageId)
                    : null;
                const caseData = await ctx.db.get(doc.caseId);
                let caseDetails = null;

                if (caseData) {
                    caseDetails = {
                        id: caseData._id,
                        caseNumber: caseData.caseNumber,
                        clientFirstName: caseData.clientFirstName,
                        clientLastName: caseData.clientLastName,
                    };
                }

                // Mock comments for now or fetch if we had a comments table
                // For this migration, we'll return empty or simple logical check
                // In real app, we'd query("comments").withIndex("by_documentId"...)

                return {
                    ...doc,
                    url,
                    case: caseDetails,
                    comments: [] // Placeholder
                };
            })
        );
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("documents"),
        status: v.string(), // "APPROVED", "REJECTED"
        reviewedById: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: args.status,
            reviewedById: args.reviewedById,
            reviewedAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

import { internalQuery } from "./_generated/server";

export const listInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("documents").collect();
    },
});
