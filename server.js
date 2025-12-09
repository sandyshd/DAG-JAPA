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

console.log('[server.js] Starting Next.js server wrapper...');
console.log('[server.js] Current directory:', __dirname);
console.log('[server.js] NODE_ENV:', process.env.NODE_ENV || 'production');

// Check if node_modules exists
const hasNodeModules = fs.existsSync(nodeModulesPath);
console.log('[server.js] node_modules exists:', hasNodeModules);

if (!hasNodeModules) {
  console.log('[server.js] Installing npm dependencies...');
  console.log('[server.js] This may take a few minutes on first deployment...');
  
  try {
    const result = spawnSync('npm', ['install', '--production', '--no-save'], {
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 5 * 60 * 1000, // 5 minute timeout
    });

    if (result.error) {
      console.error('[server.js] npm install failed with error:', result.error);
      process.exit(1);
    }

    if (result.status !== 0) {
      console.error('[server.js] npm install failed with exit code:', result.status);
      process.exit(1);
    }

    console.log('[server.js] npm install completed successfully');
  } catch (error) {
    console.error('[server.js] Error running npm install:', error);
    process.exit(1);
  }
} else {
  console.log('[server.js] node_modules already exists, skipping npm install');
}

// Now start the Next.js server
console.log('[server.js] Starting Next.js server via npm start...');

const nextProcess = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT || '3000',
  },
});

nextProcess.on('error', (err) => {
  console.error('[server.js] Failed to start Next.js server:', err);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log('[server.js] Next.js server exited with code:', code);
  process.exit(code || 1);
});

// Handle signals
process.on('SIGTERM', () => {
  console.log('[server.js] SIGTERM received, shutting down gracefully...');
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('[server.js] SIGINT received, shutting down gracefully...');
  nextProcess.kill('SIGINT');
});
