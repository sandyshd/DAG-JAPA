#!/bin/bash
# Deployment script for Azure App Service
# Runs after ZIP is extracted; installs node_modules from package-lock.json

echo "Running post-deployment script..."
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

# Install production dependencies from package-lock.json
echo "Installing production dependencies..."
npm install --production --no-save || {
  echo "npm install failed; trying with --force"
  npm install --production --no-save --force
}

echo "Dependencies installed successfully"
echo "Current directory contents:"
ls -la

echo "Post-deployment script completed."
