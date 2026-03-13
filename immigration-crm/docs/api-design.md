# API Design - Enterprise Immigration CRM System

## Overview

This document outlines the RESTful API and tRPC endpoint design for the Enterprise Immigration CRM System. The API follows REST principles with standardized response formats and proper error handling.

## Base URL

```
https://api.immigration-crm.com/v1
```

## Authentication

All API endpoints (except `/auth/login` and `/auth/register`) require authentication via Bearer token:

```
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2026-02-09T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  },
  "timestamp": "2026-02-09T10:00:00Z"
}
```

## Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource already exists | 409 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_SERVER_ERROR` | Server error | 500 |

## API Endpoints Structure

### Authentication
```
POST   /api/auth/login        - User login
POST   /api/auth/register      - User registration
POST   /api/auth/logout        - User logout
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password - Reset password with token
POST   /api/auth/refresh       - Refresh access token
```

### User Management
```
GET    /api/users              - List users (admin only)
GET    /api/users/:id          - Get user details
POST   /api/users              - Create user (admin only)
PATCH  /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user (admin only)
GET    /api/users/me           - Get current user profile
PATCH  /api/users/me           - Update current user profile
```

### Lead Management
```
GET    /api/leads              - List leads
GET    /api/leads/:id          - Get lead details
POST   /api/leads              - Create new lead
PATCH  /api/leads/:id          - Update lead
DELETE /api/leads/:id          - Delete lead
POST   /api/leads/:id/convert  - Convert lead to case
GET    /api/leads/:id/notes    - Get lead notes
POST   /api/leads/:id/notes    - Add note to lead
GET    /api/leads/:id/activities - Get lead activities
```

### Case Management
```
GET    /api/cases              - List cases
GET    /api/cases/:id          - Get case details
POST   /api/cases              - Create new case
PATCH  /api/cases/:id          - Update case
GET    /api/cases/:id/documents - Get case documents
GET    /api/cases/:id/appointments - Get case appointments
GET    /api/cases/:id/communications - Get case communications
POST   /api/cases/:id/status-update - Update case status
GET    /api/cases/:id/timeline - Get case timeline
```

### Document Management
```
GET    /api/documents           - List documents
GET    /api/documents/:id      - Get document details
POST   /api/documents           - Upload document
POST   /api/documents/:id/approve - Approve document
POST   /api/documents/:id/reject  - Reject document
POST   /api/documents/:id/comments - Add comment to document
GET    /api/documents/:id/comments - Get document comments
POST   /api/documents/:id/versions - Upload new version
GET    /api/documents/:id/versions - Get document versions
```

### Appointment Management
```
GET    /api/appointments        - List appointments
GET    /api/appointments/:id    - Get appointment details
POST   /api/appointments        - Create appointment
PATCH  /api/appointments/:id    - Update appointment
DELETE /api/appointments/:id    - Cancel appointment
POST   /api/appointments/:id/confirm - Confirm appointment
POST   /api/appointments/:id/complete - Complete appointment
POST   /api/appointments/:id/reschedule - Reschedule appointment
```

### Communication Management
```
GET    /api/communications      - List communications
GET    /api/communications/:id  - Get communication details
POST   /api/communications      - Send communication
GET    /api/communications/templates - Get email/SMS templates
POST   /api/communications/templates - Create template
PATCH  /api/communications/templates/:id - Update template
DELETE /api/communications/templates/:id - Delete template
```

### Reminder System
```
GET    /api/reminders           - List pending reminders
GET    /api/reminders/:id       - Get reminder details
POST   /api/reminders           - Create reminder
PATCH  /api/reminders/:id       - Update reminder
DELETE /api/reminders/:id       - Delete reminder
POST   /api/reminders/scheduled - Get scheduled reminders for date
GET    /api/reminders/case/:caseId - Get case reminders
```

### Workflow Management
```
GET    /api/workflows           - List workflow templates
GET    /api/workflows/:id       - Get workflow template
POST   /api/workflows           - Create workflow template
PATCH  /api/workflows/:id       - Update workflow template
DELETE /api/workflows/:id       - Delete workflow template
POST   /api/workflows/:id/activate - Activate workflow
POST   /api/workflows/:id/deactivate - Deactivate workflow
POST   /api/workflows/:id/trigger - Trigger workflow manually
```

