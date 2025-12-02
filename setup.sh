#!/bin/bash

echo "🚀 DAG JAPA Next.js Setup Script"
echo "=================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found!"
  echo "Please create .env.local based on .env.example:"
  echo "  cp .env.example .env.local"
  echo ""
  echo "Fill in your database and Supabase credentials."
  exit 1
fi

echo "✅ .env.local found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Push schema to database
echo ""
echo "🗄️  Pushing database schema..."
npm run db:push

# Seed database
echo ""
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "📚 View database:"
echo "   npm run prisma:studio"
