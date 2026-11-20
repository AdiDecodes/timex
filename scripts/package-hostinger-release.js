const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const releaseDir = path.resolve(__dirname, "../HOSTINGER_FINAL_RELEASE");
const rootDir = path.resolve(__dirname, "..");
const zipPath = path.resolve(__dirname, "../HOSTINGER_FINAL_RELEASE.zip");

console.log("Preparing HOSTINGER_FINAL_RELEASE directory at:", releaseDir);

// 1. Clean previous release dir and zip if exists
if (fs.existsSync(releaseDir)) {
  fs.rmSync(releaseDir, { recursive: true, force: true });
}
fs.mkdirSync(releaseDir, { recursive: true });

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

function copyRecursiveSync(src, dest, filterFn) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (filterFn && !filterFn(src, isDirectory)) {
    return;
  }

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName), filterFn);
    });
  } else if (exists) {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// 2. Copy .next (strictly excluding .next/dev, .next/cache, diagnostics, traces)
console.log("Copying .next (strictly excluding .next/dev, .next/cache, diagnostics, traces)...");
copyRecursiveSync(path.join(rootDir, ".next"), path.join(releaseDir, ".next"), (srcPath, isDir) => {
  const norm = srcPath.replace(/\\/g, "/");
  if (norm.includes("/.next/cache")) return false;
  if (norm.includes("/.next/dev")) return false;
  if (norm.includes("/.next/diagnostics")) return false;
  if (norm.includes("/.next/trace")) return false;
  return true;
});

// 3. Copy src
console.log("Copying src...");
copyRecursiveSync(path.join(rootDir, "src"), path.join(releaseDir, "src"));

// 4. Copy server (strictly excluding server/data/store.json to preserve production live store, including corrected_products.json & migration script)
console.log("Copying server (strictly excluding store.json to prevent overwriting production data)...");
copyRecursiveSync(path.join(rootDir, "server"), path.join(releaseDir, "server"), (srcPath, isDir) => {
  const norm = srcPath.replace(/\\/g, "/");
  if (norm.endsWith("/server/data/store.json")) return false;
  if (norm.includes("store.backup")) return false;
  return true;
});

// 5. Copy public (strictly excluding public/uploads and public/catalogue to preserve production uploads and avoid multi-GB archive)
console.log("Copying public assets (strictly excluding uploads & catalogues)...");
copyRecursiveSync(path.join(rootDir, "public"), path.join(releaseDir, "public"), (srcPath, isDir) => {
  const norm = srcPath.replace(/\\/g, "/");
  if (norm.includes("/public/uploads")) return false;
  if (norm.includes("/public/catalogue")) return false;
  return true;
});

// 6. Copy root configuration files & scripts
console.log("Copying configuration & migration files...");
const rootFiles = [
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "schema_changes.sql",
];

rootFiles.forEach((file) => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(releaseDir, file));
    console.log(`Copied ${file}`);
  }
});

