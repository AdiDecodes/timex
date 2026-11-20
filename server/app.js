const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.production") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { isMysqlConnected, loadFallbackStore } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const blogRoutes = require("./routes/blogs.routes");
const seoRoutes = require("./routes/seo.routes");
const enquiryRoutes = require("./routes/enquiries.routes");
const uploadRoutes = require("./routes/upload.routes");
const mediaRoutes = require("./routes/media.routes");
const trashRoutes = require("./routes/trash.routes");
const pagesRoutes = require("./routes/pages.routes");
const cataloguesRoutes = require("./routes/catalogues.routes");
const spacesRoutes = require("./routes/spaces.routes");
const taxonomiesRoutes = require("./routes/taxonomies.routes");
const videosRoutes = require("./routes/videos.routes");
const colorsRoutes = require("./routes/colors.routes");

const app = express();

// Trust proxy: Required when running behind Cloudflare Tunnel, reverse proxies, or Next.js rewrites
// Allows Express to correctly identify client IP, req.secure (HTTPS), and original protocol
app.set("trust proxy", 1);

// Flexible CORS setup: allows localhost, Cloudflare Tunnel domains, and matches incoming origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, or server-to-server Next.js proxying)
      if (!origin) return callback(null, true);
      // In production or dev, allow all secure origins with credentials
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Resilient cookie parser middleware for req.cookies
app.use((req, res, next) => {
  req.cookies = req.cookies || {};
  if (req.headers.cookie) {
    const pairs = req.headers.cookie.split(";");
    for (const pair of pairs) {
      const parts = pair.trim().split("=");
      const key = parts[0];
      const val = parts.slice(1).join("=");
      if (key) {
        req.cookies[key] = decodeURIComponent(val || "");
      }
    }
  }
  next();
});

// Body parsers
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static uploads and catalogues serving
const uploadsDir = path.resolve(__dirname, "../public/uploads");
const productsUploadsDir = path.resolve(__dirname, "../public/uploads/products");
const cataloguesUploadsDir = path.resolve(__dirname, "../public/uploads/catalogues");
const cataloguesDir = path.resolve(__dirname, "../public/catalogues");
const catalogueDir = path.resolve(__dirname, "../public/catalogue");
const thumbnailsDir = path.resolve(__dirname, "../public/uploads/thumbnails");

