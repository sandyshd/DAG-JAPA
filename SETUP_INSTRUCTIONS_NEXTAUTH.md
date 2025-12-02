# Setup Instructions - DAG JAPA Next.js (NextAuth + PostgreSQL)

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local)
- **No Supabase needed** - using NextAuth.js with local PostgreSQL

### 2. Clone & Install
```bash
cd c:\Project\dag-japa-nextjs
npm install
```

### 3. Create `.env.local`
```bash
cp .env.example .env.local
```

Edit `.env.local` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/dag_japa_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"
```

**To generate NEXTAUTH_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed with test data (includes test users)
npm run db:seed
```

### 5. Start Dev Server
```bash
npm run dev
```

Visit: http://localhost:3000

**Test Credentials**:
```
Email: user1@example.com
Password: user123456

OR

Email: admin@dagjapa.com
Password: admin123
```

---

## Detailed Setup Guide

### Step 1: PostgreSQL Setup (Local)

#### Windows
```powershell
# Option 1: Using Chocolatey
choco install postgresql

# Option 2: Download installer
# https://www.postgresql.org/download/windows/

# After installation, create database:
psql -U postgres

# In psql prompt:
CREATE DATABASE dag_japa_db;
\q
```

#### macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
psql -U postgres -c "CREATE DATABASE dag_japa_db;"
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE dag_japa_db;"
```

#### Verify PostgreSQL is Running
```bash
# Test connection
psql -U postgres -d dag_japa_db -c "SELECT 1;"
# Should output: ?column? 
#          1

# List databases
psql -U postgres -c "\l"
# Should see dag_japa_db in the list
```

### Step 2: Environment Variables

Create `.env.local` in project root:
```
# Database Connection
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/dag_japa_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Environment
NODE_ENV="development"
```

**Important**: 
- `.env.local` is ignored by git (never commit secrets)
- `NEXTAUTH_SECRET` must be at least 32 characters
- Keep it different in production

### Step 3: Generate NEXTAUTH_SECRET

```bash
# Option 1: Using Node.js (easiest)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Use an online generator (for development only)
# https://generate-secret.vercel.app/
```

Copy the generated string and paste in `.env.local`:
```
NEXTAUTH_SECRET="your-generated-32-char-string-here"
```

### Step 4: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14
- NextAuth.js 4.24
- Prisma ORM
- bcryptjs (password hashing)
- And other dependencies

### Step 5: Setup Prisma & Database

```bash
# Generate Prisma Client (creates types)
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed database with test data and users
npm run db:seed
```

**Expected output**:
```
✅ Database seeded successfully!

📝 Test Credentials:
Admin:
  Email: admin@dagjapa.com
  Password: admin123

User:
  Email: user1@example.com
  Password: user123456
  OR
  Email: user2@example.com
  Password: user123456
```

### Step 6: Start Development Server

```bash
npm run dev
```

**Output**:
```
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1234ms
```

Open http://localhost:3000

### Step 7: Test the Application

1. **Home Page**: http://localhost:3000
   - See landing page with module info

2. **Sign Up**: http://localhost:3000/auth/register
   - Create new account with email/password
   - Auto-login after signup

3. **Sign In**: http://localhost:3000/auth/login
   - Use test credentials above
   - Should redirect to dashboard

4. **Dashboard**: http://localhost:3000/dashboard
   - View profile
   - See applications (if any)

5. **View Database**: `npm run prisma:studio`
   - Opens http://localhost:5555
   - Browse all tables
   - See created users, applications, modules

---

## Database Structure

### Users Table
Stores user accounts and profiles:
```
- id (unique ID)
- email (unique)
- password (hashed with bcrypt)
- fullName
- phone
- role (USER, ADMIN, MODERATOR)
- education, description
```

### Applications Table
Stores applications for modules:
```
- id
- userId (links to User)
- moduleId (links to Module)
- status (PENDING, UNDER_REVIEW, APPROVED, REJECTED)
- formData (JSON with module-specific fields)
- cvUrl, supportingDocs
- reviewedBy, reviewComment
- createdAt, updatedAt
```

### Modules Table
Available modules/programs:
```
- id
- name (e.g., "Business Plan & Investment")
- description
- icon
- requirement
- color (for UI)
- fields (JSON array of field names)
```

### Other Tables
- **EnglishTest**: Language test scores
- **Account**: NextAuth OAuth accounts
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

---

## Common Tasks

### View Database in Prisma Studio
```bash
npm run prisma:studio
# Opens http://localhost:5555
```

### Run Migrations
```bash
# Create migration
npm run prisma:migrate -- --name migration_name

