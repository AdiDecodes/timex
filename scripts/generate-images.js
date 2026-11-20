const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "../public");
const imagesDir = path.join(publicDir, "images");

const subdirs = [
  "products",
  "ambience",
  "collections",
  "banners",
  "spaces",
  "materials"
];

// Ensure directories exist
subdirs.forEach((dir) => {
  const fullPath = path.join(imagesDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

function getSvgContent(title, subtitle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1931" />
      <stop offset="100%" stop-color="#1346af" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)" />
  <rect x="25" y="25" width="750" height="550" fill="none" stroke="#C5A880" stroke-width="2" opacity="0.35" rx="16" />
  <circle cx="400" cy="300" r="180" fill="none" stroke="#C5A880" stroke-width="1" opacity="0.1" />
  <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#C5A880" letter-spacing="4">${title.toUpperCase()}</text>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff" letter-spacing="2" opacity="0.9">TIMEX CERAMIC</text>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#ffffff" opacity="0.6">${subtitle}</text>
</svg>`;
}

// Generate banners/hero.svg
fs.writeFileSync(
  path.join(imagesDir, "banners/hero.svg"),
  getSvgContent("Luxury Spaces Hero Banner", "Timex Ceramic Redesign")
);

// Generate spaces
const spaces = ["living-rooms", "bathrooms", "kitchens", "outdoors", "commercial", "villas", "living-room", "kitchen", "bathroom", "outdoor"];
spaces.forEach((space) => {
  fs.writeFileSync(
    path.join(imagesDir, `spaces/${space}.svg`),
    getSvgContent(`${space} showcase`, "Premium Interior Concept")
  );
});

// Category looks list
const CATEGORY_NAMES = [
  "Stone", "Subway", "Moroccan", "Octagonal", "Wooden", "Texture", 
  "Colorful", "Terrazzo", "Tropical", "Metallic", "Geometric", 
  "Highlighter", "White", "Mosaic", "Boutique", "French frames", 
  "Fabric", "Brick", "Hexagon"
];

// Generate collections
CATEGORY_NAMES.forEach((name) => {
  const catId = name.toLowerCase().replace(" ", "-");
  fs.writeFileSync(
    path.join(imagesDir, `collections/${catId}.svg`),
    getSvgContent(`${name} Collection`, "Imported Architectural Slabs")
  );
});

// Generate product details (each product gets ambience, front, texture, close, surface, edge details)
CATEGORY_NAMES.forEach((name) => {
  const catId = name.toLowerCase().replace(" ", "-");
  
  const views = ["ambience", "front", "texture", "close", "surface", "edge"];
  
  // Product 1
  views.forEach((view) => {
    fs.writeFileSync(
      path.join(imagesDir, `products/${catId}-1-${view}.svg`),
      getSvgContent(`Timex ${name} Luxe A1`, `${view.toUpperCase()} detail`)
    );
  });

  // Product 2
  views.forEach((view) => {
    fs.writeFileSync(
      path.join(imagesDir, `products/${catId}-2-${view}.svg`),
      getSvgContent(`Timex ${name} Royal B2`, `${view.toUpperCase()} detail`)
    );
  });
});

console.log("Local placeholders generated successfully!");
