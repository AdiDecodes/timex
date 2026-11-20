const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { loadFallbackStore, saveFallbackStore } = require("../config/db");

const {
  UPLOAD_CATALOGUES_DIR,
  CATALOGUES_DIR,
  PUBLIC_CATALOGUE_DIR,
  getUniqueFilename,
  formatCatalogueUrl,
} = require("../utils/mediaHelper");

// Ensure catalogues directories exist
try {
  [CATALOGUES_DIR, UPLOAD_CATALOGUES_DIR, PUBLIC_CATALOGUE_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
} catch (e) {
  console.warn("Could not create CATALOGUES directories:", e);
}

// Multer storage for PDFs with preserved clean lowercase filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PUBLIC_CATALOGUE_DIR);
  },
  filename: function (req, file, cb) {
    try {
      const store = loadFallbackStore();
      const existingMedia = Array.isArray(store?.media) ? store.media : [];
      const uniqueFilename = getUniqueFilename(
        file.originalname,
        PUBLIC_CATALOGUE_DIR,
        existingMedia
      );
      cb(null, uniqueFilename);
    } catch (err) {
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    return cb(null, true);
  }
  cb(new Error("Only PDF files are supported for catalogues."));
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function cleanTitleFromName(filename) {
  const base = path.basename(filename, path.extname(filename));
  const cleaned = base
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  return cleaned.toLowerCase().includes("catalogue") || cleaned.toLowerCase().includes("catalog")
    ? cleaned
    : `${cleaned} Catalogue`;
}

function getAvailableCatalogues() {
  const store = loadFallbackStore();
  const map = new Map();

  // 1. Scan filesystem public/catalogue, public/catalogues, and public/uploads/catalogues
  const scanDirs = [PUBLIC_CATALOGUE_DIR, CATALOGUES_DIR, UPLOAD_CATALOGUES_DIR];
  for (const dir of scanDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.toLowerCase().endsWith(".pdf")) {
            try {
              const filePath = path.join(dir, file);
              const stat = fs.statSync(filePath);
              const cleanFn = file.toLowerCase();
              const url = `/catalogue/${cleanFn}`;
              if (!map.has(url)) {
                map.set(url, {
                  id: `cat-${cleanFn.replace(/[^a-z0-9]/g, "-")}`,
                  name: cleanTitleFromName(file),
                  filename: cleanFn,
                  url,
                  size: stat.size,
                  sizeFormatted: formatBytes(stat.size),
                  uploadedAt: stat.mtime.toISOString(),
                });
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
  }

  // 2. Scan store.media for PDF documents
  if (Array.isArray(store.media)) {
    for (const m of store.media) {
      if (m.is_trashed) continue;
      const isPdf =
        m.fileType === "document" ||
        (m.url && m.url.toLowerCase().endsWith(".pdf")) ||
        (m.filename && m.filename.toLowerCase().endsWith(".pdf"));

      if (isPdf) {
        const filename = (m.filename || path.basename(m.url || "")).toLowerCase();
        const url = `/catalogue/${filename}`;
        if (!map.has(url)) {
          map.set(url, {
            id: m.id || `media-${Date.now()}`,
            name: m.altText || m.caption || cleanTitleFromName(m.originalName || filename),
            filename,
            url,
            size: m.size || 0,
            sizeFormatted: formatBytes(m.size || 0),
            uploadedAt: m.uploadedAt || new Date().toISOString(),
          });
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// GET /api/v1/catalogues
router.get("/", (req, res) => {
  try {
    const catalogues = getAvailableCatalogues();
    return res.json({
      success: true,
      count: catalogues.length,
      catalogues,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/catalogues/upload
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No PDF file uploaded." });
    }

    const file = req.file;
    const cleanFilename = file.filename.toLowerCase();

    // Mirror file across PUBLIC_CATALOGUE_DIR, UPLOAD_CATALOGUES_DIR, and CATALOGUES_DIR
    try {
      const srcPath = path.join(file.destination, file.filename);
      [PUBLIC_CATALOGUE_DIR, CATALOGUES_DIR, UPLOAD_CATALOGUES_DIR].forEach((targetDir) => {
        try {
          if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
          const targetPath = path.join(targetDir, cleanFilename);
          if (srcPath !== targetPath && fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, targetPath);
          }
        } catch (_) {}
      });
    } catch (_) {}

    const url = `/catalogue/${cleanFilename}`;
    const name = req.body.name || cleanTitleFromName(file.originalname || cleanFilename);
    const size = file.size;

    const newCatalogue = {
      id: `cat-${Date.now()}`,
      name,
      filename: cleanFilename,
      originalName: file.originalname || cleanFilename,
      url,
      size,
      sizeFormatted: formatBytes(size),
      uploadedAt: new Date().toISOString(),
    };

    // Register into store.media
    const store = loadFallbackStore();
    if (!Array.isArray(store.media)) {
      store.media = [];
    }

    store.media.unshift({
      id: newCatalogue.id,
      filename: cleanFilename,
      originalName: file.originalname || cleanFilename,
      url,
      mimeType: "application/pdf",
      fileType: "document",
      size,
      uploadedAt: newCatalogue.uploadedAt,
      uploadedBy: req.body?.uploadedBy || "admin",
      is_trashed: false,
      deleted_at: null,
      deleted_by: null,
      altText: name,
      caption: req.body?.caption || name,
    });

    saveFallbackStore(store);

    return res.status(201).json({
      success: true,
      catalogue: newCatalogue,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
