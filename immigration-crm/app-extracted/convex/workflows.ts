import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const listTemplates = query({
    handler: async (ctx) => {
        return await ctx.db.query("workflowTemplates").collect();
    },
});

export const getTemplateWithSteps = query({
    args: { templateId: v.id("workflowTemplates") },
    handler: async (ctx, args) => {
        const template = await ctx.db.get(args.templateId);
        if (!template) return null;

        const steps = await ctx.db
            .query("workflowSteps")
            .withIndex("by_templateId_stepOrder", (q) => q.eq("templateId", args.templateId))
            .collect();

        // Sort steps explicitly
        steps.sort((a, b) => a.stepOrder - b.stepOrder);

        return { ...template, steps };
    },
});

// Trigger a workflow for a case
export const trigger = mutation({
    args: {
        caseId: v.id("cases"),
        templateId: v.id("workflowTemplates"),
    },
    handler: async (ctx, args) => {
        const template = await ctx.db.get(args.templateId);
        if (!template) throw new Error("Template not found");

        await ctx.db.patch(args.caseId, {
            workflowId: args.templateId,
            currentStep: 1,
            updatedAt: Date.now(),
        });

        // Log activity
        await ctx.db.insert("activities", {
            caseId: args.caseId,
            type: "WORKFLOW",
            action: "TRIGGERED",
            description: `Workflow '${template.name}' started`,
            createdAt: Date.now(),
        });
    },
});

export const advanceStep = mutation({
    args: {
        caseId: v.id("cases"),
    },
    handler: async (ctx, args) => {
        const caseRecord = await ctx.db.get(args.caseId);
        if (!caseRecord || !caseRecord.currentStep || !caseRecord.workflowId) {
            throw new Error("Invalid case or workflow not started");
        }

        const currentStep = caseRecord.currentStep;

        // Find next step
        const nextStep = await ctx.db
            .query("workflowSteps")
            .withIndex("by_templateId_stepOrder", (q) =>
                q.eq("templateId", caseRecord.workflowId!).eq("stepOrder", currentStep + 1)
            )
            .first();

        if (nextStep) {
            await ctx.db.patch(args.caseId, {
                currentStep: nextStep.stepOrder,
                updatedAt: Date.now(),
            });

            await ctx.db.insert("activities", {
                caseId: args.caseId,
                type: "WORKFLOW",
                action: "ADVANCED",
                description: `Advanced to step: ${nextStep.stepName}`,
                createdAt: Date.now(),
            });

            return { completed: false, nextStep: nextStep.stepName };
        } else {
            // No next step, mark complete if not already
            await ctx.db.patch(args.caseId, {
                status: "COMPLETED",
                updatedAt: Date.now(),
            });

            await ctx.db.insert("activities", {
                caseId: args.caseId,
                type: "WORKFLOW",
                action: "COMPLETED",
                description: "Workflow completed",
                createdAt: Date.now(),
            });

            return { completed: true };
        }
    },
});

export const listTemplatesInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("workflowTemplates").collect();
    },
});
