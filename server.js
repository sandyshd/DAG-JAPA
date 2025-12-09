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

if (!hasNodeModules) {
  console.error('[server.js] *** npm install needed ***');
  console.error('[server.js] Installing npm dependencies...');
  console.error('[server.js] This may take a few minutes on first deployment...');
  console.error('[server.js] Running: npm install --production --no-save');
  
  try {
    const result = spawnSync('npm', ['install', '--production', '--no-save'], {
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 10 * 60 * 1000, // 10 minute timeout
      shell: true, // Use shell to ensure npm is found
    });

    console.error('[server.js] npm install exit code:', result.status);
    console.error('[server.js] npm install error:', result.error);

    if (result.error) {
      console.error('[server.js] ERROR: npm install failed with error:', result.error);
      console.error('[server.js] Attempting to continue anyway...');
    }

    if (result.status !== 0 && result.status !== null) {
      console.error('[server.js] ERROR: npm install failed with exit code:', result.status);
      console.error('[server.js] Attempting to continue anyway...');
    }

    // Verify node_modules was created
    if (fs.existsSync(nodeModulesPath)) {
      console.error('[server.js] ✓ node_modules created successfully');
    } else {
      console.error('[server.js] ✗ WARNING: node_modules was not created');
    }
  } catch (error) {
    console.error('[server.js] ERROR: Exception during npm install:', error);
    console.error('[server.js] Attempting to continue anyway...');
  }
} else {
  console.error('[server.js] node_modules already exists, skipping npm install');
}

// List what's in the current directory
console.error('[server.js] *** Current directory contents ***');
try {
  const files = fs.readdirSync(__dirname);
  files.forEach(f => console.error('[server.js]   -', f));
} catch (e) {
  console.error('[server.js] Could not list directory:', e.message);
}

// Now start the Next.js server
console.error('[server.js] *** Starting Next.js server via npm start ***');
console.error('[server.js] Running: npm start');

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
