# Database Schema Design

## Overview

This document outlines the complete database schema design for the Enterprise Immigration CRM System. The schema is designed to support all 18 customer journey touchpoints with robust data modeling for leads, cases, documents, communications, and automation.

## Core Entities

### 1. User Management

**User Model**
- Fields: id, email, name, role, department, avatar, isActive, lastLogin, createdAt, updatedAt
- Relationships: leads, activities, assignedCases, notifications, auditLogs
- Roles: SUPER_ADMIN, ADMIN, MANAGER, CASE_OFFICER, RECEPTIONIST, VIEWER

### 2. Lead Management

**Lead Model**
- Fields: id, firstName, lastName, email, phone, alternatePhone, source, status, priority, assignedToId, initialCallId, convertedToCaseId, convertedAt, capturedAt, notes, activities, createdAt, updatedAt
- Relationships: assignedTo (User), callRecording (CallRecording), convertedToCase (Case), notes, activities
- Source Types: INCOMING_CALL, WEBSITE, REFERRAL, WALK_IN, SOCIAL_MEDIA, ADVERTISEMENT, OTHER
- Status Types: NEW, CONTACTED, QUALIFIED, APPOINTMENT_SCHEDULED, CONVERTED, LOST, ARCHIVED

### 3. Case Management

**Case Model**
- Fields: id, caseNumber, clientFirstName, clientLastName, clientEmail, clientPhone, dateOfBirth, nationality, serviceType, serviceTier, status, priority, assignedToId, passportNumber, passportIssueDate, passportExpiryDate, applicationSubmittedAt, expectedCompletionDate, actualCompletionDate, createdAt, updatedAt
- Relationships: lead, assignedTo (User), appointments, documents, communications, activities, reminders, statusUpdates, welcomeKit
- Service Types: VISITOR_VISA, STUDENT_VISA, WORK_PERMIT, PERMANENT_RESIDENCE, CITIZENSHIP, FAMILY_SPONSORSHIP, BUSINESS_IMMIGRATION, REFUGEE_CLAIM, OTHER
- Service Tiers: STANDARD, GOLD, PLATINUM, VIP
- Status Types: INITIATED, DOCUMENTS_PENDING, DOCUMENTS_RECEIVED, UNDER_REVIEW, APPLICATION_PREPARATION, SUBMITTED, IN_PROGRESS, ADDITIONAL_INFO_REQUIRED, APPROVED, REJECTED, COMPLETED, ARCHIVED

### 4. Call Recording

**CallRecording Model**
- Fields: id, phoneNumber, direction, duration, recordingUrl, transcription, summary, sentiment, callStartedAt, callEndedAt, processedAt, createdAt
- Relationships: lead
- Direction Types: INBOUND, OUTBOUND

### 5. Appointment Management

**Appointment Model**
- Fields: id, caseId, title, description, appointmentType, status, scheduledAt, duration, endTime, location, meetingLink, completedAt, meetingSummary, voiceNote, reminderSent, confirmationSent, createdAt, updatedAt
- Relationships: case
- Appointment Types: INITIAL_CONSULTATION, DOCUMENT_REVIEW, INTERVIEW_PREP, FOLLOW_UP, SUBMISSION_MEETING, OTHER
- Status Types: SCHEDULED, CONFIRMED, RESCHEDULED, COMPLETED, NO_SHOW, CANCELLED

### 6. Document Management

**Document Model**
- Fields: id, caseId, documentType, category, fileName, fileUrl, fileSize, mimeType, status, reviewedById, reviewedAt, uploadedAt, expiryDate, extractedText, aiSummary, tags, createdAt, updatedAt
- Relationships: case, comments, versions
- Document Types: PASSPORT, BIRTH_CERTIFICATE, MARRIAGE_CERTIFICATE, EDUCATION_CERTIFICATE, EMPLOYMENT_LETTER, BANK_STATEMENT, POLICE_CLEARANCE, MEDICAL_REPORT, PHOTO, INSURANCE, OTHER
- Status Types: PENDING, RECEIVED, UNDER_REVIEW, APPROVED, REJECTED, EXPIRED, ARCHIVED

**DocumentComment Model**
- Fields: id, documentId, userId, comment, isInternal, createdAt
- Relationships: document, user

**DocumentVersion Model**
- Fields: id, documentId, versionNumber, fileUrl, uploadedAt
- Relationships: document

### 7. Welcome Kit Management

**WelcomeKit Model**
- Fields: id, caseId, kitType, dispatchedAt, trackingNumber, courier, shippingAddress, deliveryStatus, deliveredAt, digitalAssets, createdAt, updatedAt
- Relationships: case
- Kit Types: Physical, Digital, Hybrid
- Delivery Status: PENDING, DISPATCHED, IN_TRANSIT, DELIVERED, FAILED, RETURNED

### 8. Communication Tracking

**Communication Model**
- Fields: id, caseId, type, channel, direction, subject, body, fromEmail, toEmail, fromPhone, toPhone, status, sentAt, deliveredAt, readAt, attachments, createdAt
- Relationships: case
- Communication Types: APPOINTMENT_CONFIRMATION, APPOINTMENT_REMINDER, DOCUMENT_REQUEST, DOCUMENT_RECEIVED, STATUS_UPDATE, WEEKLY_UPDATE, INSURANCE_NOTICE, WELCOME_MESSAGE, GENERAL_NOTIFICATION, MANUAL_EMAIL, MANUAL_SMS
- Channel Types: EMAIL, SMS, WHATSAPP, PHONE_CALL, IN_APP
- Direction Types: INBOUND, OUTBOUND
- Status Types: PENDING, SENT, DELIVERED, READ, FAILED, BOUNCED

