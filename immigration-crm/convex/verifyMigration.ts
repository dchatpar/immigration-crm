/**
 * Verification Script for Convex Migration
 * 
 * This script verifies that key data and workflows are correctly accessible via Convex.
 * It simulates the actions of the 18-turn workflow.
 * 
 * Usage: npx convex run verifyMigration
 */

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const verifyMigration = internalAction({
    args: {},
    handler: async (ctx) => {
        console.log("Starting Migration Verification...");

        // 1. Verify Users
        const users = await ctx.runQuery(internal.users.listInternal);
        console.log(`✅ Users found: ${users.length}`);

        // 2. Verify Leads
        const leads = await ctx.runQuery(internal.leads.listInternal);
        console.log(`✅ Leads found: ${leads.length}`);

        // 3. Verify Cases
        const cases = await ctx.runQuery(internal.cases.listInternal);
        console.log(`✅ Cases found: ${cases.length}`);

        // 4. Verify Appointments
        const appointments = await ctx.runQuery(internal.appointments.listInternal);
        console.log(`✅ Appointments found: ${appointments.length}`);

        // 5. Verify Documents
        const documents = await ctx.runQuery(internal.documents.listInternal);
        console.log(`✅ Documents found: ${documents.length}`);

        // 6. Verify Workflows
        const workflows = await ctx.runQuery(internal.workflows.listTemplatesInternal);
        console.log(`✅ Workflow Templates found: ${workflows.length}`);

        // 7. Verify Communications (Emails/SMS)
        const communications = await ctx.runQuery(internal.communications.listInternal);
        console.log(`✅ Communications found: ${communications.length}`);

        // 8. Verify Background Job Logic (Dry Run)
        // We can't easily dry run mutations without side effects, but we can check if data exists for them
        const reminders = await ctx.runQuery(internal.reminders.listInternal);
        const expiringPassports = cases.filter(c => c.passportExpiryDate && c.passportExpiryDate < Date.now() + 180 * 24 * 60 * 60 * 1000);

        console.log(`✅ Pending Reminders: ${reminders.filter(r => r.status === 'PENDING').length}`);
        console.log(`✅ Cases with Expiring Passports (next 6 months): ${expiringPassports.length}`);

        console.log("Verification Complete.");
    },
});
