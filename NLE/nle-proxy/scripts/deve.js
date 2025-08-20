#!/usr/bin/env node

const { spawn } = require('child_process');
const { resolve } = require('path');

// Get the NLE HTML file path
const nlePath = resolve(__dirname, '../src/nle_v_2.html');

// Function to open URL in default browser
function openBrowser(url) {
  const platform = process.platform;
  const command = platform === 'darwin' ? 'open' :
                  platform === 'win32' ? 'start' :
                  'xdg-open';
  
  spawn(command, [url], { detached: true, stdio: 'ignore' }).unref();
}

// Start the server
console.log('Starting NLE proxy server...');
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Wait a bit for server to start, then open browser
setTimeout(() => {
  console.log('\nOpening NLE dashboard...');
  openBrowser(`file://${nlePath}`);
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.kill('SIGINT');
  process.exit();
});