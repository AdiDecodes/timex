const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const destDir = path.join(rootDir, "HOSTINGER_DEPLOYMENT");

console.log("==================================================");
console.log(" Packaging HOSTINGER_DEPLOYMENT for Hostinger VPS");
console.log("==================================================");

// 1. Clean previous destination if exists
if (fs.existsSync(destDir)) {
  console.log("Removing previous HOSTINGER_DEPLOYMENT folder...");
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

function copyDirRecursive(src, dest, filterFn = null) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (filterFn && !filterFn(srcPath, entry)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, filterFn);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copy .next (excluding .next/cache)
console.log("Copying .next production build output (excluding build cache)...");
copyDirRecursive(
  path.join(rootDir, ".next"),
  path.join(destDir, ".next"),
  (filePath, entry) => {
    // Exclude cache directory
    const rel = path.relative(path.join(rootDir, ".next"), filePath);
    if (rel === "cache" || rel.startsWith("cache" + path.sep)) {
      return false;
    }
    return true;
  }
);

// 3. Copy src/
console.log("Copying src/ directory (all frontend components, pages, services, types)...");
copyDirRecursive(path.join(rootDir, "src"), path.join(destDir, "src"));

// 4. Copy server/ (excluding store.json and runtime store backups)
console.log("Copying server/ directory (excluding production store.json & backups)...");
copyDirRecursive(
  path.join(rootDir, "server"),
  path.join(destDir, "server"),
  (filePath, entry) => {
    const fileName = entry.name;
    // Exclude store.json and store backups
    if (fileName === "store.json" || fileName.startsWith("store.backup")) {
      return false;
    }
    return true;
  }
);

// 5. Copy public/ (excluding uploads, catalogue, catalogues)
console.log("Copying public/ directory (excluding uploads & catalogue PDFs)...");
copyDirRecursive(
  path.join(rootDir, "public"),
  path.join(destDir, "public"),
  (filePath, entry) => {
    const rel = path.relative(path.join(rootDir, "public"), filePath);
    if (
      rel === "uploads" || rel.startsWith("uploads" + path.sep) ||
      rel === "catalogue" || rel.startsWith("catalogue" + path.sep) ||
      rel === "catalogues" || rel.startsWith("catalogues" + path.sep)
    ) {
      return false;
    }
    return true;
  }
);

// 6. Copy Root Files
console.log("Copying root configuration and package files...");
const rootFiles = [
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "next-env.d.ts",
];

rootFiles.forEach((file) => {
  const src = path.join(rootDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  } else {
    console.warn(`Warning: Root file ${file} not found.`);
  }
});

console.log("Packaging completed successfully!");
