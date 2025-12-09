@echo off
REM Deployment script for Azure App Service (Windows)
REM Installs Node.js production dependencies after ZIP extraction

setlocal enabledelayedexpansion

echo.
echo ========== Post-Deployment Script ==========
echo Current directory: %CD%
echo Node version: 
call node --version
echo npm version:
call npm --version
echo.

echo Installing production dependencies from package-lock.json...
call npm install --production --no-save
if errorlevel 1 (
  echo npm install failed with code !errorlevel!. Retrying with --force...
  call npm install --production --no-save --force
  if errorlevel 1 (
    echo ERROR: npm install failed even with --force flag
    exit /b 1
  )
)

echo.
echo Directory contents after npm install:
dir /B

echo.
echo Post-deployment script completed successfully.
exit /b 0
