const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const zipFile = path.join(rootDir, 'out.zip');

console.log('--- Preparing "out" folder for Hostinger ---');

// 1. Clean previous out folder
if (fs.existsSync(outDir)) {
  console.log('Cleaning old out folder...');
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// 2. Copy standalone files
const standaloneDir = path.join(rootDir, '.next', 'standalone');
if (!fs.existsSync(standaloneDir)) {
  console.error('Error: .next/standalone does not exist! Run npm run build first.');
  process.exit(1);
}

console.log('Copying standalone build into out folder...');
fs.cpSync(standaloneDir, outDir, { recursive: true });

// 3. Copy .next/static into out/.next/static
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(outDir, '.next', 'static');
console.log('Copying .next/static into out folder...');
fs.mkdirSync(path.dirname(staticDest), { recursive: true });
fs.cpSync(staticSrc, staticDest, { recursive: true });

// 4. Copy public into out/public
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(outDir, 'public');
console.log('Copying public folder into out folder...');
fs.cpSync(publicSrc, publicDest, { recursive: true });

// 5. Copy .env
const envSrc = fs.existsSync(path.join(rootDir, '.env'))
  ? path.join(rootDir, '.env')
  : path.join(rootDir, '.env.example');
const envDest = path.join(outDir, '.env');
console.log('Copying .env file into out folder...');
fs.copyFileSync(envSrc, envDest);

console.log('Out folder ready at: ' + outDir);

// 6. Optional: Create out.zip as well
console.log('Creating out.zip archive...');
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });
  console.log('out.zip created successfully!');
} catch (err) {
  console.warn('PowerShell zip notice:', err.message);
}
