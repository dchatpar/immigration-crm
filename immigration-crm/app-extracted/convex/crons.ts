import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "process-reminders",
    { minutes: 15 }, // Run every 15 minutes
    internal.jobs.processPendingReminders
);

crons.daily(
    "check-passport-expiry",
    { hourUTC: 12, minuteUTC: 0 },
    internal.jobs.checkPassportExpiry
);

crons.weekly(
    "weekly-status-updates",
    { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
    internal.jobs.sendWeeklyStatusUpdates
);

export default crons;
