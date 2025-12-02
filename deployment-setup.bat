@echo off
REM deployment-setup.bat
REM Quick setup script for cPanel deployment (Windows)

echo === Next.js cPanel Deployment Setup ===
echo.

REM Step 1: Build
echo 1. Building Next.js application...
call npm run build
if errorlevel 1 (
  echo Build failed. Exiting.
  exit /b 1
)
echo √ Build completed successfully
echo.

REM Step 2: Check ecosystem.config.js
echo 2. Checking ecosystem.config.js...
if exist "ecosystem.config.js" (
  echo √ ecosystem.config.js found
) else (
  echo × ecosystem.config.js not found. Please create it manually.
)
echo.

REM Step 3: Check .env.local
echo 3. Checking .env.local...
if exist ".env.local" (
  echo √ .env.local found
  findstr /M "NEXTAUTH_SECRET=" .env.local >nul
  if errorlevel 1 (
    echo × NEXTAUTH_SECRET not set in .env.local
    echo   Generate one with: openssl rand -base64 32
  ) else (
    echo √ NEXTAUTH_SECRET is set
  )
) else (
  echo × .env.local not found. Create it with production values.
)
echo.

REM Step 4: Show next steps
echo === Next Steps ===
echo.
echo 1. Zip and upload to cPanel:
echo    Remove node_modules and .next before zipping
echo    PowerShell: Compress-Archive -Path . -DestinationPath dag-japa-nextjs.zip
echo.
echo 2. SSH into your server:
echo    ssh username@your-cpanel-host
echo.
echo 3. Extract and setup:
echo    cd /home/username/public_html/developing.africa
echo    unzip dag-japa-nextjs.zip
echo    npm install --production
echo.
echo 4. Configure environment:
echo    nano .env.local
echo.
echo 5. Run Prisma migrations:
echo    npx prisma migrate deploy
echo.
echo 6. Start with PM2:
echo    pm2 start ecosystem.config.js --env production
echo    pm2 save
echo    pm2 startup
echo.
echo √ Deployment guide available in: DEPLOYMENT_CPANEL.md
echo.
pause