### 9. Reminder System

**Reminder Model**
- Fields: id, caseId, type, title, description, scheduledFor, status, executedAt, failedAt, retryCount, isRecurring, recurrenceRule, createdAt, updatedAt
- Relationships: case
- Reminder Types: DOCUMENT_SUBMISSION, APPOINTMENT, PASSPORT_EXPIRY, APPLICATION_DEADLINE, MEDICAL_EXAM, BIOMETRICS, INTERVIEW, FOLLOW_UP, PAYMENT_DUE, CUSTOM
- Status Types: PENDING, SENT, FAILED, CANCELLED

### 10. Status Update Tracking

**StatusUpdate Model**
- Fields: id, caseId, oldStatus, newStatus, updateType, summary, details, isAutomatic, triggeredBy, notificationSent, notifiedAt, createdAt
- Relationships: case
- Update Types: STATUS_CHANGE, DOCUMENT_APPROVED, APPLICATION_SUBMITTED, INTERVIEW_SCHEDULED, DECISION_RECEIVED, MILESTONE_ACHIEVED, GENERAL_UPDATE

### 11. Activity Log

**Activity Model**
- Fields: id, userId, leadId, caseId, type, action, description, metadata, ipAddress, userAgent, createdAt
- Relationships: user, lead, case
- Activity Types: LEAD_CREATED, LEAD_UPDATED, LEAD_CONVERTED, CASE_CREATED, CASE_UPDATED, APPOINTMENT_SCHEDULED, DOCUMENT_UPLOADED, DOCUMENT_APPROVED, COMMUNICATION_SENT, STATUS_CHANGED, NOTE_ADDED, USER_LOGIN, SYSTEM_EVENT

### 12. Notes

**Note Model**
- Fields: id, leadId, userId, content, isPinned, isInternal, createdAt, updatedAt
- Relationships: lead, user

### 13. Notification System

**Notification Model**
- Fields: id, userId, type, title, message, actionUrl, metadata, isRead, readAt, createdAt
- Relationships: user
- Notification Types: NEW_LEAD, APPOINTMENT_REMINDER, DOCUMENT_RECEIVED, CASE_UPDATE, SYSTEM_ALERT, TASK_ASSIGNED, DEADLINE_APPROACHING

### 14. Audit Log

**AuditLog Model**
- Fields: id, userId, entityType, entityId, action, oldValues, newValues, ipAddress, userAgent, createdAt
- Relationships: user

### 15. Workflow Configuration

**WorkflowTemplate Model**
- Fields: id, name, serviceType, isActive, createdAt, updatedAt
- Relationships: steps

**WorkflowStep Model**
- Fields: id, templateId, stepOrder, stepName, stepType, triggerCondition, delay, config
- Relationships: template

### 16. System Settings

**SystemSetting Model**
- Fields: id, key, value, category, description, updatedAt

## Indexes and Performance Optimizations

### Primary Indexes
- User: email (unique)
- Lead: email, phone (indexes)
- Case: caseNumber (unique), clientEmail (index)
- Document: caseId, documentType (indexes)
- Communication: caseId, type (indexes)
- Reminder: scheduledFor, status (indexes)
- Activity: userId, caseId, leadId (indexes)
- Notification: userId, isRead (indexes)
- AuditLog: entityType, entityId (indexes)
- WorkflowStep: templateId, stepOrder (indexes)
- SystemSetting: key (unique)

### Relationship Indexes
- Foreign key relationships are indexed for optimal join performance
- Composite indexes for common query patterns
- Full-text search indexes for content fields

## Data Flow and Relationships

### Lead to Case Conversion
1. Lead is created through incoming call or other sources
2. Lead data is captured automatically
3. Lead can be converted to Case
4. Case inherits lead information
5. Case continues through the 18-turn workflow

### Document Management Workflow
1. Documents are uploaded and associated with Cases
2. Documents go through approval workflow (PENDING → UNDER_REVIEW → APPROVED/REJECTED)
3. Document versions are tracked
4. Comments can be added during review
5. AI analysis provides extracted text and summaries

### Communication Tracking
1. All client communications are logged
2. Communication type determines channel and content
3. Delivery status is tracked
4. Attachments can be included

### Automation and Reminders
1. Workflow templates define process steps
2. Reminders are scheduled based on case events
3. Status updates trigger notifications
4. Recurring tasks are supported

## Security and Compliance Considerations

### Data Encryption
- PII fields are encrypted at rest
- Document storage uses AES-256 encryption
- Communication logs are secured
- Access logs are maintained for compliance

### Access Control
- Role-based access control (RBAC)
- Field-level permissions
- Audit trails for all data modifications
- GDPR/PIPEDA compliance support

### Data Retention
- Configurable retention policies
- Automatic archiving of old records
- Right to erasure workflows
- Data portability support

## Scalability Considerations

### Partitioning Strategy
- Temporal partitioning for activity logs
- Case-based partitioning for large datasets
- Geographic partitioning for multi-region deployments

### Caching Strategy
- Redis for session management
- Query result caching for frequent reports
- CDN for document delivery
- In-memory caching for user preferences

## Implementation Notes

### Technology Stack
- PostgreSQL 15+ for primary database
- Prisma ORM for database abstraction
- Redis for caching and session management
- S3-compatible storage for document storage

### Migration Strategy
- Version-controlled schema migrations
- Zero-downtime deployment approach
- Backward compatibility for API changes
- Data validation and integrity checks

This database schema design provides a comprehensive foundation for the Enterprise Immigration CRM System, supporting all 18 customer journey touchpoints with robust data modeling, security, and scalability features.