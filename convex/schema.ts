import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        name: v.string(),
        password: v.optional(v.string()),
        role: v.string(), // "SUPER_ADMIN", "ADMIN", "Manager", "Case Officer"
        department: v.optional(v.string()),
        avatar: v.optional(v.string()),
        isActive: v.boolean(),
        lastLogin: v.optional(v.number()), // Unix timestamp
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_email", ["email"]),

    leads: defineTable({
        firstName: v.string(),
        lastName: v.string(),
        email: v.optional(v.string()),
        phone: v.string(),
        alternatePhone: v.optional(v.string()),
        source: v.string(),
        status: v.string(), // "NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"
        priority: v.string(),
        assignedToId: v.optional(v.id("users")),
        initialCallId: v.optional(v.id("callRecordings")),
        convertedToCaseId: v.optional(v.id("cases")),
        convertedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_status_assigned", ["status", "assignedToId"])
        .index("by_email", ["email"])
        .index("by_phone", ["phone"]),

    cases: defineTable({
        caseNumber: v.string(),
        leadId: v.optional(v.id("leads")),
        clientFirstName: v.string(),
        clientLastName: v.string(),
        clientEmail: v.string(),
        clientPhone: v.string(),
        dateOfBirth: v.optional(v.number()),
        nationality: v.optional(v.string()),
        serviceType: v.string(),
        serviceTier: v.string(),
        status: v.string(),
        priority: v.string(),
        assignedToId: v.id("users"),
        workflowId: v.optional(v.id("workflowTemplates")),
        currentStep: v.optional(v.number()), // Step order
        passportNumber: v.optional(v.string()),
        passportIssueDate: v.optional(v.number()),
        passportExpiryDate: v.optional(v.number()),
        applicationSubmittedAt: v.optional(v.number()),
        expectedCompletionDate: v.optional(v.number()),
        actualCompletionDate: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_caseNumber", ["caseNumber"])
        .index("by_status_assigned", ["status", "assignedToId"])
        .index("by_clientEmail", ["clientEmail"]),

    callRecordings: defineTable({
        leadId: v.optional(v.id("leads")),
        phoneNumber: v.string(),
        direction: v.string(),
        duration: v.number(),
        recordingUrl: v.string(),
        transcription: v.optional(v.string()),
        summary: v.optional(v.string()),
        sentiment: v.optional(v.string()),
        callStartedAt: v.number(),
        callEndedAt: v.number(),
        processedAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index("by_phoneNumber", ["phoneNumber"])
        .index("by_callStartedAt", ["callStartedAt"]),

    appointments: defineTable({
        caseId: v.id("cases"),
        title: v.string(),
        description: v.optional(v.string()),
        appointmentType: v.string(),
        status: v.string(),
        scheduledAt: v.number(),
        duration: v.number(), // minutes
        endTime: v.number(),
        location: v.optional(v.string()),
        meetingLink: v.optional(v.string()),
        completedAt: v.optional(v.number()),
        meetingSummary: v.optional(v.string()),
        voiceNote: v.optional(v.string()),
        reminderSent: v.boolean(),
        confirmationSent: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_caseId_scheduledAt", ["caseId", "scheduledAt"])
        .index("by_status", ["status"]),

    documents: defineTable({
        caseId: v.id("cases"),
        documentType: v.string(),
        category: v.string(),
        fileName: v.string(),
        storageId: v.string(), // Convex storage ID
        fileSize: v.number(),
        mimeType: v.string(),
        status: v.string(), // "PENDING", "APPROVED", "REJECTED"
        reviewedById: v.optional(v.id("users")),
        reviewedAt: v.optional(v.number()),
        uploadedAt: v.number(),
        expiryDate: v.optional(v.number()),
        extractedText: v.optional(v.string()),
        aiSummary: v.optional(v.string()),
        tags: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_caseId_status", ["caseId", "status"])
        .index("by_documentType", ["documentType"]),

    documentComments: defineTable({
        documentId: v.id("documents"),
        userId: v.id("users"),
        comment: v.string(),
        isInternal: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_documentId", ["documentId"]),

    documentVersions: defineTable({
        documentId: v.id("documents"),
        versionNumber: v.number(),
        storageId: v.string(),
        uploadedAt: v.number(),
    })
        .index("by_documentId", ["documentId"]),

    welcomeKits: defineTable({
        caseId: v.id("cases"),
        kitType: v.string(),
        dispatchedAt: v.optional(v.number()),
        trackingNumber: v.optional(v.string()),
        courier: v.optional(v.string()),
        shippingAddress: v.optional(v.string()),
        deliveryStatus: v.string(),
        deliveredAt: v.optional(v.number()),
        digitalAssets: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_caseId", ["caseId"]), // Unique constraint logically handled in app logic

    communications: defineTable({
        caseId: v.id("cases"),
        type: v.string(), // "EMAIL", "SMS"
        channel: v.string(),
        direction: v.string(), // "INBOUND", "OUTBOUND"
        subject: v.optional(v.string()),
        body: v.string(),
        from: v.optional(v.string()), // Combined fromEmail/fromPhone
        to: v.optional(v.string()),   // Combined toEmail/toPhone
        status: v.string(),
        sentAt: v.optional(v.number()),
        deliveredAt: v.optional(v.number()),
        readAt: v.optional(v.number()),
        attachments: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_caseId_type", ["caseId", "type"])
        .index("by_sentAt", ["sentAt"]),

    reminders: defineTable({
        caseId: v.id("cases"),
        type: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        scheduledFor: v.number(),
        status: v.string(),
        executedAt: v.optional(v.number()),
        failedAt: v.optional(v.number()),
        retryCount: v.number(),
        isRecurring: v.boolean(),
        recurrenceRule: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_scheduledFor_status", ["scheduledFor", "status"])
        .index("by_caseId", ["caseId"]),

    statusUpdates: defineTable({
        caseId: v.id("cases"),
        oldStatus: v.string(),
        newStatus: v.string(),
        updateType: v.string(),
        summary: v.string(),
        details: v.optional(v.string()),
        isAutomatic: v.boolean(),
        triggeredBy: v.optional(v.string()),
        notificationSent: v.boolean(),
        notifiedAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index("by_caseId_createdAt", ["caseId", "createdAt"]),

    activities: defineTable({
        userId: v.optional(v.id("users")),
        leadId: v.optional(v.id("leads")),
        caseId: v.optional(v.id("cases")),
        type: v.string(),
        action: v.string(),
        description: v.optional(v.string()),
        metadata: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_userId_createdAt", ["userId", "createdAt"])
        .index("by_caseId_createdAt", ["caseId", "createdAt"])
        .index("by_leadId_createdAt", ["leadId", "createdAt"]),

    notes: defineTable({
        leadId: v.optional(v.id("leads")),
        userId: v.id("users"),
        content: v.string(),
        isPinned: v.boolean(),
        isInternal: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_leadId_isPinned", ["leadId", "isPinned"]),

    notifications: defineTable({
        userId: v.id("users"),
        type: v.string(),
        title: v.string(),
        message: v.string(),
        actionUrl: v.optional(v.string()),
        metadata: v.optional(v.string()),
        isRead: v.boolean(),
        readAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index("by_userId_isRead", ["userId", "isRead"])
        .index("by_createdAt", ["createdAt"]),

    auditLogs: defineTable({
        userId: v.optional(v.id("users")),
        entityType: v.string(),
        entityId: v.string(),
        action: v.string(),
        oldValues: v.optional(v.string()),
        newValues: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_entity", ["entityType", "entityId"])
        .index("by_userId_createdAt", ["userId", "createdAt"]),

    workflowTemplates: defineTable({
        name: v.string(),
        serviceType: v.string(),
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    workflowSteps: defineTable({
        templateId: v.id("workflowTemplates"),
        stepOrder: v.number(),
        stepName: v.string(),
        stepType: v.string(),
        triggerCondition: v.optional(v.string()),
        delay: v.optional(v.number()),
        config: v.string(),
    })
        .index("by_templateId_stepOrder", ["templateId", "stepOrder"]),

    systemSettings: defineTable({
        key: v.string(),
        value: v.string(),
        category: v.string(),
        description: v.optional(v.string()),
        updatedAt: v.number(),
    })
        .index("by_key", ["key"]),

    customerPortalTokens: defineTable({
        caseId: v.id("cases"),
        token: v.string(),
        expiresAt: v.number(),
        isActive: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_token", ["token"])
        .index("by_caseId", ["caseId"]),
});
