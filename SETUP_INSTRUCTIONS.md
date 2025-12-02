# Setup Instructions - DAG JAPA Next.js

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Supabase account (free at https://supabase.com)

### 2. Clone & Install
```bash
cd c:\Project\dag-japa-nextjs
npm install
```

### 3. Create `.env.local`
Copy the example and fill in your credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dag_japa_db
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### 5. Start Dev Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Detailed Setup Guide

### Step 1: Supabase Setup

1. **Create Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose region
   - Save password securely

2. **Get Credentials**
   - Project Settings → API
   - Copy `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Create Database** (Supabase handles this automatically)
   - Supabase creates PostgreSQL for you
   - Get connection string from Settings → Database → Connection Pooling
   - Set as `DATABASE_URL`

### Step 2: PostgreSQL Setup

If using **local PostgreSQL**:
```bash
# Create database
createdb dag_japa_db

# Get connection string
postgresql://postgres:password@localhost:5432/dag_japa_db
```

If using **Supabase** (recommended):
- Database URL provided in Supabase dashboard
- No additional setup needed

### Step 3: Environment Variables

Create `.env.local` file in root:
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dag_japa_db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIs..."

# NextAuth (for custom auth, if using)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Step 4: Database Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run db:push

# View schema changes (optional)
git diff prisma/schema.prisma

# Seed test data
npm run db:seed

# View database in Prisma Studio
npm run prisma:studio
```

Prisma Studio opens at http://localhost:5555

### Step 5: Run Development Server

```bash
npm run dev
```

Server starts at http://localhost:3000

### Step 6: Test the App

1. **Home Page**: http://localhost:3000
   - Should show landing page with modules

2. **Sign Up**: http://localhost:3000/auth/register
   - Enter email, password, name
   - Should create user in Supabase

3. **Sign In**: http://localhost:3000/auth/login
   - Use credentials from signup
   - Should redirect to dashboard

4. **Dashboard**: http://localhost:3000/dashboard
   - View profile and applications
   - Create new application

5. **Prisma Studio**: `npm run prisma:studio`
   - View all database tables
   - See created users and applications

---

## Build & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select your GitHub repo
   - Select Next.js framework

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all `.env.local` variables
   - (Keep NEXTAUTH_SECRET secret)

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

### Deploy to Railway

1. **Create Account**: https://railway.app

2. **Connect GitHub**
   - Click "New Project"
   - Select GitHub repo
   - Authorize Railway

3. **Add PostgreSQL**
   - Click "Add Services"
   - Select PostgreSQL
   - Click "Deploy"

4. **Configure Node App**
   - Add environment variables
   - Set build command: `npm run build`
   - Set start command: `npm start`

5. **Deploy**
   - Railway automatically deploys on push

### Deploy to Render

1. **Create Account**: https://render.com

2. **Create New Service**
   - Select Web Service
   - Connect GitHub
   - Select repository

3. **Configure**
   - Environment: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Add Environment Variables**
   - Add all from `.env.local`

5. **Deploy**
   - Render builds and deploys

---

## API Endpoints

### Modules
- `GET /api/modules` — Get all modules
- `GET /api/modules/[id]` — Get specific module
- `POST /api/modules` — Create module (admin)
- `PUT /api/modules/[id]` — Update module (admin)
- `DELETE /api/modules/[id]` — Delete module (admin)

### Applications
- `GET /api/applications` — Get applications
  - Optional: `?userId=xxx` or `?status=PENDING`
- `GET /api/applications/[id]` — Get application
- `POST /api/applications` — Create application
- `PUT /api/applications/[id]` — Update application
- `DELETE /api/applications/[id]` — Delete application

### Users
- `GET /api/users` — Get all users (admin)
- `GET /api/users/[id]` — Get user profile
- `PUT /api/users/[id]` — Update user

### Authentication (via Supabase)
- `/auth/register` — Sign up
- `/auth/login` — Sign in
- `/auth/forgot-password` — Password reset

---

## Troubleshooting

### Error: "DATABASE_URL is invalid"
- ✅ Check connection string format
- ✅ Verify username/password
- ✅ Ensure database exists
- ✅ Restart dev server after changing URL

### Error: "Supabase URL not found"
- ✅ Copy full URL (including https://)
- ✅ Check for typos
- ✅ Verify it's in `.env.local` (not `.env`)

### Error: "Prisma Client not generated"
- ✅ Run: `npm run prisma:generate`
- ✅ Delete `node_modules` and reinstall: `npm install`

### Error: "Cannot connect to database"
- ✅ Verify PostgreSQL is running
- ✅ Check credentials
- ✅ Verify network access (if cloud)
- ✅ Check firewall rules

### Error: "User not found after signup"
- ✅ Check Supabase Auth → Users
- ✅ Verify email confirmation (if required)
- ✅ Check browser cookies for auth session

### Dev Server Won't Start
- ✅ Kill existing process: `lsof -ti:3000 | xargs kill -9`
- ✅ Clear `.next`: `rm -rf .next`
- ✅ Reinstall: `npm install`
- ✅ Run: `npm run dev`

### Database Not Updated
- ✅ Run migrations: `npm run db:push`
- ✅ Seed again: `npm run db:seed`
- ✅ Check `.env.local` DATABASE_URL

---

## Development Workflow

### Adding a New Page

1. **Create file**: `app/feature/page.tsx`
2. **Add to layout**: (done automatically)
3. **Add navigation** in other pages
4. **Test** at `http://localhost:3000/feature`

### Adding API Endpoint

1. **Create**: `app/api/resource/route.ts`
2. **Implement** GET/POST/PUT/DELETE
3. **Test** with curl or Postman:
   ```bash
   curl http://localhost:3000/api/resource
   ```

### Modifying Database Schema

1. **Edit**: `prisma/schema.prisma`
2. **Create migration**: `npm run prisma:migrate`
3. **Push changes**: `npm run db:push`
4. **Update seed** if needed: `prisma/seed.ts`

### Accessing Supabase Features

```typescript
import { supabase } from '@/lib/supabase';

// Get current session
const { data } = await supabase.auth.getSession();

// Sign out
await supabase.auth.signOut();

// Get user
const { data: { user } } = await supabase.auth.getUser();
```

---

## Next Steps

1. ✅ Complete setup steps above
2. ✅ Test authentication (signup/login)
3. ⏳ Convert remaining pages from old Vite app
4. ⏳ Implement module selection flow
5. ⏳ Build full registration form
6. ⏳ Create admin dashboard
7. ⏳ Add email notifications
8. ⏳ Set up file uploads
9. ⏳ Deploy to production
10. ⏳ Set up monitoring & alerts

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs/
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React 18**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review MIGRATION_GUIDE.md
3. Check logs: `npm run dev` (terminal output)
4. Check browser console: F12 → Console tab
5. View database: `npm run prisma:studio`

Good luck! 🚀
