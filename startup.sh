#!/bin/bash
set -e

echo "=== DAG JAPA Startup Script ==="
echo ""

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "Installing production dependencies..."
  npm ci
else
  echo "✓ node_modules already exists, skipping npm ci"
fi

echo ""
echo "Generating Prisma client..."
npx prisma generate

echo ""
echo "Starting Next.js application..."
npm start
