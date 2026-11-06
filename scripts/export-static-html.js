const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const appDir = path.join(rootDir, 'app');
const apiDir = path.join(appDir, 'api');
const adminDir = path.join(appDir, 'admin');
const middlewareFile = path.join(rootDir, 'middleware.js');

const apiBackup = path.join(rootDir, '_temp_api_backup');
const adminBackup = path.join(rootDir, '_temp_admin_backup');
const middlewareBackup = path.join(rootDir, '_temp_middleware_backup.js');

const configPath = path.join(rootDir, 'next.config.mjs');
const configBackup = path.join(rootDir, '_next.config.mjs.bak');
const outDir = path.join(rootDir, 'out');
const distDir = path.join(rootDir, 'dist');
const zipFile = path.join(rootDir, 'public_html.zip');
const dotNextDir = path.join(rootDir, '.next');

console.log('=== Building Static HTML Export for Hostinger (like _public_html) ===');

try {
  // 1. Backup next.config.mjs
  fs.copyFileSync(configPath, configBackup);

  // 2. Set export config with trailingSlash for universal Apache/Hostinger support
  const exportConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;
  fs.writeFileSync(configPath, exportConfig, 'utf8');

  // 3. Temporarily move api, admin & middleware
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiBackup);
  }
  if (fs.existsSync(adminDir)) {
    fs.renameSync(adminDir, adminBackup);
  }
  if (fs.existsSync(middlewareFile)) {
    fs.renameSync(middlewareFile, middlewareBackup);
  }

  // 4. Clean previous out, dist & .next folders
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  if (fs.existsSync(dotNextDir)) {
    fs.rmSync(dotNextDir, { recursive: true, force: true });
  }

  // 5. Run next build
  console.log('Running Next.js static build...');
  execSync('npx next build', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: 'true' },
  });

  // 6. Create production-ready .htaccess for Hostinger Apache/LiteSpeed
  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve existing file or directory directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Clean URL directory index rewrite (e.g. /videos -> /videos/index.html)
  RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
  RewriteRule ^(.*)/?$ $1/index.html [L]

  # Direct HTML file rewrite (e.g. /about -> /about.html)
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>

# Custom 404 page
ErrorDocument 404 /404.html

# Long-term caching for Next.js immutable assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
`;
  fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf8');

  // 7. Duplicate out into dist so both 'out' and 'dist' are available
  console.log('Syncing out folder to dist folder...');
  fs.cpSync(outDir, distDir, { recursive: true });

  console.log('Build completed successfully! Creating zip file...');

  // 8. Compress out folder to public_html.zip
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });

  console.log('=== SUCCESS! ===');
  console.log('Static build folder (out): ' + outDir);
  console.log('Static build folder (dist): ' + distDir);
  console.log('Hostinger upload zip: ' + zipFile);

} catch (err) {
  console.error('Error during static export:', err);
} finally {
  // Restore everything
  if (fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
  }
  if (fs.existsSync(adminBackup)) {
    fs.renameSync(adminBackup, adminDir);
  }
  if (fs.existsSync(middlewareBackup)) {
    fs.renameSync(middlewareBackup, middlewareFile);
  }
  if (fs.existsSync(configBackup)) {
    fs.copyFileSync(configBackup, configPath);
    fs.unlinkSync(configBackup);
  }
  console.log('Restored source files and config.');
}