// Ensure public directories exist
[uploadsDir, productsUploadsDir, cataloguesUploadsDir, cataloguesDir, catalogueDir, thumbnailsDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Media Redirects Middleware for legacy generated URLs (e.g. 201-dark-1791138303275-93711.webp -> 201-dark.webp)
const redirectsFile = path.resolve(__dirname, "data/media_redirects.json");

// Redirect legacy /catalogues/* and /uploads/catalogues/* to /catalogue/*
app.get(["/uploads/catalogues/:filename", "/catalogues/:filename"], (req, res, next) => {
  const filename = (decodeURIComponent(req.params.filename || "")).toLowerCase();
  if (filename.endsWith(".pdf")) {
    if (fs.existsSync(redirectsFile)) {
      try {
        const redirectsMap = JSON.parse(fs.readFileSync(redirectsFile, "utf8"));
        if (redirectsMap && redirectsMap[req.path]) {
          return res.redirect(301, redirectsMap[req.path]);
        }
      } catch (_) {}
    }
    return res.redirect(301, `/catalogue/${filename}`);
  }
  next();
});

// Canonical Catalogue Route: /catalogue/:filename
app.get("/catalogue/:filename", (req, res, next) => {
  const rawParam = req.params.filename;
  if (!rawParam) return next();

  const decoded = decodeURIComponent(rawParam);
  const cleanParam = decoded.toLowerCase();

  // 1. Direct and normalized candidate paths
  const candidatePaths = [
    path.join(catalogueDir, decoded),
    path.join(catalogueDir, cleanParam),
    path.join(cataloguesDir, decoded),
    path.join(cataloguesDir, cleanParam),
    path.join(cataloguesUploadsDir, decoded),
    path.join(cataloguesUploadsDir, cleanParam),
    path.join(uploadsDir, decoded),
    path.join(uploadsDir, cleanParam),
  ];

  for (const c of candidatePaths) {
    if (fs.existsSync(c)) {
      try {
        if (fs.statSync(c).isFile()) {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(path.basename(c))}"`);
          return res.sendFile(c);
        }
      } catch (_) {}
    }
  }

  // 2. Case-insensitive search across directories
  for (const d of [catalogueDir, cataloguesDir, cataloguesUploadsDir, uploadsDir]) {
    if (!fs.existsSync(d)) continue;
    try {
      const files = fs.readdirSync(d);
      const match = files.find((f) => f.toLowerCase() === cleanParam);
      if (match) {
        const fullPath = path.join(d, match);
        if (fs.statSync(fullPath).isFile()) {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(match)}"`);
          return res.sendFile(fullPath);
        }
      }
    } catch (_) {}
  }

  // 3. Check media_redirects.json
  if (fs.existsSync(redirectsFile)) {
    try {
      const redirectsMap = JSON.parse(fs.readFileSync(redirectsFile, "utf8"));
      const target =
        redirectsMap[`/catalogue/${decoded}`] ||
        redirectsMap[`/catalogue/${cleanParam}`] ||
        redirectsMap[`/catalogues/${decoded}`] ||
        redirectsMap[`/catalogues/${cleanParam}`] ||
        redirectsMap[`/uploads/catalogues/${decoded}`] ||
        redirectsMap[`/uploads/catalogues/${cleanParam}`];
      if (target && target !== req.originalUrl) {
        return res.redirect(301, target);
      }
    } catch (_) {}
  }

  next();
});

app.use((req, res, next) => {
  if (req.method === "GET" && (req.path.startsWith("/uploads/") || req.path.startsWith("/catalogues/") || req.path.startsWith("/catalogue/"))) {
    try {
      if (fs.existsSync(redirectsFile)) {
        const redirectsMap = JSON.parse(fs.readFileSync(redirectsFile, "utf8"));
        if (redirectsMap && redirectsMap[req.path]) {
          return res.redirect(301, redirectsMap[req.path]);
        }
      }
    } catch (_) {}
  }
  next();
});

const staticUploadOptions = {
  maxAge: "7d",
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (!filePath.endsWith(".json")) {
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    }
  },
};

const staticCatalogueOptions = {
  maxAge: "1d",
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.set("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "public, max-age=86400");
  },
};

app.use("/catalogue", express.static(catalogueDir, staticCatalogueOptions));
app.use("/catalogue", express.static(cataloguesUploadsDir, staticCatalogueOptions));
app.use("/catalogue", express.static(cataloguesDir, staticCatalogueOptions));
app.use("/uploads/thumbnails", express.static(thumbnailsDir, staticUploadOptions));
app.use("/uploads/products", express.static(productsUploadsDir, staticUploadOptions));
app.use("/uploads/catalogues", express.static(cataloguesUploadsDir, staticCatalogueOptions));
app.use("/catalogues", express.static(cataloguesUploadsDir, staticCatalogueOptions));
app.use("/catalogues", express.static(cataloguesDir, staticCatalogueOptions));
app.use("/uploads", express.static(uploadsDir, staticUploadOptions));
app.use("/uploads", express.static(productsUploadsDir, staticUploadOptions));

// Route Handlers: Mount on /api/v1/*, /v1/*, and /*
// This guarantees that whether Netlify rewrites with /api/v1, /v1, or stripped prefix, requests always resolve cleanly.
app.use("/api/v1/auth", authRoutes);
app.use("/v1/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/v1/products", productRoutes);
app.use("/v1/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api/v1/blogs", blogRoutes);
app.use("/v1/blogs", blogRoutes);
app.use("/blogs", blogRoutes);

