/**
 * scripts/serve.js
 * Production-grade Localhost Server for Timex Ceramic
 * Serves the full Next.js static build (dist/) with live API proxy to Express (port 5001)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = parseInt(process.env.FRONTEND_PORT || "3004", 10);
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "5001", 10);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".map": "application/json",
};

// Reverse proxy helper to backend API on port 5001
function proxyToBackend(req, res, targetPath) {
  const options = {
    hostname: "127.0.0.1",
    port: BACKEND_PORT,
    path: targetPath || req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${BACKEND_PORT}`,
      "x-forwarded-for": req.socket.remoteAddress,
      "x-forwarded-proto": "http",
      "x-forwarded-port": String(PORT),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error(`[Proxy Error] ${req.url} -> ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad Gateway", message: err.message }));
    }
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API Reverse Proxying (Forward to port 5001)
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/v1/") ||
    pathname === "/health" ||
    pathname === "/api"
  ) {
    return proxyToBackend(req, res);
  }

  // 1.1 Uploads & Catalogues (Serve from public/ if exists, else forward to backend)
  if (pathname.startsWith("/uploads/") || pathname.startsWith("/catalogue/") || pathname.startsWith("/catalogues/")) {
    const localPublicFile = path.join(publicDir, pathname);
    if (fs.existsSync(localPublicFile) && fs.statSync(localPublicFile).isFile()) {
      return serveFile(req, res, localPublicFile);
    }
    return proxyToBackend(req, res);
  }

  // 2. Permanent 301 Redirects: Old /collections/:slug to /product-category/:slug
  if (pathname.startsWith("/collections/") && pathname.length > 13) {
    const slug = pathname.replace(/^\/collections\//, "").replace(/\/$/, "");
    res.writeHead(301, { Location: `/product-category/${slug}` });
    return res.end();
  }

  // 3. Static Files & HTML Page Routing from dist/
  let filePath = path.join(distDir, pathname);

  // Check if direct file exists (e.g. /_next/static/..., /favicon.ico, /images/...)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(req, res, filePath);
  }

  // Check in public directory (e.g. /uploads, /images, /timex-logo.png)
  const publicFilePath = path.join(publicDir, pathname);
  if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
    return serveFile(req, res, publicFilePath);
  }

  // Admin routes -> dist/admin/index.html or dist/admin.html
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const adminIndex = path.join(distDir, "admin", "index.html");
    if (fs.existsSync(adminIndex)) return serveFile(req, res, adminIndex);
    const adminHtml = path.join(distDir, "admin.html");
    if (fs.existsSync(adminHtml)) return serveFile(req, res, adminHtml);
  }

  // Named HTML pages (e.g. /products -> dist/products.html, /about -> dist/about.html)
  const cleanPath = pathname.replace(/\/$/, "");
  const directHtml = path.join(distDir, `${cleanPath}.html`);
  if (cleanPath && fs.existsSync(directHtml) && fs.statSync(directHtml).isFile()) {
    return serveFile(req, res, directHtml);
  }

  // Directory with index.html (e.g. /product-category/stone/ -> /product-category/stone/index.html)
  const dirIndex = path.join(distDir, cleanPath, "index.html");
  if (cleanPath && fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
    return serveFile(req, res, dirIndex);
  }

  // Root homepage -> dist/index.html
  if (pathname === "/" || pathname === "") {
    const rootIndex = path.join(distDir, "index.html");
    if (fs.existsSync(rootIndex)) return serveFile(req, res, rootIndex);
  }

  // SPA Fallback: for deep-linked dynamic client-side routes, serve index.html
  const spaFallback = path.join(distDir, "index.html");
  if (fs.existsSync(spaFallback)) {
    return serveFile(req, res, spaFallback);
  }

  // 404 Not Found
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
});

function serveFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const stat = fs.statSync(filePath);
  const headers = {
    "Content-Type": contentType,
    "Content-Length": stat.size,
  };

  // Cache headers for static immutable assets
  if (filePath.includes("_next\\static") || filePath.includes("_next/static")) {
    headers["Cache-Control"] = "public, max-age=31536000, immutable";
  } else {
    headers["Cache-Control"] = "no-cache";
  }

  res.writeHead(200, headers);
  if (req.method === "HEAD") {
    return res.end();
  }
  fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, () => {
  console.log("==================================================");
  console.log(`  Timex Ceramic Website is LIVE on localhost!`);
  console.log(`  Homepage:     http://localhost:${PORT}`);
  console.log(`  Admin Portal: http://localhost:${PORT}/admin`);
  console.log(`  API Health:   http://localhost:${PORT}/api/v1/health`);
  console.log(`  Backend API:  http://localhost:${BACKEND_PORT}/api/v1`);
  console.log("==================================================");
});
