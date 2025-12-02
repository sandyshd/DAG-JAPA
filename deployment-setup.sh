#!/bin/bash

# deployment-setup.sh
# Quick setup script for cPanel deployment

echo "=== Next.js cPanel Deployment Setup ==="
echo ""

# Step 1: Build
echo "1. Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi
echo "✓ Build completed successfully"
echo ""

# Step 2: Check ecosystem.config.js
echo "2. Checking ecosystem.config.js..."
if [ -f "ecosystem.config.js" ]; then
  echo "✓ ecosystem.config.js found"
else
  echo "✗ ecosystem.config.js not found. Creating..."
  cp ecosystem.config.js.example ecosystem.config.js
fi
echo ""

# Step 3: Generate NEXTAUTH_SECRET if needed
echo "3. Checking .env.local..."
if [ -f ".env.local" ]; then
  if grep -q "NEXTAUTH_SECRET=" .env.local; then
    echo "✓ NEXTAUTH_SECRET is set"
  else
    echo "⚠ NEXTAUTH_SECRET not set in .env.local"
    echo "  Generate one with: openssl rand -base64 32"
  fi
else
  echo "✗ .env.local not found. Create it with production values."
fi
echo ""

# Step 4: Show next steps
echo "=== Next Steps ==="
echo ""
echo "1. Zip and upload to cPanel:"
echo "   zip -r dag-japa-nextjs.zip . -x 'node_modules/*' '.next/*' '.git/*' '.env.local'"
echo ""
echo "2. SSH into your server:"
echo "   ssh username@your-cpanel-host"
echo ""
echo "3. Extract and setup:"
echo "   cd /home/username/public_html/developing.africa"
echo "   unzip dag-japa-nextjs.zip"
echo "   npm install --production"
echo ""
echo "4. Configure environment:"
echo "   nano .env.local  # Add production DATABASE_URL, NEXTAUTH_SECRET, etc."
echo ""
echo "5. Run Prisma migrations:"
echo "   npx prisma migrate deploy"
echo ""
echo "6. Start with PM2:"
echo "   pm2 start ecosystem.config.js --env production"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "✓ Deployment guide available in: DEPLOYMENT_CPANEL.md"
