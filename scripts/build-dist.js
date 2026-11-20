/**
 * scripts/build-dist.js
 * Production Packager for Netlify Deployment
 *
 * Ensures dist/ contains:
 * 1. Full public website static assets (public/*)
 * 2. Next.js production client bundles (_next/static/*)
 * 3. Pre-rendered HTML pages for all major routes
 * 4. Netlify _redirects for SPA routing, API rewrites, and deep linking
 */

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");
const nextStaticDir = path.join(rootDir, ".next/static");
const distNextStaticDir = path.join(distDir, "_next/static");

console.log("==================================================");
console.log(" Building Netlify Production 'dist/' Package");
console.log("==================================================");

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Helper: copy directory recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ensure public/llms.txt and public/.htaccess exist before copying
try {
  const storePath = path.join(rootDir, "server/data/store.json");
  let store = {};
  if (fs.existsSync(storePath)) {
    store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  }
  const llmsPath = path.join(publicDir, "llms.txt");
  if (!fs.existsSync(llmsPath) || fs.statSync(llmsPath).size === 0) {
    const defaultLlms = store.llms_txt_content || `# Timex Ceramic\n\n> Luxury Architectural Surfaces, Vitrified Tiles & Porcelain Slabs\n\nOfficial AI & LLM Discovery Index.\n`;
    fs.writeFileSync(llmsPath, defaultLlms, "utf8");
    console.log("   ✓ Generated public/llms.txt from store");
  }
  const htaccessPath = path.join(publicDir, ".htaccess");
  if (!fs.existsSync(htaccessPath) || fs.statSync(htaccessPath).size === 0) {
    const defaultHt = store.htaccess_content || `# Apache .htaccess configuration\nRewriteEngine On\nRewriteBase /\n`;
    fs.writeFileSync(htaccessPath, defaultHt, "utf8");
    console.log("   ✓ Generated public/.htaccess from store");
  }
} catch (err) {
  console.warn("   ⚠ Notice generating public files:", err.message);
}

// 2. Copy all public assets to dist
console.log("1. Syncing public assets to dist/...");
if (fs.existsSync(publicDir)) {
  copyDirRecursive(publicDir, distDir);
  console.log("   ✓ public/ assets copied (images, uploads, icons, robots, sitemap, llms.txt, .htaccess)");
}

// 3. Copy .next/static to dist/_next/static
console.log("2. Syncing Next.js client bundles (.next/static) to dist/_next/static/...");
if (fs.existsSync(nextStaticDir)) {
  copyDirRecursive(nextStaticDir, distNextStaticDir);
  console.log("   ✓ Client chunks and CSS copied to dist/_next/static");
} else {
  console.warn("   ⚠ .next/static not found. Run 'next build' first.");
}

// 3.5 Sync all pre-rendered HTML pages from .next/server/app into dist/
console.log("3. Syncing Next.js pre-rendered HTML pages (.next/server/app) to dist/...");
const nextServerAppDir = path.join(rootDir, ".next/server/app");
if (fs.existsSync(nextServerAppDir)) {
  function copyHtmlFilesRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.endsWith(".segments") || entry.name.startsWith("_")) {
          continue;
        }
        if (entry.name === "(site)") {
          copyHtmlFilesRecursive(srcPath, dest);
          continue;
        }
        copyHtmlFilesRecursive(srcPath, destPath);
      } else if (entry.isFile() && (entry.name.endsWith(".html") || entry.name.endsWith(".txt") || entry.name.endsWith(".xml"))) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyHtmlFilesRecursive(nextServerAppDir, distDir);
  console.log("   ✓ Pre-rendered HTML pages and route directories copied to dist/");
} else {
  console.warn("   ⚠ .next/server/app not found. Run 'next build' first.");
}

// 4. Ensure admin directory with index.html for direct /admin visits
const adminDir = path.join(distDir, "admin");
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}
if (fs.existsSync(path.join(distDir, "admin.html"))) {
  fs.copyFileSync(path.join(distDir, "admin.html"), path.join(adminDir, "index.html"));
  fs.copyFileSync(path.join(distDir, "admin.html"), path.join(adminDir, "media.html"));
  fs.copyFileSync(path.join(distDir, "admin.html"), path.join(adminDir, "recycle-bin.html"));
  fs.copyFileSync(path.join(distDir, "admin.html"), path.join(adminDir, "pages.html"));
  fs.copyFileSync(path.join(distDir, "admin.html"), path.join(adminDir, "videos.html"));
  console.log("   ✓ Synced dist/admin/ (index.html, media.html, recycle-bin.html, pages.html, videos.html)");
}

