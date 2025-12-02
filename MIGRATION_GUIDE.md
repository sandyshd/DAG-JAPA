# Migration Guide: From Vite React to Next.js Single-App

## Overview
This guide explains how to migrate from the old Vite-based static website to the new Next.js single-app architecture. Both static content and backend are now in one Next.js application.

## Key Changes

### 1. Architecture
- **Old**: Vite (frontend only, static HTML)
- **New**: Next.js with integrated API routes (frontend + backend in one app)

### 2. Routing
- **Old**: React Router (client-side only)
- **New**: Next.js file-based routing (server + client components)

### 3. Database
- **Old**: No database (static JSON/hardcoded data)
- **New**: PostgreSQL with Prisma ORM

### 4. Authentication
- **Old**: Mock login/logout (no real auth)
- **New**: Supabase Auth (real OAuth2 with secure sessions)

### 5. Data Management
- **Old**: Local state (useState)
- **New**: Server components + API routes + Prisma queries

## Migration Steps (Detailed)

### Step 1: Environment Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Get the project URL and anon key
   - Set up database (PostgreSQL)

2. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials:
   # - DATABASE_URL (from Supabase)
   # - NEXT_PUBLIC_SUPABASE_URL
   # - NEXT_PUBLIC_SUPABASE_ANON_KEY
   # - SUPABASE_SERVICE_ROLE_KEY
   ```

### Step 2: Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables (push schema)
npm run db:push

# Seed with test data
npm run db:seed

# View/manage database
npm run prisma:studio
```

### Step 3: Migrate Components

#### Old Vite Pattern → New Next.js Pattern

**Old (Vite with client state):**
```typescript
// src/components/RegistrationForm.tsx
const [currentStep, setCurrentStep] = useState(0);
const [formData, setFormData] = useState({...});

const handleSubmit = async () => {
  // No backend, just state updates
}
```

**New (Next.js with server actions/API):**
```typescript
// app/register/page.tsx
'use client';
import { submitApplication } from '@/lib/api-client';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async () => {
    // Call API route
    const result = await submitApplication(formData);
  }
}
```

### Step 4: Data Fetching

#### Old Vite Pattern → New Next.js Pattern

**Old: Client-side fetch**
```typescript
useEffect(() => {
  const data = fetchData(); // Hardcoded or axios
  setData(data);
}, []);
```

**New: Server-side fetch (preferred)**
```typescript
// app/modules/page.tsx (Server Component)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ModulesPage() {
  const modules = await prisma.module.findMany();
  return <ModuleList modules={modules} />;
}
```

Or **Client fetch with API routes:**
```typescript
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
}
```

### Step 5: Convert Key Pages

#### Home Page
- Old: `src/components/JapaWebsite.tsx`
- New: `app/page.tsx`
- Keep UI, add links to new routes

#### Login Page
- Old: `src/components/LoginPage.tsx` (mock)
- New: `app/auth/login/page.tsx` (with Supabase)
- Replace mock auth with real Supabase login

#### Registration Form
- Old: `src/components/RegistrationForm.tsx` (client state)
- New: `app/register/page.tsx` (with API route)
- Data saved to database via `/api/applications`

#### User Dashboard
- Old: `src/components/UserDashboard.tsx` (static)
- New: `app/dashboard/page.tsx` (dynamic, from DB)
- Fetch user's applications from database

#### Admin Dashboard
- Old: `src/components/AdminDashboard.tsx` (static)
- New: `app/admin/dashboard/page.tsx` (with real data)
- Review applications from database

### Step 6: API Route Pattern

Each page that needs data should have a corresponding API route.

**Pattern:**
```typescript
// app/api/[resource]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const data = await prisma.resource.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.resource.create({ data: body });
  return NextResponse.json(data, { status: 201 });
}
```

### Step 7: Authentication Flow

**Login:**
1. User enters email/password at `/auth/login`
2. Supabase authenticates and returns JWT
3. Session stored in secure HTTP-only cookie (handled by Supabase)
4. Redirect to `/dashboard`

**Registration:**
1. User creates account at `/auth/register`
2. Supabase creates user and sends confirmation email
3. On confirmation, user can login
4. Redirect to module selection → application form

**Protected Routes:**
```typescript
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        router.push('/auth/login');
      }
    });
  }, [router]);

  return <div>Protected content</div>;
}
```

### Step 8: Deployment

**Vercel (Recommended for Next.js):**
1. Push to GitHub
2. Connect repo in Vercel
3. Add environment variables
4. Deploy (automatic on push)

**Railway / Render:**
1. Create account
2. Connect GitHub repo
3. Select Next.js
4. Add environment variables
5. Set buildcommand: `npm run build`
6. Deploy

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## File Mapping: Old → New

| Old File | New File | Notes |
|----------|----------|-------|
| `src/App.tsx` | `app/layout.tsx` + routing | Remove client-side router, use Next.js file routes |
| `src/components/JapaWebsite.tsx` | `app/page.tsx` | Home page |
| `src/components/LoginPage.tsx` | `app/auth/login/page.tsx` | Add Supabase integration |
| `src/components/RegistrationForm.tsx` | `app/register/page.tsx` | Connect to API route |
| `src/components/UserDashboard.tsx` | `app/dashboard/page.tsx` | Fetch from DB |
| `src/components/AdminDashboard.tsx` | `app/admin/dashboard/page.tsx` | Fetch from DB |
| `src/components/ModuleDetailPage.tsx` | `app/modules/[id]/page.tsx` | Dynamic routes |
| `src/components/EnglishTestPage.tsx` | `app/tests/english/page.tsx` | Test page |
| None | `app/api/modules/route.ts` | New: API endpoints |
| None | `app/api/applications/route.ts` | New: API endpoints |
| None | `app/api/users/route.ts` | New: API endpoints |
| None | `prisma/schema.prisma` | New: Database schema |

## Testing Checklist

- [ ] Supabase project created and configured
- [ ] Database connected and migrations run
- [ ] Home page loads
- [ ] User can sign up at `/auth/register`
- [ ] User receives confirmation email
- [ ] User can log in at `/auth/login`
- [ ] User can view dashboard
- [ ] User can create application
- [ ] Application saved to database
- [ ] Admin can view applications
- [ ] Admin can review/approve applications
- [ ] English test page works
- [ ] All pages are responsive

## Common Issues & Solutions

### Issue: "DATABASE_URL not found"
**Solution**: Check `.env.local` has correct PostgreSQL URL

### Issue: "Supabase key missing"
**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and key in `.env.local`

### Issue: "Prisma Client not generated"
**Solution**: Run `npm run prisma:generate`

### Issue: "User not authenticated"
**Solution**: Check browser cookies, verify Supabase session

### Issue: "Database schema not created"
**Solution**: Run `npm run db:push`

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

<Image 
  src="/image.jpg" 
  alt="description" 
  width={800} 
  height={600}
/>
```

### Code Splitting
Next.js automatically code-splits at page boundaries.

### Caching
Use `revalidateTag()` and `revalidatePath()` for ISR.

## Summary

1. **Setup**: Create Supabase project, configure env vars
2. **Database**: Run migrations and seed
3. **Authentication**: Implement Supabase Auth flow
4. **Pages**: Convert components to Next.js pages
5. **API**: Create API routes for CRUD
6. **Testing**: Validate all flows work
7. **Deploy**: Push to Vercel/Railway

The new architecture provides:
- ✅ Real database persistence
- ✅ Secure authentication
- ✅ Type-safe backend
- ✅ Better scalability
- ✅ Single deployment
- ✅ Faster performance

For detailed examples, see the scaffold code in the `app/` directory.
