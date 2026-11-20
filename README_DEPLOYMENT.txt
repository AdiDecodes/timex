================================================================================
 TIMEX CERAMIC — HOSTINGER VPS PRODUCTION DEPLOYMENT GUIDE
================================================================================
Project: Timex Ceramic Luxury Surfaces
Host OS: Ubuntu Linux (Hostinger VPS)
Live Path: /var/www/timex-ceramic-new
Frontend: Next.js 16 (Port 3000, managed by PM2: timex-frontend)
Backend: Express 5 + Node.js (Port 5001, managed by PM2: timex-backend)
Database: MySQL (Database: timex_ceramic)
================================================================================

--------------------------------------------------------------------------------
 1. CRITICAL: EXISTING VPS FILES THAT MUST BE PRESERVED
--------------------------------------------------------------------------------
DO NOT delete, overwrite, or replace any of the following live files/directories
already present in /var/www/timex-ceramic-new on the VPS:

1. Environment Secrets:
   - /var/www/timex-ceramic-new/.env
   - /var/www/timex-ceramic-new/.env.production
   - /var/www/timex-ceramic-new/.env.local
   (These files contain your live MySQL credentials, JWT secret keys, and SMTP settings)

2. Live Runtime Store & Data:
   - /var/www/timex-ceramic-new/server/data/store.json
   - /var/www/timex-ceramic-new/server/data/store.backup*.json
   (These files hold live fallback products, inquiries, and audit logs)

3. Media Uploads & Catalogues:
   - /var/www/timex-ceramic-new/public/uploads/
   - /var/www/timex-ceramic-new/public/catalogue/
   - /var/www/timex-ceramic-new/public/catalogues/
   (These directories contain all your uploaded product photos, high-res gallery images, and PDF catalogues)

4. Process Manager Configuration:
   - /var/www/timex-ceramic-new/ecosystem.config.js
   (Contains your running PM2 environment variables and port bindings)

5. Live Production Database:
   - The MySQL database `timex_ceramic` MUST NOT be reset, dropped, or re-seeded.

--------------------------------------------------------------------------------
 2. WHAT IS INCLUDED IN THIS HOSTINGER_DEPLOYMENT PACKAGE
--------------------------------------------------------------------------------
This folder contains the complete runtime and source package with all latest
frontend, backend, Admin Panel, Dynamic Color Management, and multi-category features:

1. `.next/`
   - Complete Next.js 16 production build output.
   - Pre-compiled server components, SSG pages, static assets, and manifest routes.
   - Includes all 592 optimized routes (including `/admin/colors` and `/color/[slug]`).
   - Cleaned of build cache to keep transfer fast and lightweight (~530MB).

2. `src/`
   - All latest frontend source code:
     - Admin Panel: Color Management (`/admin/colors`), Space-Specific Images, Multi-Category selection.
     - Product Editor: Technical Specifications (Tab 2) Color multi-select dropdown.
     - Header: Dynamic 3-column BY COLOR mega menu syncing with `/api/v1/colors`.
     - Layout, components, hooks, services, and types.

3. `server/`
   - Complete Express backend:
     - `server/routes/colors.routes.js`: Full CRUD API for dynamic colors.
     - `server/routes/products.routes.js`: Product serialization for colors and multiple categories.
     - `server/app.js`: Route mounts on `/api/v1/*`, `/v1/*`, and `/*`.
     - `server/config/db.js`: Database pool and migration checks.
     - `server/data/`: Contains ONLY default reference templates (`defaultColors.json`, `defaultSpaces.json`, etc.).
       Notice that `store.json` has been strictly excluded from this package.

4. `public/`
   - Core static website branding (images, timex-logo.png, favicons, .htaccess, llms.txt, _redirects).
   - Excludes uploads/ and catalogue/ so live VPS files remain untouched.

5. Root Config & Package Files:
   - `package.json` & `package-lock.json`
   - `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`

6. Database Reference:
   - `schema_changes.sql`: SQL migration script for `colors` table and `products` columns.

--------------------------------------------------------------------------------
 3. STEP-BY-STEP VPS DEPLOYMENT PROCEDURE
--------------------------------------------------------------------------------

STEP 1: Create a safety backup on the VPS (Recommended)
-------------------------------------------------------
SSH into your VPS and run:
  cd /var/www
  tar -czf timex_backup_$(date +%F).tar.gz timex-ceramic-new/

STEP 2: Upload HOSTINGER_DEPLOYMENT to the VPS
---------------------------------------------
You can upload either via SCP, rsync, SFTP (FileZilla / Cyberduck), or by creating
a zip of HOSTINGER_DEPLOYMENT:

Example using rsync from your local computer:
  rsync -avz --exclude='store.json' HOSTINGER_DEPLOYMENT/ root@<VPS_IP>:/var/www/timex-ceramic-new/

Or if uploading a zip file (e.g. deploy.zip):
  unzip -o deploy.zip -d /var/www/timex-ceramic-new/

STEP 3: Ensure correct file ownership on VPS
-------------------------------------------
Run on the VPS:
  sudo chown -R www-data:www-data /var/www/timex-ceramic-new
  # Or your deployment user (e.g. ubuntu):
  # sudo chown -R ubuntu:ubuntu /var/www/timex-ceramic-new

STEP 4: Install any new production dependencies
----------------------------------------------
Run in the live directory:
  cd /var/www/timex-ceramic-new
  npm install --omit=dev

STEP 5: Database Schema Migration
---------------------------------
Option A: Automatic (Default)
When `server/app.js` starts, `initSchemaAndSeed()` automatically checks and runs:
- `CREATE TABLE IF NOT EXISTS colors (...)`
- `ALTER TABLE products ADD COLUMN available_colors_json LONGTEXT NULL`
- `ALTER TABLE products ADD COLUMN color_hexes_json LONGTEXT NULL`
- Seeds the initial 16 colors if the table is empty.

Option B: Manual via MySQL CLI
If you prefer to execute the schema changes manually beforehand, run:
  mysql -u root -p timex_ceramic < /var/www/timex-ceramic-new/schema_changes.sql

STEP 6: Restart PM2 Services
----------------------------
Restart both the backend (5001) and frontend (3000) services:
  pm2 restart timex-backend
  pm2 restart timex-frontend

Or restart all:
  pm2 restart all

STEP 7: Verification & Health Check
-----------------------------------
1. Check PM2 status:
   pm2 status
   (Both timex-backend and timex-frontend should show status: "online")

2. Check PM2 logs for any errors:
   pm2 logs --lines 50

3. Verify Backend API (Port 5001):
   curl -I http://localhost:5001/api/v1/products
   curl -I http://localhost:5001/api/v1/colors

4. Verify Frontend (Port 3000):
   curl -I http://localhost:3000

5. Open in browser:
   - Visit https://www.timexceramic.com/admin/colors (Verify Color Management)
   - Visit https://www.timexceramic.com/ (Verify BY COLOR mega menu loads active colors)
   - Visit https://www.timexceramic.com/admin/products (Edit product -> Technical Specifications -> Color multi-select)

================================================================================
 Deployment package generated successfully.
================================================================================