// 4.5 Mirror clean directory routes for static servers
const routesToMirror = ["inspiration", "book-a-showroom-visit", "watch-and-choose", "world-of-tiles", "collections", "products", "contact", "about", "calculator", "catalogue-maker", "visualiser", "compare", "wishlist"];
for (const r of routesToMirror) {
  const htmlFile = path.join(distDir, `${r}.html`);
  const rDir = path.join(distDir, r);
  if (fs.existsSync(htmlFile)) {
    if (!fs.existsSync(rDir)) fs.mkdirSync(rDir, { recursive: true });
    fs.copyFileSync(htmlFile, path.join(rDir, "index.html"));
  }
}
console.log("   ✓ Synced clean directory index.html files for major routes");

// 5. Generate Netlify _redirects file for SPA routing and API proxying
console.log("3. Generating authoritative Netlify _redirects file...");
let mediaRedirectLines = "";
const mediaRedirectsPath = path.join(rootDir, "server/data/media_redirects.json");
if (fs.existsSync(mediaRedirectsPath)) {
  try {
    const mediaMap = JSON.parse(fs.readFileSync(mediaRedirectsPath, "utf8"));
    const entries = Object.entries(mediaMap);
    if (entries.length > 0) {
      mediaRedirectLines =
        "\n# 3. Permanent 301 Redirects: Legacy Media URLs to Clean URLs\n" +
        entries.map(([from, to]) => `${from.padEnd(65)} ${to}  301!`).join("\n") +
        "\n";
    }
  } catch (_) {}
}