# Push changes
npm run db:push
```

### Reset Database
```bash
npm run db:push -- --force-reset
npm run db:seed
```

### Check Database Connection
```bash
# Connect directly
psql -U postgres -d dag_japa_db

# List tables
\dt

# View users
SELECT * FROM "User";

# Exit
\q
```

---

## Troubleshooting

### Error: "DATABASE_URL is invalid"
```bash
# Check .env.local exists
ls .env.local

# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Test connection string format:
postgresql://postgres:password@localhost:5432/dag_japa_db
                       ↑         ↑                      ↑
                    user       host                  database
```

### Error: "NEXTAUTH_SECRET is missing"
```bash
# Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
NEXTAUTH_SECRET="<your-generated-string>"

# Restart dev server
```

### Error: "password authentication failed for user 'postgres'"
- Wrong password in DATABASE_URL
- Check your PostgreSQL password
- Update DATABASE_URL in .env.local
- Restart dev server

### Error: "FATAL: database 'dag_japa_db' does not exist"
```bash
# Create database
createdb dag_japa_db

# Or using psql
psql -U postgres -c "CREATE DATABASE dag_japa_db;"

# Then run
npm run db:push
```

### Error: "Prisma Client not generated"
```bash
npm run prisma:generate
npm install
npm run dev
```

### Login fails with "Invalid email or password"
- Check .env.local DATABASE_URL is correct
- Run `npm run db:seed` to create test users
- Verify credentials:
  - Email: user1@example.com
  - Password: user123456

### Dev server won't start

**Windows**:
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Clear and restart
rm -r .next
npm install
npm run dev
```

**macOS/Linux**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Clear and restart
rm -rf .next
npm install
npm run dev
```

### Cannot connect to PostgreSQL

Check if PostgreSQL is running:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
sc query postgresql-x64-15
```

Start PostgreSQL if not running:
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
# Use Services app or:
net start postgresql-x64-15
```

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/signin` — Sign in (handled by NextAuth form)
- `GET /api/auth/session` — Get current session
- `POST /api/auth/signout` — Sign out

### Modules
- `GET /api/modules` — List all modules
- `GET /api/modules/[id]` — Get module details
- `POST /api/modules` — Create module (admin)
- `PUT /api/modules/[id]` — Update module (admin)
- `DELETE /api/modules/[id]` — Delete module (admin)

### Applications
- `GET /api/applications` — List applications (filter by userId, status)
- `GET /api/applications/[id]` — Get application details
- `POST /api/applications` — Submit new application
- `PUT /api/applications/[id]` — Update application status
- `DELETE /api/applications/[id]` — Delete application

### Users
- `GET /api/users` — List all users (admin)
- `GET /api/users/[id]` — Get user profile
- `PUT /api/users/[id]` — Update user profile

---

## Production Deployment

### Before Deploying

1. **Generate strong NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

2. **Update NEXTAUTH_URL** to your production domain:
   ```
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Use production PostgreSQL**:
   - Option 1: Managed service (Railway, Render, Heroku)
   - Option 2: AWS RDS, DigitalOcean, etc.

4. **Test build locally**:
   ```bash
   npm run build
   npm run start
   ```

### Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com/new
3. Select your GitHub repo
4. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
5. Deploy

### Deploy to Railway

1. Create account at https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Connect GitHub repo
5. Add environment variables
6. Deploy

### Deploy to Render

1. Create account at https://render.com
2. Create new web service
3. Connect GitHub
4. Create PostgreSQL database
5. Add environment variables
6. Deploy

---

## Next Steps

After setup:

1. ✅ Test signup/login
2. ✅ Explore dashboard
3. ⏳ Build module selection flow
4. ⏳ Implement application form
5. ⏳ Create admin dashboard
6. ⏳ Add email notifications
7. ⏳ Deploy to production

See `DEVELOPMENT_ROADMAP.md` for feature roadmap.

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## Getting Help

**If something doesn't work**:

1. Check `.env.local` has all variables
2. Verify PostgreSQL is running
3. Try: `npm run db:push`
4. Check browser console: F12 → Console
5. View database: `npm run prisma:studio`
6. Check terminal output for error messages

**Still stuck?**
- Review `MIGRATION_GUIDE.md` for architecture info
- Check `README.md` for project overview
- Look at existing code examples in `app/` directory

Good luck! 🚀