### Analytics & Reports
```
GET    /api/analytics/dashboard - Dashboard statistics
GET    /api/analytics/case-summary - Case summary report
GET    /api/analytics/performance - Team performance metrics
GET    /api/analytics/timeline  - Case timeline analytics
GET    /api/analytics/export    - Export analytics data
```

## Webhooks

### Incoming Webhooks
```
POST   /api/webhooks/twilio/incoming-call - Incoming call handling
POST   /api/webhooks/twilio/recording-complete - Recording processing
POST   /api/webhooks/stripe/payment-success - Payment success
POST   /api/webhooks/sendgrid/delivery-status - Email delivery status
POST   /api/webhooks/shipping/tracking-update - Shipping status updates
```

## tRPC Router Structure

### Authentication Router
```typescript
export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8)
    }))
    .output(z.object({
      success: z.boolean(),
      data: z.object({
        token: z.string(),
        user: UserSchema
      }),
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Authentication logic
    }),
    
  logout: protectedProcedure
    .output(z.object({
      success: z.boolean(),
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx }) => {
      // Logout logic
    })
});
```

### Lead Router
```typescript
export const leadRouter = router({
  list: protectedProcedure
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
      status: z.string().optional(),
      source: z.string().optional(),
      assignedTo: z.string().optional(),
      search: z.string().optional()
    }))
    .output(z.object({
      success: z.boolean(),
      data: z.object({
        leads: z.array(LeadSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number()
        })
      }),
      message: z.string(),
      timestamp: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // Lead listing logic
    }),
    
  create: protectedProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      source: LeadSourceSchema,
      status: LeadStatusSchema.optional().default('NEW'),
      priority: PrioritySchema.optional().default('MEDIUM')
    }))
    .output(z.object({
      success: z.boolean(),
      data: LeadSchema,
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Lead creation logic
    })
});
```

### Case Router
```typescript
export const caseRouter = router({
  list: protectedProcedure
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
      status: z.string().optional(),
      serviceType: z.string().optional(),
      assignedTo: z.string().optional(),
      search: z.string().optional()
    }))
    .output(z.object({
      success: z.boolean(),
      data: z.object({
        cases: z.array(CaseSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number()
        })
      }),
      message: z.string(),
      timestamp: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // Case listing logic
    }),
    
  create: protectedProcedure
    .input(z.object({
      leadId: z.string().optional(),
      clientFirstName: z.string(),
      clientLastName: z.string(),
      clientEmail: z.string().email(),
      clientPhone: z.string(),
      serviceType: ServiceTypeSchema,
      serviceTier: ServiceTierSchema.optional().default('STANDARD'),
      assignedToId: z.string()
    }))
    .output(z.object({
      success: z.boolean(),
      data: CaseSchema,
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Case creation logic
    }),
    
  updateStatus: protectedProcedure
    .input(z.object({
      caseId: z.string(),
      status: CaseStatusSchema,
      summary: z.string(),
      details: z.string().optional()
    }))
    .output(z.object({
      success: z.boolean(),
      data: StatusUpdateSchema,
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Status update logic
    })
});
```

### Document Router
```typescript
export const documentRouter = router({
  list: protectedProcedure
    .input(z.object({
      caseId: z.string().optional(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10),
      status: z.string().optional(),
      documentType: z.string().optional()
    }))
    .output(z.object({
      success: z.boolean(),
      data: z.object({
        documents: z.array(DocumentSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number()
        })
      }),
      message: z.string(),
      timestamp: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // Document listing logic
    }),
    
  upload: protectedProcedure
    .input(z.object({
      caseId: z.string(),
      documentType: DocumentTypeSchema,
      category: z.string(),
      fileName: z.string(),
      fileUrl: z.string().url(),
      fileSize: z.number(),
      mimeType: z.string()
    }))
    .output(z.object({
      success: z.boolean(),
      data: DocumentSchema,
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Document upload logic
    }),
    
  approve: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      reviewedById: z.string(),
      expiryDate: z.date().optional()
    }))
    .output(z.object({
      success: z.boolean(),
      data: DocumentSchema,
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Document approval logic
    }),
    
  addComment: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      comment: z.string(),
      isInternal: z.boolean().default(false)
    }))
    .output(z.object({
      success: z.boolean(),
      data: DocumentCommentSchema,
      message: z.string(),
      timestamp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Add comment logic
    })
});
```

## Real-time Communication