// 7. Generate comprehensive README_DEPLOYMENT.txt
const readmeContent = `================================================================================
 TIMEX CERAMIC - HOSTINGER PRODUCTION RELEASE DEPLOYMENT GUIDE
================================================================================
 Release Target: Hostinger Ubuntu VPS
 Project Directory: /var/www/timex-ceramic-new
 Architecture: Next.js 16 (Port 3000) + Express Backend (Port 5001) + MySQL + PM2
 Date: ${new Date().toISOString()}
================================================================================

PRODUCTION DATA PRESERVATION GUARANTEES IN THIS RELEASE:
--------------------------------------------------------------------------------
1. ZERO DATA LOSS ON EXTRACTION:
   - 'server/data/store.json' is INTENTIONALLY EXCLUDED from this archive.
   - Extracting with 'unzip -o' will NEVER overwrite your live production
     customer enquiries, admin accounts, blogs, media, pages, FAQs, or SEO records!

2. ZERO OVERWRITE ON ASSETS & CONFIGS:
   - 'public/uploads' is EXCLUDED (all live product photos on VPS preserved).
   - 'public/catalogue' is EXCLUDED (all PDF catalogues on VPS preserved).
   - '.env.production' is EXCLUDED (all database passwords & secrets preserved).
   - '.next/dev' and build caches are EXCLUDED for clean production runtime.

3. SAFE DATA MIGRATION STRATEGY:
   - The 106 audited and corrected products are bundled in:
     'server/data/corrected_products.json'.
   - The 18 standard and extended colours are bundled in:
     'server/data/defaultColors.json'.
   - The safe merger script 'server/scripts/merge-production-data.js' merges
     the 106 corrected products and colours into your existing 'store.json'
     while leaving 100% of your live enquiries, admin users, blogs, and pages untouched.
   - Run: 'npm run migrate:data'
   - In MySQL, 'schema_changes.sql' uses 'ON DUPLICATE KEY UPDATE' to sync
     the 106 products into the database without touching 'admin_users' or any
     other live records.

--------------------------------------------------------------------------------
STEP-BY-STEP DEPLOYMENT INSTRUCTIONS FOR HOSTINGER VPS:
--------------------------------------------------------------------------------

STEP 1: BACK UP EXISTING VPS DEPLOYMENT
--------------------------------------------------------------------------------
Connect to your VPS via SSH and create a safe backup:
  ssh client@your-server-ip
  sudo cp -r /var/www/timex-ceramic-new /var/www/timex-backup-$(date +%Y%m%d_%H%M%S)

STEP 2: UPLOAD THIS RELEASE
--------------------------------------------------------------------------------
Upload 'HOSTINGER_FINAL_RELEASE.zip' to your VPS (e.g. using scp or FileZilla/Cyberduck):
  scp HOSTINGER_FINAL_RELEASE.zip client@your-server-ip:/tmp/

STEP 3: EXTRACT INTO PRODUCTION DIRECTORY
--------------------------------------------------------------------------------
Extract files directly into /var/www/timex-ceramic-new:
  cd /var/www/timex-ceramic-new
  unzip -o /tmp/HOSTINGER_FINAL_RELEASE.zip -d /var/www/timex-ceramic-new/

* NOTE: The archive is packaged with a flat root structure so files unpack
  directly into /var/www/timex-ceramic-new without creating an unwanted
  nested HOSTINGER_FINAL_RELEASE/ folder.

STEP 4: RUN IDEMPOTENT DATABASE MIGRATION
--------------------------------------------------------------------------------
Execute the safe schema changes and product sync in MySQL:
  mysql -u root -p timex_ceramic < /var/www/timex-ceramic-new/schema_changes.sql

* NOTE: This script is 100% idempotent:
  - Adds missing columns (available_colors_json, color_hexes_json, space_images_json, etc.).
  - Creates missing tables (colors, category_faqs, etc.) if not exists.
  - Updates/syncs the 106 audited products via 'ON DUPLICATE KEY UPDATE'.
  - Does NOT drop or truncate any tables.
  - Leaves existing admin credentials completely untouched.

STEP 5: RUN SAFE DATA MERGE FOR STORE.JSON
--------------------------------------------------------------------------------
Safely merge the 106 corrected products and colour records into your live store.json:
  cd /var/www/timex-ceramic-new
  npm run migrate:data

* This command creates a safety timestamped backup of store.json, then updates
  only the audited products and colours, preserving 100% of your live enquiries,
  admin users, blogs, media, and pages.

STEP 6: INSTALL RUNTIME DEPENDENCIES
--------------------------------------------------------------------------------
In the project directory, run:
  cd /var/www/timex-ceramic-new
  npm install --omit=dev

STEP 7: RESTART APPLICATION PROCESSES VIA PM2
--------------------------------------------------------------------------------
Restart your PM2 managed processes:
  pm2 restart all

Or if named specifically:
  pm2 restart timex-frontend
  pm2 restart timex-backend

Save PM2 state for automatic reboot persistence:
  pm2 save

STEP 8: POST-DEPLOYMENT VERIFICATION CHECKS
--------------------------------------------------------------------------------
1. Check PM2 status:
   pm2 status

2. Verify Frontend (Port 3000):
   curl -I http://localhost:3000

3. Verify Express Backend (Port 5001):
   curl -I http://localhost:5001/api/v1/colors?activeOnly=true
   curl -I http://localhost:5001/api/v1/products?limit=1

4. Test in Browser:
   - Visit https://www.timexceramic.com
   - Test BY COLOR navigation dropdown (Beige, Gold, Black, White, etc.)
   - Test Wall Tiles (/wall-tiles) and Floor Tiles (/floor-tiles)
   - Test Admin Login at https://www.timexceramic.com/admin/login
   - Verify Admin Color Management and Product Editor

================================================================================
DEPLOYMENT COMPLETE - READY FOR CLIENT LIVE EVENT
================================================================================
`;

fs.writeFileSync(path.join(releaseDir, "README_DEPLOYMENT.txt"), readmeContent, "utf8");
console.log("Generated README_DEPLOYMENT.txt");

// 8. Compress HOSTINGER_FINAL_RELEASE into HOSTINGER_FINAL_RELEASE.zip using tar.exe
console.log("Compressing HOSTINGER_FINAL_RELEASE into HOSTINGER_FINAL_RELEASE.zip...");
execSync("tar.exe -a -c -f HOSTINGER_FINAL_RELEASE.zip -C HOSTINGER_FINAL_RELEASE .", {
  cwd: rootDir,
  maxBuffer: 50 * 1024 * 1024,
});

const zipStats = fs.statSync(zipPath);
console.log(`\nSuccessfully generated HOSTINGER_FINAL_RELEASE.zip! Size: ${(zipStats.size / (1024 * 1024)).toFixed(2)} MB`);
