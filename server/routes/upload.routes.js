const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { loadFallbackStore, saveFallbackStore } = require("../config/db");
const {
  UPLOAD_ROOT_DIR,
  UPLOAD_PRODUCTS_DIR,
  getUniqueFilename,
} = require("../utils/mediaHelper");

// Ensure upload directories exist
try {
  [UPLOAD_ROOT_DIR, UPLOAD_PRODUCTS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
} catch (e) {
  console.warn("Could not create upload dirs:", e);
}

// Helper to register uploaded file into store.media
function registerMediaRecord(store, filename, publicUrl, size, mimetype) {
  if (!store) return;
  store.media = store.media || [];
  const ext = path.extname(filename).toLowerCase();
  const fileType = ext === ".svg" ? "svg" : "image";
  const id = `media-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
  store.media.unshift({
    id,
    filename,
    originalName: filename,
    url: publicUrl,
    mimeType: mimetype || "image/jpeg",
    fileType,
    size: size || 102400,
    dimensions: "1200 x 800",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin",
    is_trashed: false,
    deleted_at: null,
    deleted_by: null,
    altText: path.basename(filename, ext).replace(/[_-]/g, " "),
    caption: "",
  });
}

// Configure multer storage with original filename preservation & duplicate resolution
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PRODUCTS_DIR);
  },
  filename: function (req, file, cb) {
    try {
      req._batchAssigned = req._batchAssigned || new Set();
      if (!req._cachedStore) {
        req._cachedStore = loadFallbackStore();
      }
      const existingMedia = Array.isArray(req._cachedStore?.media) ? req._cachedStore.media : [];
      const uniqueFilename = getUniqueFilename(
        file.originalname,
        UPLOAD_PRODUCTS_DIR,
        existingMedia,
        req._batchAssigned
      );
      cb(null, uniqueFilename);
    } catch (err) {
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif|gif|svg/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith("image/");
  const extname = allowed.test(ext);

  if (mimetype || extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files (JPG, PNG, WebP, AVIF, GIF, SVG) are allowed."));
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter,
});

function handleSingleUpload(req, res) {
  const file = req.file || (req.files && req.files[0]);
  if (!file) {
    return res.status(400).json({ success: false, error: "No image file uploaded." });
  }

  // Mirror to public/uploads/ asynchronously
  try {
    const prodPath = path.join(UPLOAD_PRODUCTS_DIR, file.filename);
    const rootPath = path.join(UPLOAD_ROOT_DIR, file.filename);
    if (fs.existsSync(prodPath) && !fs.existsSync(rootPath)) {
      fs.copyFile(prodPath, rootPath, () => {});
    }
  } catch (_) {}

  const publicUrl = `/uploads/products/${file.filename}`;

  // Register in store.media
  try {
    const store = req._cachedStore || loadFallbackStore();
    registerMediaRecord(store, file.filename, publicUrl, file.size, file.mimetype);
    saveFallbackStore(store);
  } catch (_) {}

  return res.json({
    success: true,
    url: publicUrl,
    filename: file.filename,
    size: file.size,
  });
}

// POST /api/v1/upload (general fallback endpoint)
router.post("/", upload.any(), (req, res) => {
  if (req.files && req.files.length > 1) {
    return handleMultipleUpload(req, res);
  }
  return handleSingleUpload(req, res);
});

// POST /api/v1/upload/single
router.post("/single", upload.single("image"), (req, res) => {
  return handleSingleUpload(req, res);
});

// POST /api/v1/upload/multiple
function handleMultipleUpload(req, res) {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, error: "No image files uploaded." });
  }

  const store = req._cachedStore || loadFallbackStore();

  const uploaded = files.map((file) => {
    // Mirror to public/uploads/ asynchronously
    try {
      const prodPath = path.join(UPLOAD_PRODUCTS_DIR, file.filename);
      const rootPath = path.join(UPLOAD_ROOT_DIR, file.filename);
      if (fs.existsSync(prodPath) && !fs.existsSync(rootPath)) {
        fs.copyFile(prodPath, rootPath, () => {});
      }
    } catch (_) {}

    const publicUrl = `/uploads/products/${file.filename}`;
    registerMediaRecord(store, file.filename, publicUrl, file.size, file.mimetype);

    return {
      url: publicUrl,
      filename: file.filename,
      size: file.size,
    };
  });

  try {
    saveFallbackStore(store);
  } catch (_) {}

  return res.json({
    success: true,
    count: uploaded.length,
    files: uploaded,
    urls: uploaded.map((u) => u.url),
  });
}

router.post("/multiple", upload.array("images", 50), handleMultipleUpload);

module.exports = router;
