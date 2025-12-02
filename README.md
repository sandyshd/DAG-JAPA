# DAG JAPA - Next.js Single-App Platform

A full-stack Next.js application for the DAG JAPA Initiative, combining UI and backend in a single application with PostgreSQL database and Supabase authentication.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Framework**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **UI Components**: Lucide React Icons
- **Form Handling**: React Hook Form + Zod validation

## Features

- ✅ User Authentication (Signup/Login/Logout)
- ✅ Multi-step Registration Form
- ✅ Module Selection & Application Management
- ✅ User Dashboard with Application Tracking
- ✅ Admin Dashboard (scaffold ready)
- ✅ Database-driven CRUD operations
- ✅ Type-safe API routes with Prisma
- ✅ Responsive UI with Tailwind CSS

## Project Structure

```
dag-japa-nextjs/
├── app/
│   ├── api/                    # API routes for backend
│   │   ├── modules/           # Module CRUD endpoints
│   │   ├── applications/      # Application CRUD endpoints
│   │   └── users/             # User endpoints
│   ├── auth/                  # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── dashboard/             # User dashboard
│   ├── admin/                 # Admin panel (scaffold)
│   ├── register/              # Registration flow
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── lib/
│   ├── supabase.ts           # Supabase client config
│   └── api-client.ts         # API utility functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── public/                    # Static assets
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
└── .env.example             # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd dag-japa-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the values in `.env.local`:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Database

### Schema Overview

**Users** - Authentication and profile management
- id, email, fullName, phone, role, avatar, etc.

**Applications** - User applications for modules
- id, userId, moduleId, status, formData, reviewComments, etc.

**Modules** - Available pathways
- id, name, description, requirement, fields, etc.

**EnglishTest** - Language proficiency tracking
- id, userId, score, passed, testData, completedAt, etc.

**AdminActivity** - Audit logs for admin actions
- id, adminId, action, targetId, details, createdAt, etc.

### Running Migrations

```bash
# Generate migration
npm run prisma:migrate

# View database in Prisma Studio
npm run prisma:studio
```

## API Routes

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/[id]` - Get specific module
- `POST /api/modules` - Create module (admin)
- `PUT /api/modules/[id]` - Update module (admin)
- `DELETE /api/modules/[id]` - Delete module (admin)

### Applications
- `GET /api/applications` - Get applications (with filters)
- `GET /api/applications/[id]` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/[id]` - Get user profile and applications
- `PUT /api/users/[id]` - Update user profile

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy (automatic on every push to main)

### Deploy to Railway / Render

1. Connect GitHub repository
2. Set environment variables
3. Database migrations will run automatically
4. Deploy with a single click

## Development Workflow

### Creating new API routes

```typescript
// app/api/[resource]/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Implementation
}

export async function POST(req: Request) {
  // Implementation
}
```

### Creating new pages

```typescript
// app/[path]/page.tsx
'use client'; // if client-side

export default function Page() {
  return <div>Your content</div>;
}
```

### Using Prisma in server components

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const data = await prisma.module.findMany();
```

## Next Steps

1. ✅ Set up Supabase project and database
2. ✅ Configure environment variables
3. ✅ Run migrations and seed data
4. ✅ Test authentication flow
5. ⏳ Build module selection flow
6. ⏳ Implement admin dashboard
7. ⏳ Add email notifications
8. ⏳ Set up file uploads (S3/Supabase Storage)
9. ⏳ Add monitoring & logging
10. ⏳ Deploy to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
