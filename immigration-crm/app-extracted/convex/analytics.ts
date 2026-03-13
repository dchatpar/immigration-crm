import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardData = query({
    args: {
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
        const startDate = args.startDate || thirtyDaysAgo;
        const endDate = args.endDate || now;

        const leads = await ctx.db.query("leads").collect();
        const cases = await ctx.db.query("cases").collect();
        const documents = await ctx.db.query("documents").collect();
        const appointments = await ctx.db.query("appointments").collect();
        const reminders = await ctx.db.query("reminders").collect();
        const activities = await ctx.db.query("activities").order("desc").take(20);

        // Calculate metrics
        const totalLeads = leads.length;
        const newLeadsThisMonth = leads.filter(l => l.createdAt >= startDate).length;
        const totalCases = cases.length;
        const activeCases = cases.filter(c => ['INITIATED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'IN_PROGRESS'].includes(c.status)).length;
        const completedCases = cases.filter(c => c.status === 'COMPLETED').length;

        // Conversion rate
        const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

        // Avg processing time
        const completedCasesWithDates = cases.filter(c => c.status === 'COMPLETED' && c.actualCompletionDate && c.createdAt);
        let avgProcessingDays = 0;
        if (completedCasesWithDates.length > 0) {
            const totalDays = completedCasesWithDates.reduce((sum, c) => {
                const days = Math.floor((c.actualCompletionDate! - c.createdAt) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0);
            avgProcessingDays = Math.round(totalDays / completedCasesWithDates.length);
        }

        // Alerts
        const pendingDocuments = documents.filter(d => d.status === 'PENDING').length;
        const upcomingAppointments = appointments.filter(a => a.scheduledAt >= now && a.scheduledAt <= now + 7 * 24 * 60 * 60 * 1000 && a.status === 'SCHEDULED').length;
        const overdueReminders = reminders.filter(r => r.scheduledFor < now && r.status === 'PENDING').length;

        // Charts data
        const leadsBySourceMap = new Map<string, number>();
        leads.forEach(l => leadsBySourceMap.set(l.source, (leadsBySourceMap.get(l.source) || 0) + 1));
        const leadsBySource = Array.from(leadsBySourceMap.entries()).map(([source, count]) => ({ source, count }));

        const casesByStatusMap = new Map<string, number>();
        cases.forEach(c => casesByStatusMap.set(c.status, (casesByStatusMap.get(c.status) || 0) + 1));
        const casesByStatus = Array.from(casesByStatusMap.entries()).map(([status, count]) => ({ status, count }));

        const casesByServiceTypeMap = new Map<string, number>();
        cases.forEach(c => casesByServiceTypeMap.set(c.serviceType, (casesByServiceTypeMap.get(c.serviceType) || 0) + 1));
        const casesByServiceType = Array.from(casesByServiceTypeMap.entries()).map(([serviceType, count]) => ({ serviceType, count }));

        // Enrich activities
        const enrichedActivities = await Promise.all(activities.map(async (act) => {
            let user = null;
            let caseData = null;
            let leadData = null;

            if (act.userId) user = await ctx.db.get(act.userId);
            if (act.caseId) caseData = await ctx.db.get(act.caseId);
            if (act.leadId) leadData = await ctx.db.get(act.leadId);

            return {
                ...act,
                user: user ? { id: user._id, name: user.name } : undefined,
                case: caseData ? { id: caseData._id, caseNumber: caseData.caseNumber } : undefined,
                lead: leadData ? { id: leadData._id, firstName: leadData.firstName, lastName: leadData.lastName } : undefined,
            };
        }));

        return {
            summary: {
                totalLeads,
                newLeadsThisMonth,
                totalCases,
                activeCases,
                completedCases,
                conversionRate: Math.round(conversionRate * 10) / 10,
                avgProcessingDays,
            },
            alerts: {
                pendingDocuments,
                upcomingAppointments,
                overdueReminders,
            },
            charts: {
                leadsBySource,
                casesByStatus,
                casesByServiceType,
            },
            recentActivities: enrichedActivities,
        };
    },
});
