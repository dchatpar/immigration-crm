
### ✅ Verification Checklist

This checklist tracks the verification of the Immigration CRM system's core functionalities.

#### 1. System Health
- [x] Database connection (PostgreSQL/Prisma)
- [x] Environment variables configuration
- [x] API Health Check endpoint (`/api/health`)

#### 2. Core Workflow (18 Turns)
- [ ] **Turn 1-2:** Call Recording & Lead Creation
  - [ ] Twilio webhook receives call
  - [ ] Lead created in database
  - [ ] "New" status assigned
- [ ] **Turn 3-4:** Appointment Scheduling
  - [ ] Appointment created via API/UI
  - [ ] Confirmation email sent
  - [ ] Calendar view updates
- [ ] **Turn 5-8:** Onboarding & Documents
  - [ ] Welcome email sent
  - [ ] Document request trigger
  - [ ] Customer uploads via portal
  - [ ] Admin approves document
- [ ] **Turn 9-18:** Case Management
  - [ ] Case created from lead
  - [ ] Workflow template applied
  - [ ] Status updates trigger notifications
  - [ ] Passport expiry check runs
  - [ ] Weekly status update job runs

#### 3. Admin Controls
- [ ] System settings update (API/UI)
- [ ] Workflow template creation
- [ ] Reminder rule configuration

#### 4. Customer Portal
- [ ] Token generation
- [ ] Token validation
- [ ] Secure file upload
