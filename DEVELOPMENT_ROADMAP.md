# Development Roadmap - Next Steps

This document outlines what needs to be built on top of the scaffold.

---

## Phase 1: Complete Core Flows (Week 1-2)

### 1.1 Module Selection & Display
**Location**: `app/register/modules/page.tsx` & `app/modules/[id]/page.tsx`

**Tasks**:
- [ ] Create module selection component
- [ ] Display all modules from `/api/modules`
- [ ] Show module details (name, icon, requirements, fields)
- [ ] Create module detail page with dynamic routing
- [ ] Add "Apply Now" button linking to application form

**API Used**: `GET /api/modules`, `GET /api/modules/[id]`

**Time**: 4-6 hours

---

### 1.2 Application Form (Multi-step)
**Location**: `app/applications/new/page.tsx`

**Tasks**:
- [ ] Build multi-step form component
- [ ] Step 1: Module selection (dropdown or carousel)
- [ ] Step 2: Module-specific fields (dynamic based on selected module)
- [ ] Step 3: Personal info (name, email, phone, education)
- [ ] Step 4: File uploads (CV, supporting docs)
- [ ] Step 5: Review & submit
- [ ] Form validation with React Hook Form + Zod
- [ ] Submit to `/api/applications`
- [ ] Show success message with application ID

**API Used**: `POST /api/applications`

**Dependencies**: Add to `lib/api-client.ts`:
```typescript
export async function getModuleFields(moduleId: number) {
  // Fetch module details to get dynamic fields
}
```

**Time**: 8-10 hours

---

### 1.3 User Dashboard Enhancement
**Location**: `app/dashboard/page.tsx`

**Tasks**:
- [ ] Display user profile info
- [ ] Show all user applications with status
- [ ] Add filters (by module, by status)
- [ ] Display application details modal
- [ ] Add "View Details" button for each application
- [ ] Show English test status
- [ ] Add breadcrumb navigation
- [ ] Add "Create New Application" button

**API Used**: `GET /api/users/[id]`, `GET /api/applications?userId=xxx`

**Time**: 4-6 hours

---

## Phase 2: Admin & Review Features (Week 2-3)

### 2.1 Admin Dashboard
**Location**: `app/admin/dashboard/page.tsx`

**Tasks**:
- [ ] Add admin authentication check
- [ ] List all applications with sorting/filtering
  - Filter by status (Pending, Under Review, Approved, Rejected)
  - Filter by module
  - Sort by date, status, etc.
- [ ] Application review card (show full details)
- [ ] Review form (approve/reject with comments)
- [ ] Bulk actions (approve multiple, etc.)
- [ ] Dashboard stats (total apps, pending, approved, etc.)

**API Needed**: `PUT /api/applications/[id]` for review updates

**Update API**: `/api/applications/[id]` route to handle:
```typescript
PUT data: {
  status: "APPROVED" | "REJECTED" | "UNDER_REVIEW",
  reviewComment: "string",
  reviewedBy: "adminId"
}
```

**Time**: 8-10 hours

---

### 2.2 Admin User Management
**Location**: `app/admin/users/page.tsx`

**Tasks**:
- [ ] List all users with search
- [ ] View user profile & application history
- [ ] Activate/deactivate users
- [ ] Change user roles (USER, ADMIN)
- [ ] Export user data (CSV)

**API Used**: `GET /api/users`, `GET /api/users/[id]`, `PUT /api/users/[id]`

**Time**: 4-6 hours

---

## Phase 3: Additional Features (Week 3-4)

### 3.1 English Test Page
**Location**: `app/tests/english/page.tsx`

**Tasks**:
- [ ] Design test questions (CRUD in database first)
- [ ] Create test component with:
  - Question display
  - Multiple choice / fill-in-the-blank
  - Timer
  - Progress indicator
- [ ] Score calculation
- [ ] Save test results to database
- [ ] Show results page with score & feedback

**Database**: Add to `prisma/schema.prisma`:
```prisma
model EnglishTestQuestion {
  id        String     @id @default(cuid())
  question  String
  options   String[]   // JSON array
  answer    String
  createdAt DateTime   @default(now())
}

// Update EnglishTest model to include testData
```

**Time**: 10-12 hours

---

### 3.2 File Uploads (CV, Documents)
**Location**: Update application form

**Tasks**:
- [ ] Set up Supabase Storage bucket
- [ ] Add file upload component to application form
- [ ] Validate file type & size
- [ ] Upload to Supabase Storage
- [ ] Save file URLs to database (Application.cvUrl, supportingDocs)
- [ ] Display uploaded files in dashboard
- [ ] Allow download/preview

**Update Schema**:
```prisma
model Application {
  // ... existing fields ...
  cvUrl     String?
  supportingDocs String?  // JSON array of { name, url }
}
```

**Time**: 6-8 hours

---

