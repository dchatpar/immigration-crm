import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const seed = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Check if data already exists to avoid duplicates
        const existingUsers = await ctx.db.query("users").take(1);
        if (existingUsers.length > 0) {
            console.log("Data already exists. Skipping seed.");
            return;
        }

        // 1. Create a Workflow Template
        const templateId = await ctx.db.insert("workflowTemplates", {
            name: "Standard H-1B Process",
            serviceType: "H1B",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // 1b. Create Workflow Steps
        const steps = [
            { order: 1, title: "Initial Consultation", type: "MEETING" },
            { order: 2, title: "Service Agreement", type: "DOCUMENT" },
            { order: 3, title: "Questionnaire", type: "FORM" },
            { order: 4, title: "Document Collection", type: "DOCUMENT" },
            { order: 5, title: "LCA Filing", type: "ACTION" },
            { order: 6, title: "LCA Certification", type: "WAIT" },
            { order: 7, title: "Petition Drafting", type: "ACTION" },
            { order: 8, title: "Employer Review", type: "REVIEW" },
            { order: 9, title: "Employee Review", type: "REVIEW" },
            { order: 10, title: "Final Signatures", type: "DOCUMENT" },
            { order: 11, title: "Petition Filing", type: "ACTION" },
            { order: 12, title: "Receipt Notice", type: "WAIT" },
            { order: 13, title: "RFE Check", type: "DECISION" },
            { order: 14, title: "Approval Notice", type: "WAIT" },
            { order: 15, title: "Consular Processing", type: "ACTION" },
            { order: 16, title: "Visa Stamping", type: "WAIT" },
            { order: 17, title: "Travel Coordination", type: "ACTION" },
            { order: 18, title: "Onboarding", type: "COMPLETE" },
        ];

        for (const step of steps) {
            await ctx.db.insert("workflowSteps", {
                templateId,
                stepOrder: step.order,
                stepName: step.title,
                stepType: step.type,
                config: "{}",
            });
        }

        // 2. Create a User
        const userId = await ctx.db.insert("users", {
            name: "Demo Admin",
            email: "admin@example.com",
            role: "ADMIN",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // Password hash handled by auth provider
        });

        // 3. Create a Lead
        const leadId = await ctx.db.insert("leads", {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1234567890",
            status: "NEW",
            priority: "MEDIUM",
            source: "Website",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // 4. Create a Case
        const caseId = await ctx.db.insert("cases", {
            caseNumber: "CASE-2024-001",
            leadId,
            clientFirstName: "Alice",
            clientLastName: "Smith",
            clientEmail: "alice.smith@example.com",
            clientPhone: "+1987654321",
            serviceType: "H1B",
            serviceTier: "STANDARD",
            status: "INITIATED",
            priority: "MEDIUM",
            assignedToId: userId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            workflowId: templateId,
            currentStep: 1, // Start at step 1
            passportNumber: "A12345678",
            passportExpiryDate: Date.now() + 100 * 24 * 60 * 60 * 1000, // 100 days from now
        });

        // 5. Create Appointments
        await ctx.db.insert("appointments", {
            caseId,
            title: "Initial Consultation",
            description: "Discuss case details",
            appointmentType: "CONSULTATION",
            scheduledAt: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
            duration: 60,
            endTime: Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
            status: "SCHEDULED",
            location: "Zoom",
            reminderSent: false,
            confirmationSent: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // 6. Create Documents
        await ctx.db.insert("documents", {
            caseId,
            fileName: "passport_copy.pdf",
            storageId: "storage-id-placeholder", // Placeholder
            uploadedAt: Date.now(),
            status: "APPROVED",
            documentType: "PASSPORT",
            category: "IDENTITY",
            fileSize: 1024 * 1024,
            mimeType: "application/pdf",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // 7. Create Activities
        await ctx.db.insert("activities", {
            caseId,
            userId,
            type: "NOTE",
            action: "CREATED",
            description: "Initial case setup completed.",
            createdAt: Date.now(),
        });

        // 8. Create Customer Portal Token
        await ctx.db.insert("customerPortalTokens", {
            caseId,
            token: "demo-token-123",
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            createdAt: Date.now(),
            isActive: true,
        });

        console.log("Seed data created successfully!");
    },
});
