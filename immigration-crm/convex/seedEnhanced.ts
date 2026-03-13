import { internalMutation } from "./_generated/server";

export const seedEnhanced = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Clear existing data first
        const users = await ctx.db.query("users").collect();
        for (const user of users) {
            await ctx.db.delete(user._id);
        }

        const leads = await ctx.db.query("leads").collect();
        for (const lead of leads) {
            await ctx.db.delete(lead._id);
        }

        const cases = await ctx.db.query("cases").collect();
        for (const caseItem of cases) {
            await ctx.db.delete(caseItem._id);
        }

        // Create Users
        const adminId = await ctx.db.insert("users", {
            name: "Demo Admin",
            email: "admin@example.com",
            role: "ADMIN",
            isActive: true,
            password: "admin123",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        const agentId = await ctx.db.insert("users", {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            role: "AGENT",
            department: "H1B Team",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        const managerId = await ctx.db.insert("users", {
            name: "Michael Chen",
            email: "michael@example.com",
            role: "MANAGER",
            department: "Operations",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Create Workflow Templates
        const h1bTemplateId = await ctx.db.insert("workflowTemplates", {
            name: "Standard H-1B Process",
            serviceType: "H1B",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        const greenCardTemplateId = await ctx.db.insert("workflowTemplates", {
            name: "EB-2 Green Card Process",
            serviceType: "GREEN_CARD",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Create Workflow Steps for H1B
        const h1bSteps = [
            { order: 1, title: "Initial Consultation", type: "MEETING", duration: 3 },
            { order: 2, title: "Service Agreement", type: "DOCUMENT", duration: 2 },
            { order: 3, title: "Questionnaire", type: "FORM", duration: 5 },
            { order: 4, title: "Document Collection", type: "DOCUMENT", duration: 7 },
            { order: 5, title: "LCA Filing", type: "ACTION", duration: 1 },
            { order: 6, title: "LCA Certification", type: "WAIT", duration: 7 },
            { order: 7, title: "Petition Drafting", type: "ACTION", duration: 10 },
            { order: 8, title: "Employer Review", type: "REVIEW", duration: 3 },
            { order: 9, title: "Employee Review", type: "REVIEW", duration: 2 },
            { order: 10, title: "Final Signatures", type: "DOCUMENT", duration: 2 },
            { order: 11, title: "Petition Filing", type: "ACTION", duration: 1 },
            { order: 12, title: "Receipt Notice", type: "WAIT", duration: 14 },
            { order: 13, title: "Approval Notice", type: "WAIT", duration: 90 },
            { order: 14, title: "Visa Stamping", type: "ACTION", duration: 30 },
        ];

        for (const step of h1bSteps) {
            await ctx.db.insert("workflowSteps", {
                templateId: h1bTemplateId,
                stepOrder: step.order,
                stepName: step.title,
                stepType: step.type,
                config: JSON.stringify({ estimatedDays: step.duration }),
            });
        }

        // Create Leads (10 leads with various statuses)
        const leadData = [
            { firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1234567890", status: "NEW", priority: "HIGH", source: "Website" },
            { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", phone: "+1234567891", status: "CONTACTED", priority: "MEDIUM", source: "Referral" },
            { firstName: "Robert", lastName: "Johnson", email: "robert.j@example.com", phone: "+1234567892", status: "QUALIFIED", priority: "HIGH", source: "LinkedIn" },
            { firstName: "Maria", lastName: "Garcia", email: "maria.g@example.com", phone: "+1234567893", status: "NEW", priority: "LOW", source: "Facebook" },
            { firstName: "David", lastName: "Lee", email: "david.lee@example.com", phone: "+1234567894", status: "CONVERTED", priority: "HIGH", source: "Website" },
            { firstName: "Emily", lastName: "Brown", email: "emily.b@example.com", phone: "+1234567895", status: "CONTACTED", priority: "MEDIUM", source: "Google Ads" },
            { firstName: "James", lastName: "Wilson", email: "james.w@example.com", phone: "+1234567896", status: "QUALIFIED", priority: "HIGH", source: "Referral" },
            { firstName: "Lisa", lastName: "Anderson", email: "lisa.a@example.com", phone: "+1234567897", status: "LOST", priority: "LOW", source: "Website" },
            { firstName: "Michael", lastName: "Taylor", email: "michael.t@example.com", phone: "+1234567898", status: "NEW", priority: "MEDIUM", source: "Instagram" },
            { firstName: "Sarah", lastName: "Martinez", email: "sarah.m@example.com", phone: "+1234567899", status: "CONTACTED", priority: "HIGH", source: "Website" },
        ];

        const leadIds = [];
        for (const lead of leadData) {
            const leadId = await ctx.db.insert("leads", {
                ...lead,
                createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random date in last 30 days
                updatedAt: Date.now(),
            });
            leadIds.push(leadId);
        }

        // Create Cases (5 active cases in different stages)
        const caseData = [
            {
                caseNumber: "CASE-2024-001",
                leadId: leadIds[4],
                clientFirstName: "David",
                clientLastName: "Lee",
                clientEmail: "david.lee@example.com",
                clientPhone: "+1234567894",
                serviceType: "H1B",
                serviceTier: "PREMIUM",
                status: "IN_PROGRESS",
                priority: "HIGH",
                assignedToId: agentId,
                workflowId: h1bTemplateId,
                currentStep: 7,
                passportNumber: "P12345678",
                passportExpiryDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
            },
            {
                caseNumber: "CASE-2024-002",
                leadId: leadIds[2],
                clientFirstName: "Robert",
                clientLastName: "Johnson",
                clientEmail: "robert.j@example.com",
                clientPhone: "+1234567892",
                serviceType: "H1B",
                serviceTier: "STANDARD",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                assignedToId: agentId,
                workflowId: h1bTemplateId,
                currentStep: 4,
                passportNumber: "P23456789",
                passportExpiryDate: Date.now() + 400 * 24 * 60 * 60 * 1000,
            },
            {
                caseNumber: "CASE-2024-003",
                leadId: leadIds[6],
                clientFirstName: "James",
                clientLastName: "Wilson",
                clientEmail: "james.w@example.com",
                clientPhone: "+1234567896",
                serviceType: "GREEN_CARD",
                serviceTier: "PREMIUM",
                status: "INITIATED",
                priority: "HIGH",
                assignedToId: managerId,
                workflowId: greenCardTemplateId,
                currentStep: 1,
                passportNumber: "P34567890",
                passportExpiryDate: Date.now() + 500 * 24 * 60 * 60 * 1000,
            },
            {
                caseNumber: "CASE-2024-004",
                leadId: leadIds[9],
                clientFirstName: "Sarah",
                clientLastName: "Martinez",
                clientEmail: "sarah.m@example.com",
                clientPhone: "+1234567899",
                serviceType: "H1B",
                serviceTier: "PREMIUM",
                status: "IN_PROGRESS",
                priority: "HIGH",
                assignedToId: agentId,
                workflowId: h1bTemplateId,
                currentStep: 11,
                passportNumber: "P45678901",
                passportExpiryDate: Date.now() + 200 * 24 * 60 * 60 * 1000,
            },
            {
                caseNumber: "CASE-2023-099",
                clientFirstName: "Alice",
                clientLastName: "Thompson",
                clientEmail: "alice.t@example.com",
                clientPhone: "+1234567800",
                serviceType: "H1B",
                serviceTier: "STANDARD",
                status: "APPROVED",
                priority: "LOW",
                assignedToId: agentId,
                workflowId: h1bTemplateId,
                currentStep: 14,
                passportNumber: "P56789012",
                passportExpiryDate: Date.now() + 600 * 24 * 60 * 60 * 1000,
            },
        ];

        const caseIds = [];
        for (const caseItem of caseData) {
            const caseId = await ctx.db.insert("cases", {
                ...caseItem,
                createdAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
                updatedAt: Date.now(),
            });
            caseIds.push(caseId);
        }

        // Create Appointments
        const appointmentData = [
            {
                caseId: caseIds[0],
                title: "Document Review Meeting",
                description: "Review collected documents for petition",
                appointmentType: "REVIEW",
                scheduledAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
                duration: 60,
                status: "SCHEDULED",
                location: "Zoom",
            },
            {
                caseId: caseIds[1],
                title: "Initial Consultation",
                description: "Discuss H1B process and timeline",
                appointmentType: "CONSULTATION",
                scheduledAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
                duration: 45,
                status: "SCHEDULED",
                location: "Office - Room 201",
            },
            {
                caseId: caseIds[3],
                title: "Petition Filing Review",
                description: "Final review before submission",
                appointmentType: "REVIEW",
                scheduledAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
                duration: 30,
                status: "COMPLETED",
                location: "Phone Call",
            },
        ];

        for (const appt of appointmentData) {
            await ctx.db.insert("appointments", {
                ...appt,
                endTime: appt.scheduledAt + appt.duration * 60 * 1000,
                reminderSent: false,
                confirmationSent: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        // Create Documents
        for (let i = 0; i < caseIds.length; i++) {
            await ctx.db.insert("documents", {
                caseId: caseIds[i],
                fileName: `passport_${i + 1}.pdf`,
                storageId: "demo-storage-placeholder", // Placeholder for demo
                uploadedAt: Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
                status: i % 2 === 0 ? "APPROVED" : "PENDING",
                documentType: "PASSPORT",
                category: "IDENTITY",
                fileSize: 1024 * 1024 * (i + 1),
                mimeType: "application/pdf",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await ctx.db.insert("documents", {
                caseId: caseIds[i],
                fileName: `resume_${i + 1}.pdf`,
                storageId: "demo-storage-placeholder",
                uploadedAt: Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
                status: "APPROVED",
                documentType: "RESUME",
                category: "PROFESSIONAL",
                fileSize: 512 * 1024,
                mimeType: "application/pdf",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        // Create Activities
        for (const caseId of caseIds) {
            await ctx.db.insert("activities", {
                caseId,
                userId: agentId,
                type: "NOTE",
                action: "CREATED",
                description: "Case initiated and assigned",
                createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
            });

            await ctx.db.insert("activities", {
                caseId,
                userId: agentId,
                type: "STATUS_CHANGE",
                action: "UPDATED",
                description: "Status updated to IN_PROGRESS",
                createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
            });
        }

        // Create Reminders
        await ctx.db.insert("reminders", {
            caseId: caseIds[0],
            type: "DOCUMENT",
            title: "Upload Employment Letter",
            description: "Please upload your employment letter",
            scheduledFor: Date.now() + 3 * 24 * 60 * 60 * 1000,
            status: "PENDING",
            retryCount: 0,
            isRecurring: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        await ctx.db.insert("reminders", {
            caseId: caseIds[1],
            type: "APPOINTMENT",
            title: "Upcoming Consultation",
            description: "Upcoming consultation meeting",
            scheduledFor: Date.now() + 5 * 24 * 60 * 60 * 1000,
            status: "PENDING",
            retryCount: 0,
            isRecurring: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Create Customer Portal Tokens
        for (let i = 0; i < caseIds.length; i++) {
            await ctx.db.insert("customerPortalTokens", {
                caseId: caseIds[i],
                token: `demo-token-${i + 1}`,
                expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
                createdAt: Date.now(),
                isActive: true,
            });
        }

        console.log("Enhanced seed data created successfully!");
        console.log(`Created ${leadIds.length} leads, ${caseIds.length} cases, and related data`);
    },
});