### WebSocket Events
```typescript
// Server emits:
{
  "event": "case_updated",
  "data": {
    "caseId": "case123",
    "newStatus": "UNDER_REVIEW",
    "updatedBy": "user123",
    "timestamp": "2026-02-09T10:00:00Z"
  }
}

{
  "event": "new_document",
  "data": {
    "caseId": "case123",
    "documentId": "doc456",
    "documentType": "PASSPORT",
    "uploadedBy": "user456",
    "timestamp": "2026-02-09T10:01:00Z"
  }
}

{
  "event": "appointment_scheduled",
  "data": {
    "caseId": "case123",
    "appointmentId": "apt789",
    "scheduledAt": "2026-02-10T14:00:00Z",
    "scheduledBy": "user123",
    "timestamp": "2026-02-09T10:02:00Z"
  }
}
```

### Client Subscriptions
```typescript
// Case updates
webSocket.subscribe("case:*", (data) => {
  // Handle case updates
});

// Document uploads
webSocket.subscribe("document:*", (data) => {
  // Handle document updates
});

// Appointment notifications
webSocket.subscribe("appointment:*", (data) => {
  // Handle appointment notifications
});

// General notifications
webSocket.subscribe("notification:*", (data) => {
  // Handle general notifications
});
```

## Rate Limiting

- **Public endpoints**: 100 requests/hour per IP
- **Authenticated endpoints**: 1,000 requests/hour per user
- **Admin endpoints**: 5,000 requests/hour per user
- **Bulk operations**: Special rate limits apply

## Caching Strategy

### API Response Caching
```typescript
// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in seconds
  key: string; // Cache key pattern
}

const cacheConfigs = {
  'GET /api/cases': { ttl: 60, key: 'cases:{queryParams}' },
  'GET /api/cases/:id': { ttl: 30, key: 'case:{id}' },
  'GET /api/documents': { ttl: 60, key: 'documents:{queryParams}' },
  'GET /api/analytics/dashboard': { ttl: 300, key: 'dashboard:{userId}' },
};

// Cache invalidation triggers
CacheEvent.on('case_updated', (caseId) => {
  redis.del(`case:${caseId}`);
  redis.del('cases:*');
  redis.del('dashboard:*');
});
```

## File Upload Endpoints

### Document Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

Parameters:
- file: File to upload
- caseId: Associated case ID
- documentType: Type of document
- category: Document category
- metadata: Additional metadata (JSON)
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "doc123",
    "fileName": "passport.pdf",
    "fileUrl": "https://storage.example.com/documents/passport.pdf",
    "fileSize": 1024000,
    "uploadedAt": "2026-02-09T09:45:00Z"
  },
  "message": "Document uploaded successfully",
  "timestamp": "2026-02-09T09:45:00Z"
}
```

## Webhook Security

### Signature Verification
```typescript
// Example webhook handler with signature verification
async function handleWebhook(req: Request) {
  const signature = req.headers['x-signature'];
  const payload = await req.text();
  
  const isValid = verifySignature(payload, signature, process.env.WEBHOOK_SECRET);
  
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Process webhook
  const event = JSON.parse(payload);
  await processWebhookEvent(event);
  
  return new Response('OK', { status: 200 });
}
```

## Webhook Processors

### Twilio Call Processor
```typescript
interface CallWebhookData {
  CallSid: string;
  From: string;
  To: string;
  CallStatus: string;
  RecordingUrl?: string;
  RecordingDuration?: string;
}

async function processTwilioCall(data: CallWebhookData) {
  // Create or update lead
  const lead = await prisma.lead.upsert({
    where: { phone: data.From },
    update: {
      source: 'INCOMING_CALL',
      status: 'CONTACTED'
    },
    create: {
      phone: data.From,
      source: 'INCOMING_CALL',
      status: 'NEW'
    }
  });
  
  // Create call recording record
  if (data.RecordingUrl) {
    const callRecording = await prisma.callRecording.create({
      data: {
        leadId: lead.id,
        phoneNumber: data.From,
        direction: 'INBOUND',
        duration: parseInt(data.RecordingDuration || '0'),
        recordingUrl: data.RecordingUrl,
        callStartedAt: new Date(),
        callEndedAt: new Date()
      }
    });
    
    // Trigger transcription
    await transcriptionQueue.add('transcribe-call', {
      recordingId: callRecording.id,
      recordingUrl: data.RecordingUrl
    });
  }
}
```

### SendGrid Email Processor
```typescript
interface EmailWebhookData {
  event: 'delivered' | 'open' | 'click' | 'bounce';
  email: string;
  timestamp: number;
  messageId: string;
  reason?: string;
}