### 3.3 Email Notifications
**Tasks**:
- [ ] Set up email service (Resend, SendGrid, or Supabase Email)
- [ ] Email templates:
  - Welcome email (after signup)
  - Application submitted confirmation
  - Application status update (approved/rejected)
  - Password reset link
- [ ] Send emails from API routes
- [ ] Test emails in development

**Create**: `lib/email.ts`
```typescript
export async function sendApplicationNotification(
  email: string,
  status: string,
  comment?: string
) {
  // Send email
}
```

**Time**: 4-6 hours

---

## Phase 4: Advanced Features (Week 4+)

### 4.1 Real-time Features
- [ ] Use Supabase Realtime for live application updates
- [ ] Notify admins when new applications arrive
- [ ] Real-time dashboard updates for users

**Time**: 4-8 hours

---

### 4.2 Payment Processing (If Needed)
- [ ] Integrate Stripe or Paystack
- [ ] Create payment page
- [ ] Track payment status in database
- [ ] Send payment receipts

**Time**: 8-12 hours

---

### 4.3 Analytics & Reporting
- [ ] Track application metrics (total, by module, by status)
- [ ] User growth charts
- [ ] Success rate analytics
- [ ] Export reports (PDF, CSV)

**Time**: 6-8 hours

---

### 4.4 Advanced Search & Filtering
- [ ] Full-text search for applications
- [ ] Advanced filters (date range, education level, etc.)
- [ ] Saved filters / saved searches
- [ ] Search history

**Time**: 4-6 hours

---

## Phase 5: Testing & Deployment (Ongoing)

### 5.1 Automated Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] API route tests

**Time**: 10-15 hours

---

### 5.2 CI/CD Pipeline
- [ ] GitHub Actions workflow
- [ ] Auto-run tests on PR
- [ ] Auto-deploy to staging on PR merge
- [ ] Manual deploy to production

**Time**: 3-4 hours

---

### 5.3 Monitoring & Observability
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Logging (Winston, Pino)
- [ ] Uptime monitoring

**Time**: 4-6 hours

---

### 5.4 Security Hardening
- [ ] Rate limiting on API routes
- [ ] CSRF protection
- [ ] CORS configuration
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention
- [ ] Security headers
- [ ] Database encryption

**Time**: 6-8 hours

---

## Implementation Order (Recommended)

1. **Start with Phase 1** (core features first)
   - Module selection → Application form → Dashboard
   - Time: 16-22 hours
   - Milestone: Users can apply, see their applications

2. **Then Phase 2** (admin can review)
   - Admin dashboard → Review workflow
   - Time: 12-16 hours
   - Milestone: Admins can review & approve/reject applications

3. **Then Phase 3** (polish features)
   - English test → File uploads → Email notifications
   - Time: 20-26 hours
   - Milestone: Feature-complete MVP

4. **Phase 4** (scalability & advanced)
   - Real-time, payments, analytics as needed
   - Time: Varies

5. **Phase 5** (quality & reliability)
   - Testing, CI/CD, monitoring
   - Time: 23-33 hours
   - Milestone: Production-ready

---

## Quick Tips for Development

### Add a New Page
```bash
# Create page directory
mkdir -p app/my-feature

# Create page.tsx
# Start with 'use client' if using hooks
# Use layouts for shared structure
```

### Add API Endpoint
```bash
# Create route.ts
# app/api/my-resource/route.ts
# Implement GET, POST, PUT, DELETE as needed
```

### Add Database Model
```prisma
# Edit prisma/schema.prisma
# Add new model
prisma migrate dev --name add_my_model
npm run db:seed  # Update seed if needed
```

### Test API Endpoint
```bash
# Using curl
curl http://localhost:3000/api/my-resource

# Or use Postman/Insomnia
# Import OpenAPI spec (can be auto-generated)
```

---

## Estimated Timeline

| Phase | Duration | Features |
|-------|----------|----------|
| 1 | 1-2 weeks | Modules, applications, dashboard |
| 2 | 1 week | Admin review workflow |
| 3 | 1-2 weeks | Tests, uploads, emails |
| 4 | 1-4 weeks | Real-time, payments, analytics |
| 5 | 1-2 weeks | Testing, CI/CD, monitoring |
| **Total** | **5-11 weeks** | **MVP to production** |

---

## Success Metrics

- ✅ Users can complete full application process
- ✅ Admins can review and approve/reject applications
- ✅ Users receive email notifications
- ✅ Application data persists in database
- ✅ Zero downtime deployments
- ✅ < 2s page load time
- ✅ 99.9% uptime
- ✅ Automated tests passing

---

## Questions?

Refer to:
- SETUP_INSTRUCTIONS.md — Setup & dev environment
- MIGRATION_GUIDE.md — Architecture decisions
- README.md — Project overview
- Inline comments in code

Good luck! 🚀
