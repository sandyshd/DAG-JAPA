#!/usr/bin/env node
/**
 * Wrapper script for Windows App Service
 * Installs npm dependencies on first run, then starts the Next.js server
 */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(__dirname, 'node_modules');
const packageLockPath = path.join(__dirname, 'package-lock.json');

console.error('[server.js] ================================');
console.error('[server.js] Starting Next.js server wrapper...');
console.error('[server.js] Current directory:', __dirname);
console.error('[server.js] NODE_ENV:', process.env.NODE_ENV || 'production');
console.error('[server.js] PORT:', process.env.PORT || '3000');
console.error('[server.js] Process:', process.version);
console.error('[server.js] ================================');

// Check if node_modules exists
const hasNodeModules = fs.existsSync(nodeModulesPath);
console.error('[server.js] node_modules exists:', hasNodeModules);

// List root directory to verify source files are present
console.error('[server.js] *** Checking for required source folders ***');
const requiredFolders = ['app', 'lib', 'types', '.next', 'prisma', 'public'];
const missingFolders = [];

requiredFolders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  const exists = fs.existsSync(folderPath);
  if (exists) {
    console.error(`[server.js] ✓ ${folder}/ found`);
  } else {
    console.error(`[server.js] ✗ ${folder}/ MISSING`);
    missingFolders.push(folder);
  }
});

if (missingFolders.length > 0) {
  console.error(`[server.js] ERROR: Missing critical folders: ${missingFolders.join(', ')}`);
  console.error('[server.js] The deployment package may be incomplete!');
}

if (!hasNodeModules) {
  console.error('[server.js] *** npm install needed ***');
  console.error('[server.js] Installing npm dependencies...');
  console.error('[server.js] This may take 3-10 minutes on first deployment...');
  console.error('[server.js] Running: npm install --production --no-save');
  
  try {
    const result = spawnSync('npm', ['install', '--production', '--no-save'], {
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 15 * 60 * 1000, // 15 minute timeout (increased from 10)
      shell: true, // Use shell to ensure npm is found
    });

    console.error('[server.js] npm install exit code:', result.status);
    
    if (result.error) {
      console.error('[server.js] ERROR: npm install failed with error:', result.error);
    }

    if (result.status !== 0 && result.status !== null) {
      console.error('[server.js] ERROR: npm install exited with code:', result.status);
    }

    // Verify node_modules was created
    if (fs.existsSync(nodeModulesPath)) {
      console.error('[server.js] ✓ node_modules created successfully');
      const count = fs.readdirSync(nodeModulesPath).length;
      console.error(`[server.js] Installed ${count} dependencies`);
    } else {
      console.error('[server.js] ✗ WARNING: node_modules was not created');
      console.error('[server.js] This will likely cause the app to fail!');
    }
  } catch (error) {
    console.error('[server.js] ERROR: Exception during npm install:', error);
  }
} else {
  console.error('[server.js] node_modules already exists, skipping npm install');
}

// List what's in the current directory
console.error('[server.js] *** Current directory contents ***');
try {
  const files = fs.readdirSync(__dirname);
  files.sort().forEach(f => {
    const fullPath = path.join(__dirname, f);
    const isDir = fs.statSync(fullPath).isDirectory();
    console.error('[server.js]   ' + (isDir ? '[DIR]  ' : '[FILE] ') + f);
  });
} catch (e) {
  console.error('[server.js] Could not list directory:', e.message);
}

// Now start the Next.js server
console.error('[server.js] *** Starting Next.js server via npm start ***');
console.error('[server.js] Running: npm start');
console.error('[server.js] ================================');

const nextProcess = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT || '3000',
  },
  shell: true, // Use shell on Windows
});

nextProcess.on('error', (err) => {
  console.error('[server.js] ERROR: Failed to start Next.js server:', err);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.error('[server.js] Next.js server exited with code:', code);
  process.exit(code || 1);
});

// Handle signals
process.on('SIGTERM', () => {
  console.error('[server.js] SIGTERM received, shutting down gracefully...');
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.error('[server.js] SIGINT received, shutting down gracefully...');
  nextProcess.kill('SIGINT');
});

// Catch any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[server.js] UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
