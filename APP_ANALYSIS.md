# Immigration CRM - Application Analysis

## Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Radix UI
- **Backend**: Convex (serverless database & functions)
- **Auth**: NextAuth.js with credentials provider
- **External Services**: Twilio (SMS), SendGrid (Email)
- **Database**: SQLite (dev) / Convex (production)

## Key Features

| Module | Functionality |
|--------|---------------|
| Cases | Immigration case tracking with workflow automation |
| Leads | Lead management (NEW → CONTACTED → QUALIFIED → CONVERTED → LOST) |
| Documents | Upload, track, and manage case documents with AI summarization |
| Appointments | Scheduling with reminders and calendar integration |
| Communications | Email/SMS tracking via SendGrid & Twilio |
| Workflows | Automated step-based case workflows |
| Analytics | Performance metrics and reporting |
| Reminders | Automated cron-based reminders for case deadlines |
| Portal | Client-facing portal with secure token access |
| Audit Logs | Full action tracking for compliance |

## Data Models (18 Convex tables)
- users, leads, cases, appointments, documents
- communications, reminders, activities, notifications
- workflowTemplates, workflowSteps, welcomeKits
- documentComments, documentVersions, statusUpdates, notes
- auditLogs, systemSettings, customerPortalTokens

## Routes
- / - Landing page
- /auth/login, /auth/register - Auth pages
- /dashboard/* - Main app (cases, leads, documents, appointments, analytics, settings)
- /portal/[token] - Client portal

## Security Issues
1. Hardcoded credentials in src/lib/auth.ts - admin@example.com / admin123
2. Weak JWT secrets in .env - "development-*-secret-key-change-in-production"
3. No production database - Uses SQLite file

## Project Location
/home/claudeuser/immigration/immigration-crm
