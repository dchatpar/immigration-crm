import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Process Pending Reminders
 * Sends email/SMS for reminders that are due
 */
export const processPendingReminders = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        // Get all pending reminders that are due
        const dueReminders = await ctx.db
            .query("reminders")
            .withIndex("by_scheduledFor_status", (q) =>
                q.lt("scheduledFor", now)
            )
            .filter((q) => q.eq(q.field("status"), "PENDING"))
            .collect();

        console.log(`[Reminder Job] Found ${dueReminders.length} due reminders`);

        for (const reminder of dueReminders) {
            const caseRecord = await ctx.db.get(reminder.caseId);
            if (!caseRecord) continue;

            // Create communication record for email
            if (caseRecord.clientEmail) {
                await ctx.db.insert("communications", {
                    caseId: reminder.caseId,
                    type: "REMINDER",
                    channel: "EMAIL",
                    direction: "OUTBOUND",
                    subject: reminder.title,
                    body: `Dear ${caseRecord.clientFirstName} ${caseRecord.clientLastName},\n\nThis is a reminder regarding your case ${caseRecord.caseNumber}.\n\n${reminder.title}\n\n${reminder.description || ""}\n\nPlease contact us if you have any questions.\n\nBest regards,\nImmigration Services Team`,
                    to: caseRecord.clientEmail,
                    status: "PENDING",
                    createdAt: now,
                });
            }

            // Create communication record for SMS if phone exists
            if (caseRecord.clientPhone) {
                await ctx.db.insert("communications", {
                    caseId: reminder.caseId,
                    type: "REMINDER",
                    channel: "SMS",
                    direction: "OUTBOUND",
                    body: `Reminder: ${reminder.title}. Case: ${caseRecord.caseNumber}. Please contact us for details.`,
                    to: caseRecord.clientPhone,
                    status: "PENDING",
                    createdAt: now,
                });
            }

            // Mark reminder as sent
            await ctx.db.patch(reminder._id, {
                status: "SENT",
                executedAt: now,
            });

            // Handle recurring reminders
            if (reminder.isRecurring && reminder.recurrenceRule) {
                let nextScheduledDate = new Date(reminder.scheduledFor);
                if (reminder.recurrenceRule === "DAILY") {
                    nextScheduledDate.setDate(nextScheduledDate.getDate() + 1);
                } else if (reminder.recurrenceRule === "WEEKLY") {
                    nextScheduledDate.setDate(nextScheduledDate.getDate() + 7);
                } else if (reminder.recurrenceRule === "MONTHLY") {
                    nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 1);
                }

                await ctx.db.insert("reminders", {
                    caseId: reminder.caseId,
                    type: reminder.type,
                    title: reminder.title,
                    description: reminder.description,
                    scheduledFor: nextScheduledDate.getTime(),
                    isRecurring: true,
                    recurrenceRule: reminder.recurrenceRule,
                    status: "PENDING",
                    createdAt: now,
                    updatedAt: now,
                    retryCount: 0,
                });
            }
        }
    },
});

/**
 * Check Passport Expiry
 * Creates reminders for passports expiring soon
 */
