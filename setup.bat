@echo off
echo 🚀 DAG JAPA Next.js Setup Script
echo ==================================

REM Check if .env.local exists
if not exist .env.local (
  echo ❌ .env.local not found!
  echo Please create .env.local based on .env.example:
  echo   copy .env.example .env.local
  echo.
  echo Fill in your database and Supabase credentials.
  exit /b 1
)

echo ✅ .env.local found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Generate Prisma Client
echo.
echo 🔧 Generating Prisma Client...
call npm run prisma:generate

REM Push schema to database
echo.
echo 🗄️  Pushing database schema...
call npm run db:push

REM Seed database
echo.
echo 🌱 Seeding database...
call npm run db:seed

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Start development server:
echo    npm run dev
echo.
echo 📚 View database:
echo    npm run prisma:studio
