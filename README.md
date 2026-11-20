# Timex Ceramic — Hostinger Production Deployment Guide

This guide provides step-by-step instructions to deploy the Timex Ceramic full-stack website (Next.js frontend + Express backend) on your Hostinger KVM 2 VPS (Ubuntu 22.04 / 24.04).

---

## 1. What is inside this Folder

```
HOSTINGER_UPLOAD/
├── public/                 # All 6,165 static images, webp tiles, catalogues, logos, favicons
├── server/                 # Express backend API, database layer, routes, schema.sql
├── src/                    # Next.js 16 App Router frontend components, pages, actions
├── scripts/                # Build and process scripts
├── ecosystem.config.js     # PM2 process manager configuration (Frontend + Backend)
├── nginx.conf              # Nginx reverse proxy configuration with optimized image serving
├── package.json            # Node.js dependencies
├── package-lock.json       # Exact locked dependency tree
├── next.config.ts          # Next.js production configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # Tailwind CSS configuration
├── .env.production.example # Production environment template
└── DEPLOYMENT_INSTRUCTIONS.md
```

---

## 2. Server Preparation (One-Time Setup on Hostinger VPS)

Connect to your Hostinger VPS via SSH:
```bash
ssh root@YOUR_SERVER_IP
```

Ensure Node.js 20+ and PM2 are installed:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx mysql-server unzip certbot python3-certbot-nginx
sudo npm install -g pm2
```

Create the web root directory:
```bash
sudo mkdir -p /var/www/timex-ceramic
sudo chown -R $USER:$USER /var/www/timex-ceramic
```

---

## 3. Uploading Files to Hostinger

### Option A: Uploading via FileZilla (SFTP)
1. Open FileZilla.
2. Host: `sftp://YOUR_SERVER_IP`, Username: `root` (or your VPS user), Port: `22`.
3. Upload all contents from `HOSTINGER_UPLOAD/` directly into `/var/www/timex-ceramic/`.

### Option B: High-Speed Upload via ZIP (Recommended)
If uploading `HOSTINGER_UPLOAD.zip`:
```bash
# On your local terminal (PowerShell):
scp HOSTINGER_UPLOAD.zip root@YOUR_SERVER_IP:/var/www/timex-ceramic/

# On the VPS:
cd /var/www/timex-ceramic
unzip -o HOSTINGER_UPLOAD.zip
rm HOSTINGER_UPLOAD.zip
```

---

## 4. Install Dependencies & Build

On the VPS inside `/var/www/timex-ceramic`:
```bash
cd /var/www/timex-ceramic

# 1. Install production dependencies
npm install

# 2. Build the Next.js production bundle
npm run build
```

---

## 5. Configure Production Environment (.env.production)

Copy the template:
```bash
cp .env.production.example .env.production
nano .env.production
```

Configure your actual MySQL credentials and Hostinger SMTP settings:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://www.timexceramic.com
BACKEND_INTERNAL_URL=http://localhost:5001

# MySQL Database (Hostinger VPS)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=timex_user
MYSQL_PASSWORD=your_strong_mysql_password
MYSQL_DATABASE=timex_ceramic

# Hostinger SMTP Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@timexceramic.com
SMTP_PASS=your_email_account_password
SMTP_FROM_EMAIL="Timex Ceramic <info@timexceramic.com>"

# Primary recipient for all website enquiries:
ADMIN_NOTIFICATION_EMAIL=info@timexceramic.com
ENQUIRY_EMAIL=info@timexceramic.com
RECIPIENT_EMAIL=info@timexceramic.com

# JWT Secret for Admin Authentication
JWT_SECRET=timex_ceramic_super_secure_jwt_secret_2026_hostinger
```

---

## 6. MySQL Database Setup

Ensure the database and user exist:
```bash
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS timex_ceramic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -u root -e "CREATE USER IF NOT EXISTS 'timex_user'@'localhost' IDENTIFIED BY 'your_strong_mysql_password';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON timex_ceramic.* TO 'timex_user'@'localhost'; FLUSH PRIVILEGES;"

# Import the schema (optional, the backend auto-initializes tables if not present):
sudo mysql -u timex_user -p timex_ceramic < server/schema.sql
```

---

## 7. Start PM2 Processes

Start both Next.js frontend (port 3000) and Express API (port 5001):
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Check status:
```bash
pm2 status
pm2 logs
```

---

## 8. Configure Nginx Reverse Proxy & SSL

Copy the included `nginx.conf`:
```bash
sudo cp /var/www/timex-ceramic/nginx.conf /etc/nginx/sites-available/timex-ceramic
sudo ln -sf /etc/nginx/sites-available/timex-ceramic /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

Install free Let's Encrypt SSL:
```bash
sudo certbot --nginx -d timexceramic.com -d www.timexceramic.com
```

---

## 9. Critical Features Verified

1. **Images & Photos (Zero Missing Images)**:
   - Next.js proxy bypass removed: Next.js serves all images from `public/uploads` natively.
   - Nginx uses direct `root /var/www/timex-ceramic/public;` mapping with 30-day browser cache headers.
   - All 6,165 image assets verified and present.

2. **Form Enquiries & Dual Emailing**:
   - Every website enquiry form sends notification email to: `info@timexceramic.com`.
   - Every client automatically receives a professional branded thank-you email confirmation.
   - Duplicate submissions within 30 seconds are safely deduplicated.

3. **First-Time Admin Setup**:
   - Fixed MySQL timestamp formatting by using standard `NOW()` and ensuring table creation.
   - Access admin panel at `https://your-domain.com/admin` to initialize your master administrator credentials.

4. **Page Navigation Scroll-to-Top**:
   - `ScrollToTop` component automatically scrolls to top upon every route navigation while preserving `#` hash anchors.