async function processSendGridWebhook(data: EmailWebhookData) {
  // Find communication by message ID
  const communication = await prisma.communication.findFirst({
    where: { metadata: { path: ['messageId'], equals: data.messageId } }
  });
  
  if (communication) {
    let status: MessageStatus;
    switch (data.event) {
      case 'delivered':
        status = 'DELIVERED';
        break;
      case 'open':
        status = 'READ';
        break;
      case 'bounce':
        status = 'BOUNCED';
        break;
      default:
        status = 'SENT';
    }
    
    await prisma.communication.update({
      where: { id: communication.id },
      data: {
        status,
        ...(status === 'DELIVERED' && { deliveredAt: new Date(data.timestamp * 1000) }),
        ...(status === 'READ' && { readAt: new Date(data.timestamp * 1000) })
      }
    });
  }
}
```

## Security Headers

```typescript
// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Rate limiting headers
  res.setHeader('X-RateLimit-Limit', '1000');
  res.setHeader('X-RateLimit-Remaining', '950');
  res.setHeader('X-RateLimit-Reset', '3600');
  
  next();
});
```

## API Versioning

### Version 1 (Current)
- RESTful endpoints with JSON responses
- JSON Web Token authentication
- Standardized error responses
- Pagination support
- Filtering and sorting

### Version 2 (Future)
- GraphQL API alternative
- Real-time subscriptions
- Enhanced webhook system
- Advanced filtering capabilities
- Batch operations

## Monitoring and Logging

### API Log Structure
```json
{
  "timestamp": "2026-02-09T10:00:00Z",
  "method": "POST",
  "path": "/api/cases",
  "statusCode": 201,
  "responseTime": 125,
  "userId": "user123",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "requestId": "req-abc123",
  "error": null
}
```

### Performance Metrics
```json
{
  "endpoint": "/api/cases",
  "avgResponseTime": 85,
  "p95ResponseTime": 150,
  "requestsPerMinute": 120,
  "errorRate": 0.05,
  "activeConnections": 45
}
```

## API Documentation

### OpenAPI/Swagger
The API includes OpenAPI documentation available at:
```
GET /api-docs
GET /api-docs/json
GET /api-docs/yaml
```

### Postman Collection
A Postman collection is available for testing at:
```
GET /api/postman-collection
```

## Testing Strategy

### Unit Tests
```typescript
describe('Case API', () => {
  test('should create a new case', async () => {
    const response = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientFirstName: 'John',
        clientLastName: 'Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
        serviceType: 'STUDENT_VISA',
        serviceTier: 'STANDARD',
        assignedToId: 'user123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.caseNumber).toMatch(/CASE-/);
  });
  
  test('should require authentication', async () => {
    const response = await request(app)
      .post('/api/cases')
      .send({
        clientFirstName: 'John',
        clientLastName: 'Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
        serviceType: 'STUDENT_VISA',
        serviceTier: 'STANDARD',
        assignedToId: 'user123'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
```

### Integration Tests
```typescript
describe('Document Workflow', () => {
  test('complete document upload and approval flow', async () => {
    // Create case
    const caseResponse = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${authToken}`)
      .send(caseData);
    
    // Upload document
    const uploadResponse = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .field('caseId', caseResponse.body.data.id)
      .field('documentType', 'PASSPORT')
      .field('category', 'Identification')
      .attach('file', Buffer.from('test file'), 'passport.pdf');
    
    // Approve document
    const approveResponse = await request(app)
      .post(`/api/documents/${uploadResponse.body.data.id}/approve`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        reviewedById: 'user123',
        expiryDate: '2030-01-01'
      });
    
    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.data.status).toBe('APPROVED');
  });
});
```

## Deployment Notes

### Health Check Endpoints
```
GET  /health              - API health status
GET  /health/database     - Database connection status
GET  /health/redis        - Redis connection status
GET  /health/storage      - Storage connection status
GET  /health/queue        - Queue worker status
```

### Maintenance Mode
When in maintenance mode:
- All endpoints return `503 Service Unavailable`
- Message: "System under maintenance"
- Expected downtime: Provided in response headers

### API Deprecation
Deprecated endpoints include:
- `X-Deprecated: true` header
- `X-Deprecated-Since: 2026-03-01` header
- `X-Sunset-Date: 2026-06-01` header (removal date)
```

This API design provides a comprehensive RESTful interface for the Immigration CRM System with proper authentication, rate limiting, error handling, and webhook support.