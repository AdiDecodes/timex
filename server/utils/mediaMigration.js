const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");
const storePath = path.join(rootDir, "server/data/store.json");
const redirectsPath = path.join(rootDir, "server/data/media_redirects.json");
const productsUploadsDir = path.join(rootDir, "public/uploads/products");
const rootUploadsDir = path.join(rootDir, "public/uploads");
const cataloguesUploadsDir = path.join(rootDir, "public/uploads/catalogues");
const publicCataloguesDir = path.join(rootDir, "public/catalogues");
const publicCatalogueDir = path.join(rootDir, "public/catalogue");

// Ensure directories exist
[productsUploadsDir, rootUploadsDir, cataloguesUploadsDir, publicCataloguesDir, publicCatalogueDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Extracts a clean filename from a generated filename
 * Examples:
 * 201-dark-1791138303275-93711.webp -> 201-dark.webp
 * 201-light_3-1791108216477-27529.webp -> 201-light-3.webp
 * 201_l___d_amb_1-1791108216508-47557.webp -> 201-l-d-amb-1.webp
 * 9051-54-series-1790681280772.pdf -> 9051-54-series.pdf
 */
function cleanGeneratedFilename(filename) {
  const ext = path.extname(filename).toLowerCase();
  let base = path.basename(filename, path.extname(filename));

  // Strip trailing generated timestamp and random digits: -<10-14 digits>(-<digits>)?
  base = base.replace(/-+\d{10,14}(-\d+)?$/, "");

  // Clean double hyphens, underscores, or trailing dashes
  base = base
    .replace(/_+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "");

  return (base || "media") + ext;
}

/**
 * Run the migration on store.json and disk files
 */
function migrateExistingMedia() {
  if (!fs.existsSync(storePath)) {
    console.log("[Media Migration] store.json not found, skipping migration.");
    return { migratedCount: 0, redirects: {} };
  }

  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  if (store._media_migrated_v1) {
    return { migratedCount: 0, redirects: {} };
  }
  let redirects = {};
  if (fs.existsSync(redirectsPath)) {
    try {
      redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));
    } catch (_) {
      redirects = {};
    }
  }

  const generatedRegex = /-\d{10,14}(-\d+)?\./;

  const claimedNames = new Set();
  const migrationMap = new Map(); // oldFilename -> newFilename

  // 0. Prepopulate claimedNames and migrationMap from existing redirects
  for (const [fromUrl, toUrl] of Object.entries(redirects)) {
    const oldFn = path.basename(fromUrl);
    const newFn = path.basename(toUrl);
    claimedNames.add(newFn.toLowerCase());
    migrationMap.set(oldFn, newFn);
  }

  // 1. Identify all files on disk in productsUploadsDir with generated pattern
  const diskFiles = fs.existsSync(productsUploadsDir)
    ? fs.readdirSync(productsUploadsDir)
    : [];
  diskFiles.sort();

  // Process disk files with generated suffixes
  diskFiles.forEach((oldFilename) => {
    if (!generatedRegex.test(oldFilename)) return;
    if (migrationMap.has(oldFilename)) return;

    let targetName = cleanGeneratedFilename(oldFilename);
    const ext = path.extname(targetName).toLowerCase();
    const base = path.basename(targetName, ext);

    // If candidate is already claimed, increment suffix: -1, -2, -3
    let counter = 1;
    let candidate = targetName;
    while (claimedNames.has(candidate.toLowerCase())) {
      candidate = `${base}-${counter}${ext}`;
      counter++;
    }

    claimedNames.add(candidate.toLowerCase());
    migrationMap.set(oldFilename, candidate);
  });

  // Also check public/catalogues for generated PDF names
  if (fs.existsSync(publicCataloguesDir)) {
    const catFiles = fs.readdirSync(publicCataloguesDir);
    catFiles.forEach((oldFilename) => {
      if (!generatedRegex.test(oldFilename)) return;

      const oldCatKey = `/catalogues/${oldFilename}`;
      const oldUploadCatKey = `/uploads/catalogues/${oldFilename}`;
      if (redirects[oldCatKey] || redirects[oldUploadCatKey]) {
        const priorTarget = path.basename(redirects[oldCatKey] || redirects[oldUploadCatKey]);
        claimedNames.add(priorTarget.toLowerCase());
        migrationMap.set(oldFilename, priorTarget);
        return;
      }

      let targetName = cleanGeneratedFilename(oldFilename);
      const ext = path.extname(targetName).toLowerCase();
      const base = path.basename(targetName, ext);
      let counter = 1;
      let candidate = targetName;
      while (claimedNames.has(candidate.toLowerCase())) {
        candidate = `${base}-${counter}${ext}`;
        counter++;
      }
      claimedNames.add(candidate.toLowerCase());
      migrationMap.set(oldFilename, candidate);
    });
  }

  // Also check store.media for any media records with generated filenames not yet on disk
  if (Array.isArray(store.media)) {
    store.media.forEach((m) => {
      if (!m || !m.filename) return;
      if (generatedRegex.test(m.filename) && !migrationMap.has(m.filename)) {
        const oldMediaKey = m.url || `/uploads/products/${m.filename}`;
        if (redirects[oldMediaKey]) {
          const priorTarget = path.basename(redirects[oldMediaKey]);
          claimedNames.add(priorTarget.toLowerCase());
          migrationMap.set(m.filename, priorTarget);
          return;
        }

        let targetName = cleanGeneratedFilename(m.filename);
        const ext = path.extname(targetName).toLowerCase();
        const base = path.basename(targetName, ext);
        let counter = 1;
        let candidate = targetName;
        while (claimedNames.has(candidate.toLowerCase())) {
          candidate = `${base}-${counter}${ext}`;
          counter++;
        }
        claimedNames.add(candidate.toLowerCase());
        migrationMap.set(m.filename, candidate);
      }
    });
  }

  console.log(`[Media Migration] Found ${migrationMap.size} media files to migrate.`);

  // 2. Perform physical file copies and setup redirects
  for (const [oldFilename, newFilename] of migrationMap.entries()) {
    const ext = path.extname(newFilename).toLowerCase();
    const isDoc = ext === ".pdf";
    const cleanDocName = newFilename.toLowerCase();

    let oldDiskPath = path.join(productsUploadsDir, oldFilename);
    if (!fs.existsSync(oldDiskPath) && fs.existsSync(path.join(rootUploadsDir, oldFilename))) {
      oldDiskPath = path.join(rootUploadsDir, oldFilename);
    }
    if (!fs.existsSync(oldDiskPath) && fs.existsSync(path.join(publicCataloguesDir, oldFilename))) {
      oldDiskPath = path.join(publicCataloguesDir, oldFilename);
    }
    if (!fs.existsSync(oldDiskPath) && fs.existsSync(path.join(cataloguesUploadsDir, oldFilename))) {
      oldDiskPath = path.join(cataloguesUploadsDir, oldFilename);
    }

    if (fs.existsSync(oldDiskPath)) {
      if (isDoc) {
        // Copy to public/catalogue/, public/uploads/catalogues/ and public/catalogues/
        const targetPubCatPath = path.join(publicCatalogueDir, cleanDocName);
        const targetUploadPath = path.join(cataloguesUploadsDir, cleanDocName);
        const targetPubPath = path.join(publicCataloguesDir, cleanDocName);
        if (!fs.existsSync(targetPubCatPath)) fs.copyFileSync(oldDiskPath, targetPubCatPath);
        if (!fs.existsSync(targetUploadPath)) fs.copyFileSync(oldDiskPath, targetUploadPath);
        if (!fs.existsSync(targetPubPath)) fs.copyFileSync(oldDiskPath, targetPubPath);
      } else {
        // Copy to public/uploads/products/ and mirror to public/uploads/
        const targetProdPath = path.join(productsUploadsDir, newFilename);
        const targetRootPath = path.join(rootUploadsDir, newFilename);
        if (!fs.existsSync(targetProdPath)) fs.copyFileSync(oldDiskPath, targetProdPath);
        if (!fs.existsSync(targetRootPath)) fs.copyFileSync(oldDiskPath, targetRootPath);
      }
    }

    // Register redirects for all URL permutations of the old file
    const oldProdUrl = `/uploads/products/${oldFilename}`;
    const oldRootUrl = `/uploads/${oldFilename}`;
    const oldCatUrl = `/catalogues/${oldFilename}`;

    const newUrl = isDoc
      ? `/catalogue/${cleanDocName}`
      : `/uploads/products/${newFilename}`;

    redirects[oldProdUrl] = newUrl;
    redirects[oldRootUrl] = newUrl;
    if (isDoc) {
      redirects[oldCatUrl] = newUrl;
      redirects[`/uploads/catalogues/${oldFilename}`] = newUrl;
      redirects[`/catalogues/${newFilename}`] = newUrl;
      redirects[`/uploads/catalogues/${newFilename}`] = newUrl;
      redirects[`/catalogue/${oldFilename}`] = newUrl;
    }
  }

  // Ensure all existing PDF files on disk are mirrored to public/catalogue with lowercase names and redirects
  [publicCataloguesDir, cataloguesUploadsDir].forEach((dir) => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach((f) => {
          if (f.toLowerCase().endsWith(".pdf")) {
            const cleanFn = f.toLowerCase();
            const srcPath = path.join(dir, f);
            const targetPubCatPath = path.join(publicCatalogueDir, cleanFn);
            if (!fs.existsSync(targetPubCatPath) && fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, targetPubCatPath);
            }
            redirects[`/catalogues/${f}`] = `/catalogue/${cleanFn}`;
            redirects[`/uploads/catalogues/${f}`] = `/catalogue/${cleanFn}`;
            if (f !== cleanFn) {
              redirects[`/catalogue/${f}`] = `/catalogue/${cleanFn}`;
            }
          }
        });
      } catch (_) {}
    }
  });

  // 3. Update store.json content
  function replaceUrl(currentUrl) {
    if (!currentUrl || typeof currentUrl !== "string") return currentUrl;
    for (const [oldFilename, newFilename] of migrationMap.entries()) {
      if (currentUrl.includes(oldFilename)) {
        const ext = path.extname(newFilename).toLowerCase();
        const isDoc = ext === ".pdf";
        if (isDoc) {
          return `/catalogue/${newFilename.toLowerCase()}`;
        }
        return `/uploads/products/${newFilename}`;
      }
    }
    // Also canonicalize any other /uploads/catalogues/ or /catalogues/ URLs
    if (currentUrl.startsWith("/uploads/catalogues/") || currentUrl.startsWith("/catalogues/")) {
      const fn = path.basename(currentUrl).toLowerCase();
      if (fn.endsWith(".pdf")) {
        return `/catalogue/${fn}`;
      }
    }
    return currentUrl;
  }

  // Deep recursive replace across the entire store object
  function deepReplace(obj) {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === "string") {
        obj[key] = replaceUrl(val);
      } else if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          if (typeof val[i] === "string") {
            val[i] = replaceUrl(val[i]);
          } else if (typeof val[i] === "object" && val[i] !== null) {
            deepReplace(val[i]);
          }
        }
      } else if (typeof val === "object" && val !== null) {
        deepReplace(val);
      }
    }
  }

  deepReplace(store);

  // Normalize all products catalogue fields in store
  if (Array.isArray(store.products)) {
    store.products.forEach((p) => {
      const cat = p.catalogue || p.catalogueUrl || p.catalogue_url || p.productPdf;
      if (cat && typeof cat === "string") {
        const lower = cat.toLowerCase().trim();
        if (lower && lower !== "no catalogue" && lower !== "none") {
          const fn = path.basename(cat).toLowerCase();
          const canon = `/catalogue/${fn}`;
          p.catalogue = canon;
          p.catalogueUrl = canon;
          p.catalogue_url = canon;
          p.productPdf = canon;
        } else {
          p.catalogue = "";
          p.catalogueUrl = "";
          p.catalogue_url = "";
          p.productPdf = "";
        }
      }
    });
  }

  // Update Media Library records
  if (Array.isArray(store.media)) {
    store.media.forEach((m) => {
      if (!m) return;
      const match = migrationMap.get(m.filename);
      if (match) {
        const ext = path.extname(match).toLowerCase();
        const isDoc = ext === ".pdf";
        m.filename = isDoc ? match.toLowerCase() : match;
        m.originalName = match;
        m.url = isDoc ? `/catalogue/${match.toLowerCase()}` : `/uploads/products/${match}`;
        if (m.altText && generatedRegex.test(m.altText)) {
          m.altText = path.basename(match, ext).replace(/[_-]/g, " ");
        }
      } else if (m.fileType === "document" || (m.url && m.url.toLowerCase().endsWith(".pdf")) || (m.filename && m.filename.toLowerCase().endsWith(".pdf"))) {
        const fn = path.basename(m.filename || m.url || "").toLowerCase();
        m.filename = fn;
        m.url = `/catalogue/${fn}`;
      }
    });
  }

  // Save updated store.json and media_redirects.json
  store._media_migrated_v1 = true;
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
  fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), "utf8");

  console.log(`[Media Migration] Migration complete! Updated ${migrationMap.size} files in store.json and saved redirects to media_redirects.json.`);

  // Synchronize with MySQL if connected
  syncMigrationToMysql(Object.fromEntries(migrationMap)).catch(() => {});

  return {
    migratedCount: migrationMap.size,
    migrationMap: Object.fromEntries(migrationMap),
    redirects,
  };
}