const redirectsContent = `# ==============================================================================
# TIMEX CERAMIC - NETLIFY REDIRECTS & REWRITES CONFIGURATION
# ==============================================================================

# 1. API Rewrites to Netlify Serverless Functions (High Priority)
/api/v1/*    /.netlify/functions/api/:splat   200!
/api/*       /.netlify/functions/api/:splat   200!

# 1.1 Catalogue Redirects to Canonical /catalogue/:splat
/catalogues/*            /catalogue/:splat            301!
/uploads/catalogues/*    /catalogue/:splat            301!

# 2. Permanent 301 Redirects: Old /collections/:slug to New /product-category/:slug
/collections/brick            /product-category/brick            301!
/collections/brick/           /product-category/brick            301!
/collections/stone            /product-category/stone            301!
/collections/stone/           /product-category/stone            301!
/collections/wooden           /product-category/wooden           301!
/collections/wooden/          /product-category/wooden           301!
/collections/tropical         /product-category/tropical         301!
/collections/tropical/        /product-category/tropical         301!
/collections/mosaic           /product-category/mosaic           301!
/collections/mosaic/          /product-category/mosaic           301!
/collections/marble           /product-category/marble           301!
/collections/marble/          /product-category/marble           301!
/collections/subway           /product-category/subway           301!
/collections/subway/          /product-category/subway           301!
/collections/texture          /product-category/texture          301!
/collections/texture/         /product-category/texture          301!
/collections/metallic         /product-category/metallic         301!
/collections/metallic/        /product-category/metallic         301!
/collections/boutique         /product-category/boutique         301!
/collections/boutique/        /product-category/boutique         301!
/collections/hexagon          /product-category/hexagon          301!
/collections/hexagon/         /product-category/hexagon          301!
/collections/moroccan         /product-category/moroccan         301!
/collections/moroccan/        /product-category/moroccan         301!
/collections/colorful         /product-category/colorful         301!
/collections/colorful/        /product-category/colorful         301!
/collections/highlighter      /product-category/highlighter      301!
/collections/highlighter/     /product-category/highlighter      301!
/collections/french-frames    /product-category/french-frames    301!
/collections/french-frames/   /product-category/french-frames    301!
/collections/modular          /product-category/modular          301!
/collections/modular/         /product-category/modular          301!
/collections/octagonal        /product-category/octagonal        301!
/collections/octagonal/       /product-category/octagonal        301!
/collections/terrazzo         /product-category/terrazzo         301!
/collections/terrazzo/        /product-category/terrazzo         301!
/collections/white            /product-category/white            301!
/collections/white/           /product-category/white            301!
/collections/fabric           /product-category/fabric           301!
/collections/fabric/          /product-category/fabric           301!
/collections/geometric        /product-category/geometric        301!
/collections/geometric/       /product-category/geometric        301!
/collections/vestige          /product-category/vestige          301!
/collections/vestige/         /product-category/vestige          301!
/collections/combo            /product-category/combo            301!
/collections/combo/           /product-category/combo            301!
/collections/lumina           /product-category/lumina           301!
/collections/lumina/          /product-category/lumina           301!
/collections/:slug            /product-category/:slug            301!
/collections/:slug/           /product-category/:slug/           301!
${mediaRedirectLines}
# 4. SPA Deep-Linking & Direct Page Refreshes
/admin                /admin.html                      200
/admin/*              /admin.html                      200
/products             /products.html                   200
/products/*           /products.html                   200
/product/*            /products.html                   200
/world-of-tiles       /world-of-tiles.html             200
/collections          /collections.html                200
/product-category     /collections.html                200
/product-category/*   /collections.html                200
/blogs                /blogs.html                      200
/blogs/*              /blogs.html                      200
/blog/*               /blogs.html                      200
/wishlist             /wishlist.html                   200
/compare              /compare.html                    200
/visualiser           /visualiser.html                 200
/calculator           /calculator.html                 200
/catalogue-maker      /catalogue-maker.html            200
/architect-portal     /architect-portal.html           200
/dealer-portal        /dealer-portal.html              200
/projects             /projects.html                   200
/book-a-showroom-visit  /book-a-showroom-visit.html     200
/book-a-showroom-visit/ /book-a-showroom-visit.html     200
/inspiration          /inspiration.html                200
/inspiration/         /inspiration.html                200
/watch-and-choose     /watch-and-choose.html           200
/watch-and-choose/    /watch-and-choose.html           200
/applications         /applications.html               200
/spaces               /spaces.html                     200

# 4. Direct Canonical Tiles by Space Routes
/living-room-tiles     /living-room-tiles.html      200
/bedroom-tiles         /bedroom-tiles.html          200
/kitchen-tiles         /kitchen-tiles.html          200
/bathroom-tiles        /bathroom-tiles.html         200
/elevation-tiles       /elevation-tiles.html        200
/dining-room-tiles     /dining-room-tiles.html      200
/balcony-terrace-tiles /balcony-terrace-tiles.html  200
/outdoor-tiles         /outdoor-tiles.html          200
/commercial-tiles      /commercial-tiles.html       200
/restaurant-tiles      /restaurant-tiles.html       200
/cafe-tiles            /cafe-tiles.html             200
/hotel-tiles           /hotel-tiles.html            200
/office-tiles          /office-tiles.html           200
/swimming-pool-tiles   /swimming-pool-tiles.html    200
/parking-tiles         /parking-tiles.html          200
/spa-wellness-tiles    /spa-wellness-tiles.html     200

# 5. Global SPA Fallback (Prevents Netlify 404s on direct URL refresh)
/*           /index.html                      200
`;

fs.writeFileSync(path.join(distDir, "_redirects"), redirectsContent, "utf8");
console.log("   ✓ Generated dist/_redirects");

// 6. Verify key files exist in dist/
const requiredFiles = [
  "index.html",
  "admin.html",
  "products.html",
  "collections.html",
  "blogs.html",
  "watch-and-choose.html",
  "_redirects",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
];

console.log("\n4. Verifying dist/ production readiness:");
let allValid = true;
for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  console.log(`   - ${file.padEnd(20)}: ${exists ? "EXISTS ✓ (" + size + " bytes)" : "MISSING ✗"}`);
  if (!exists) allValid = false;
}

if (allValid) {
  console.log("\n==================================================");
  console.log(" ✓ PRODUCTION 'dist/' IS FULLY READY FOR NETLIFY");
  console.log("==================================================");
} else {
  console.error("\n❌ WARNING: Some required files are missing in dist/.");
  process.exit(1);
}