app.use("/api/v1/seo", seoRoutes);
app.use("/v1/seo", seoRoutes);
app.use("/seo", seoRoutes);

app.use("/api/v1/enquiries", enquiryRoutes);
app.use("/v1/enquiries", enquiryRoutes);
app.use("/enquiries", enquiryRoutes);
app.use("/api/v1/inquiry", enquiryRoutes);
app.use("/v1/inquiry", enquiryRoutes);
app.use("/api/inquiry", enquiryRoutes);
app.use("/inquiry", enquiryRoutes);

app.use("/api/v1/upload", uploadRoutes);
app.use("/v1/upload", uploadRoutes);
app.use("/upload", uploadRoutes);

app.use("/api/v1/media", mediaRoutes);
app.use("/v1/media", mediaRoutes);
app.use("/media", mediaRoutes);

app.use("/api/v1/trash", trashRoutes);
app.use("/v1/trash", trashRoutes);
app.use("/trash", trashRoutes);

app.use("/api/v1/pages", pagesRoutes);
app.use("/v1/pages", pagesRoutes);
app.use("/pages", pagesRoutes);

app.use("/api/v1/catalogues", cataloguesRoutes);
app.use("/v1/catalogues", cataloguesRoutes);

app.use("/api/v1/spaces", spacesRoutes);
app.use("/v1/spaces", spacesRoutes);
app.use("/spaces", spacesRoutes);

app.use("/api/v1/taxonomies", taxonomiesRoutes);
app.use("/v1/taxonomies", taxonomiesRoutes);
app.use("/taxonomies", taxonomiesRoutes);

app.use("/api/v1/videos", videosRoutes);
app.use("/v1/videos", videosRoutes);
app.use("/videos", videosRoutes);

app.use("/api/v1/colors", colorsRoutes);
app.use("/v1/colors", colorsRoutes);
app.use("/colors", colorsRoutes);

// Permanent 301 Redirect for legacy /collections/:slug URLs to /product-category/:slug
app.get(["/collections/:slug", "/collections/:slug/"], (req, res) => {
  return res.redirect(301, `/product-category/${req.params.slug}`);
});

// Health check endpoint (all paths)
const healthHandler = (req, res) => {
  const store = loadFallbackStore();
  const trashedCount = (store.products || []).filter(p => p.is_trashed).length +
    (store.blogs || []).filter(b => b.is_trashed).length +
    (store.media || []).filter(m => m.is_trashed).length +
    (store.pages || []).filter(p => p.is_trashed).length;

  res.json({
    success: true,
    service: "Timex Ceramic Admin API",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      isMysqlConnected: isMysqlConnected(),
      mode: isMysqlConnected() ? "Live MySQL" : "Local Resilient Store (store.json)",
    },
    counts: {
      products: store.products ? store.products.length : 0,
      activeProducts: store.products ? store.products.filter(p => !p.is_trashed).length : 0,
      blogs: store.blogs ? store.blogs.length : 0,
      activeBlogs: store.blogs ? store.blogs.filter(b => !b.is_trashed).length : 0,
      media: store.media ? store.media.length : 0,
      activeMedia: store.media ? store.media.filter(m => !m.is_trashed).length : 0,
      pages: store.pages ? store.pages.length : 0,
      trashedTotal: trashedCount,
      seoRecords: store.seo_metadata ? store.seo_metadata.length : 0,
      enquiries: store.enquiries ? store.enquiries.length : 0,
    },
    timestamp: new Date().toISOString(),
  });
};

app.get("/api/v1/health", healthHandler);
app.get("/v1/health", healthHandler);
app.get("/health", healthHandler);
app.get("/", healthHandler);

// Central error handler
app.use((err, req, res, next) => {
  console.error("[API Error]", err);
  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }
  return res.status(500).json({ success: false, error: err.message || "Internal server error" });
});

module.exports = app;