export const checkPassportExpiry = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const sixMonthsFromNow = now + 6 * 30 * 24 * 60 * 60 * 1000;

        // Scan all cases (might be inefficient for large DB, but okay for migration)
        // Ideally use index on passportExpiryDate, but our index is by caseNumber/status/email
        // To optimize, we should add an index on passportExpiryDate
        const cases = await ctx.db.query("cases").collect();

        const expiringCases = cases.filter(
            (c) =>
                c.passportExpiryDate &&
                c.passportExpiryDate >= now &&
                c.passportExpiryDate <= sixMonthsFromNow &&
                !["COMPLETED", "CANCELLED"].includes(c.status)
        );

        console.log(`[Passport Job] Found ${expiringCases.length} cases with expiring passports`);

        for (const caseRecord of expiringCases) {
            // Check if reminder already exists
            const existingReminder = await ctx.db
                .query("reminders")
                .withIndex("by_caseId", (q) => q.eq("caseId", caseRecord._id))
                .filter((q) => q.eq(q.field("type"), "PASSPORT_EXPIRY"))
                .first(); // Simplified check (original checked status IN PENDING, SENT)

            if (!existingReminder) {
                await ctx.db.insert("reminders", {
                    caseId: caseRecord._id,
                    type: "PASSPORT_EXPIRY",
                    title: "Passport Expiring Soon",
                    description: `Your passport (${caseRecord.passportNumber}) will expire on ${new Date(caseRecord.passportExpiryDate!).toLocaleDateString()}. Please renew it as soon as possible.`,
                    scheduledFor: now,
                    status: "PENDING",
                    createdAt: now,
                    updatedAt: now,
                    retryCount: 0,
                    isRecurring: false
                });
                console.log(`[Passport Job] Created reminder for case ${caseRecord.caseNumber}`);
            }
        }
    },
});

/**
 * Send Weekly Status Updates
 * Sends weekly progress updates to all active cases
 */
export const sendWeeklyStatusUpdates = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        const oneWeekAgo = now - oneWeekMs;
        const oneWeekFromNow = now + oneWeekMs;

        // Get active cases
        const activeCases = (await ctx.db.query("cases").collect()).filter(c =>
            ['INITIATED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'IN_PROGRESS', 'APPLICATION_SUBMITTED'].includes(c.status)
        );

        console.log(`[Weekly Update Job] Processing ${activeCases.length} active cases`);

        for (const caseRecord of activeCases) {
            // Fetch updates
            const updates = await ctx.db.query("statusUpdates")
                .withIndex("by_caseId_createdAt", q => q.eq("caseId", caseRecord._id).gte("createdAt", oneWeekAgo))
                .collect();

            const documents = await ctx.db.query("documents")
                .withIndex("by_caseId_status", q => q.eq("caseId", caseRecord._id))
                .filter(q => q.gte(q.field("uploadedAt"), oneWeekAgo))
                .collect();

            const appointments = await ctx.db.query("appointments")
                .withIndex("by_caseId_scheduledAt", q => q.eq("caseId", caseRecord._id).gte("scheduledAt", now))
                .filter(q => q.lte(q.field("scheduledAt"), oneWeekFromNow))
                .collect(); // Filter futher in memory if needed for status

            const hasActivity = updates.length > 0 || documents.length > 0 || appointments.length > 0;

            if (hasActivity) {
                let summary = `Weekly Update for Case ${caseRecord.caseNumber}\n\n`;
                summary += `Current Status: ${caseRecord.status.replace(/_/g, ' ')}\n\n`;

                if (updates.length > 0) {
                    summary += `Recent Updates:\n`;
                    updates.forEach(u => summary += `- ${u.summary}\n`);
                    summary += '\n';
                }

                if (documents.length > 0) {
                    summary += `Documents Uploaded This Week: ${documents.length}\n\n`;
                }

                if (appointments.length > 0) {
                    summary += `Upcoming Appointments:\n`;
                    appointments.forEach(apt => {
                        summary += `- ${apt.title} on ${new Date(apt.scheduledAt).toLocaleDateString()}\n`;
                    });
                    summary += '\n';
                }

                summary += `If you have any questions, please don't hesitate to contact us.\n\nBest regards,\nImmigration Services Team`;

                await ctx.db.insert("communications", {
                    caseId: caseRecord._id,
                    type: "STATUS_UPDATE",
                    channel: "EMAIL",
                    direction: "OUTBOUND",
                    subject: `Weekly Update - Case ${caseRecord.caseNumber}`,
                    body: summary,
                    to: caseRecord.clientEmail,
                    status: "PENDING",
                    createdAt: now
                });
            }
        }
    }
});
