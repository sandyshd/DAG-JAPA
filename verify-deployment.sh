#!/bin/bash

# verify-deployment.sh
# Run this on the cPanel server after deployment to verify everything is working

echo "=== Deployment Verification Script ==="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
  else
    echo -e "${RED}✗ $2${NC}"
  fi
}

# 1. Check Node.js version
echo "1. Checking Node.js..."
node -v
npm -v
print_status $? "Node.js and npm installed"
echo ""

# 2. Check PM2
echo "2. Checking PM2..."
pm2 -v
print_status $? "PM2 installed"
echo ""

# 3. Check application status
echo "3. Checking application status..."
pm2 status dag-japa-nextjs
print_status $? "Application found in PM2"
echo ""

# 4. Check .env.local
echo "4. Checking .env.local..."
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓ .env.local exists${NC}"
  
  if grep -q "DATABASE_URL=" .env.local; then
    echo -e "${GREEN}✓ DATABASE_URL configured${NC}"
  else
    echo -e "${RED}✗ DATABASE_URL not configured${NC}"
  fi
  
  if grep -q "NEXTAUTH_SECRET=" .env.local; then
    echo -e "${GREEN}✓ NEXTAUTH_SECRET configured${NC}"
  else
    echo -e "${RED}✗ NEXTAUTH_SECRET not configured${NC}"
  fi
else
  echo -e "${RED}✗ .env.local not found${NC}"
fi
echo ""

# 5. Test local connection
echo "5. Testing local connection..."
curl -s http://localhost:3000 > /dev/null
print_status $? "Application responding on port 3000"
echo ""

# 6. Check logs
echo "6. Checking recent logs..."
echo "Recent PM2 logs:"
pm2 logs dag-japa-nextjs --lines 5
echo ""

# 7. Check disk space
echo "7. Checking disk space..."
df -h
echo ""

# 8. Check memory usage
echo "8. Checking memory usage..."
free -h
echo ""

# 9. Check Prisma
echo "9. Checking Prisma..."
if [ -f ".env.local" ]; then
  export $(cat .env.local | grep DATABASE_URL)
  npx prisma db execute --stdin < /dev/null 2>/dev/null
  print_status $? "Database connection working"
else
  echo -e "${YELLOW}⚠ Cannot test database without .env.local${NC}"
fi
echo ""

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Check PM2 logs: pm2 logs dag-japa-nextjs"
echo "2. Test API endpoints: curl https://developing.africa/api/modules"
echo "3. Monitor application: pm2 monit"
echo "4. Check production logs:"
echo "   tail -f logs/error.log"
echo "   tail -f logs/out.log"
