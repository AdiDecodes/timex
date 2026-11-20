const fs = require("fs");
const path = require("path");

const storePath = path.resolve(__dirname, "../server/data/store.json");
const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
const defaultColors = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../server/data/defaultColors.json"), "utf8"));

const defHexMap = {};
defaultColors.forEach((c) => {
  defHexMap[c.name] = c.hex;
  defHexMap[c.name.toLowerCase()] = c.hex;
});
defHexMap["Terracotta"] = "#C26D4D";
defHexMap["terracotta"] = "#C26D4D";
defHexMap["Orange"] = "#E67E22";
defHexMap["orange"] = "#E67E22";

function normalizeSingleColor(raw) {
  if (!raw) return [];
  let s = String(raw).trim();

  // Fix typos
  s = s
    .replace(/wlhite/gi, "White")
    .replace(/browm/gi, "Brown")
    .replace(/beigh/gi, "Beige")
    .replace(/beigr/gi, "Beige")
    .replace(/green\'/gi, "Green")
    .replace(/rasa/gi, "Pink")
    .replace(/ocre/gi, "Yellow")
    .replace(/verde/gi, "Green")
    .replace(/azul/gi, "Blue")
    .replace(/crema/gi, "Beige")
    .replace(/burdeos/gi, "Red")
    .replace(/colorful/gi, "Colourful");

  // Split composite delimiters: /, &, and
  const parts = s.split(/[\/&]|(?:\band\b)/i).map((p) => p.trim()).filter(Boolean);
  const results = [];

  for (let part of parts) {
    let base = part.replace(/\s*\([^)]*\)/g, "").trim();
    if (!base) continue;

    const lower = base.toLowerCase();
    if (lower === "white" || lower === "pearl white" || lower === "off white" || lower === "offwhite") {
      results.push("White");
    } else if (lower === "black") {
      results.push("Black");
    } else if (lower === "beige" || lower === "cream") {
      results.push("Beige");
    } else if (lower === "brown") {
      results.push("Brown");
    } else if (lower === "blue" || lower === "light blue") {
      results.push("Blue");
    } else if (lower === "green" || lower === "light green") {
      results.push("Green");
    } else if (lower === "grey" || lower === "gray" || lower === "grey charcoal") {
      results.push("Grey");
    } else if (lower === "gold") {
      results.push("Gold");
    } else if (lower === "copper") {
      results.push("Copper");
    } else if (lower === "cotto") {
      results.push("Cotto");
    } else if (lower === "dark wenge") {
      results.push("Dark Wenge");
    } else if (lower === "pink") {
      results.push("Pink");
    } else if (lower === "red") {
      results.push("Red");
    } else if (lower === "silver") {
      results.push("Silver");
    } else if (lower === "yellow") {
      results.push("Yellow");
    } else if (lower === "colourful") {
      results.push("Colourful");
    } else if (lower === "terracotta") {
      results.push("Cotto");
    } else if (lower === "caldera") {
      results.push("Brown");
      results.push("Cotto");
    } else if (lower.includes("9005")) {
      results.push("Beige");
    } else if (lower.includes("9006")) {
      results.push("Grey");
    } else if (lower === "orange") {
      results.push("Orange");
    } else {
      results.push(base.charAt(0).toUpperCase() + base.slice(1));
    }
  }

  return results;
}

let modifiedCount = 0;

const updatedProducts = store.products.map((p) => {
  let changed = false;

  // 1. Application normalization
  let app = (p.application || p.usage || "").trim();
  const appLower = app.toLowerCase();
  let normalizedApp = app;

  if (appLower.includes("exterior") || appLower.includes("outdoor")) {
    if (appLower.includes("wall") && appLower.includes("floor")) {
      normalizedApp = "Exterior, Wall & Floor";
    } else if (appLower.includes("wall")) {
      normalizedApp = "Exterior & Wall";
    } else if (appLower.includes("floor")) {
      normalizedApp = "Exterior & Floor";
    } else {
      normalizedApp = "Exterior";
    }
  } else if (appLower.includes("wall") && appLower.includes("floor")) {
    normalizedApp = "Wall & Floor";
  } else if (appLower.includes("wall")) {
    normalizedApp = "Wall";
  } else if (appLower.includes("floor")) {
    normalizedApp = "Floor";
  }

  if (p.application !== normalizedApp || p.usage !== normalizedApp) {
    changed = true;
  }

  // 2. Color normalization
  let colorsList = [];
  if (p.slug === "alberca") {
    colorsList = ["Blue"];
  } else if (p.slug === "fables-series") {
    colorsList = ["Beige", "Blue", "Green", "Red", "White"];
  } else {
    const rawAvail = Array.isArray(p.availableColors) ? p.availableColors : [];
    const rawColor = p.color ? [p.color] : [];
    const combined = [...rawColor, ...rawAvail];

    combined.forEach((c) => {
      const norm = normalizeSingleColor(c);
      norm.forEach((n) => {
        if (!colorsList.includes(n)) colorsList.push(n);
      });
    });
  }

  if (colorsList.length === 0) {
    colorsList = ["Beige"];
  }

  const primaryColor = colorsList[0];

  // 3. Color Hexes
  const existingHexes = p.colorHexes || p.color_hexes || {};
  const newHexes = {};
  colorsList.forEach((c) => {
    if (existingHexes[c] && typeof existingHexes[c] === "string" && existingHexes[c].trim().startsWith("#")) {
      newHexes[c] = existingHexes[c].trim();
    } else {
      const lower = c.toLowerCase();
      let found = false;
      for (const [k, v] of Object.entries(existingHexes)) {
        if (k.toLowerCase().includes(lower) && typeof v === "string" && v.trim().startsWith("#")) {
          newHexes[c] = v.trim();
          found = true;
          break;
        }
      }
      if (!found) {
        newHexes[c] = defHexMap[c] || defHexMap[c.toLowerCase()] || "#808080";
      }
    }
  });

  // 4. Color Images
  const existingColorImages = p.colorImages || {};
  const newColorImages = { ...existingColorImages };
  colorsList.forEach((c) => {
    if (!newColorImages[c]) {
      const lower = c.toLowerCase();
      for (const [k, v] of Object.entries(existingColorImages)) {
        if (k.toLowerCase().includes(lower) && typeof v === "string" && v.trim()) {
          newColorImages[c] = v.trim();
          break;
        }
      }
    }
  });

  if (
    p.color !== primaryColor ||
    JSON.stringify(p.availableColors) !== JSON.stringify(colorsList) ||
    JSON.stringify(p.colorHexes) !== JSON.stringify(newHexes) ||
    p.application !== normalizedApp
  ) {
    changed = true;
  }

  if (changed) {
    modifiedCount++;
  }

  return {
    ...p,
    application: normalizedApp,
    usage: normalizedApp,
    color: primaryColor,
    availableColors: colorsList,
    colorHexes: newHexes,
    color_hexes: newHexes,
    colorImages: newColorImages,
  };
});

store.products = updatedProducts;
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");

console.log(`Successfully updated ${modifiedCount} products in ${storePath}`);