async function syncMigrationToMysql(migrationEntries) {
  try {
    const { getPool, isMysqlConnected } = require("../config/db");
    if (!isMysqlConnected()) return;
    const pool = getPool();
    if (!pool) return;
    for (const [oldFilename, newFilename] of Object.entries(migrationEntries)) {
      const ext = path.extname(newFilename).toLowerCase();
      const isDoc = ext === ".pdf";
      const oldProdUrl = `/uploads/products/${oldFilename}`;
      const oldRootUrl = `/uploads/${oldFilename}`;
      const newUrl = isDoc
        ? `/uploads/catalogues/${newFilename}`
        : `/uploads/products/${newFilename}`;

      await pool.query(
        "UPDATE products SET images_json = REPLACE(REPLACE(images_json, ?, ?), ?, ?)",
        [oldProdUrl, newUrl, oldRootUrl, newUrl]
      );
      await pool.query(
        "UPDATE blogs SET cover_image = REPLACE(REPLACE(cover_image, ?, ?), ?, ?)",
        [oldProdUrl, newUrl, oldRootUrl, newUrl]
      );
      await pool.query(
        "UPDATE seo_metadata SET og_image = REPLACE(REPLACE(og_image, ?, ?), ?, ?)",
        [oldProdUrl, newUrl, oldRootUrl, newUrl]
      );
    }
  } catch (err) {
    // MySQL offline or table not present
  }
}

module.exports = {
  migrateExistingMedia,
  cleanGeneratedFilename,
  syncMigrationToMysql,
};
