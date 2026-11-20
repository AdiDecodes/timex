const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { loadFallbackStore, saveFallbackStore } = require("./config/db");

function transpileAndEval(filePath, moduleAliases = {}) {
  const code = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });

  const moduleExports = {};
  const customRequire = (id) => {
    if (moduleAliases[id]) {
      return moduleAliases[id];
    }
    if (id.startsWith(".") || path.isAbsolute(id)) {
      const full = path.resolve(path.dirname(filePath), id);
      const candidates = [full, `${full}.ts`, `${full}.js`, `${full}/index.ts`, `${full}/index.js`];
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          return transpileAndEval(c, moduleAliases);
        }
      }
    }
    return require(id);
  };

  const fn = new Function("exports", "require", "module", "__filename", "__dirname", result.outputText);
  const fakeModule = { exports: moduleExports };
  fn(fakeModule.exports, customRequire, fakeModule, filePath, path.dirname(filePath));
  return fakeModule.exports;
}

try {
  console.log("Transpiling productImages.ts...");
  const productImagesPath = path.resolve(__dirname, "../src/utils/productImages.ts");
  const productImagesModule = transpileAndEval(productImagesPath);

  console.log("Transpiling products.ts...");
  const productsPath = path.resolve(__dirname, "../src/data/products.ts");
  const productsModule = transpileAndEval(productsPath, {
    "@/utils/productImages": productImagesModule,
  });

  const mockProducts = productsModule.MOCK_PRODUCTS || [];
  console.log(`Found ${mockProducts.length} mock products.`);

  const store = loadFallbackStore();
  store.products = mockProducts.map((p) => ({
    id: p.id,
    sku: p.sku || `TMX-SKU-${p.id}`,
    slug: p.slug,
    name: p.name,
    code: p.code,
    barcode: p.barcode || "",
    description: p.description || "",
    price: p.price || 0,
    b2b_price: p.b2bPrice || 0,
    inventory: p.inventory || 100,
    category_id: p.categoryId || "stone",
    category_name: p.category || "Stone Look",
    collection_id: p.collectionId || "coll-stone",
    collection_name: p.collection || "Timex Premium Collection",
    size: p.size || "800x1600 mm",
    thickness: p.thickness || "15 mm",
    finish: p.finish || "Polished",
    look: p.look || "Stone Look",
    material: p.material || "Vitrified Porcelain",
    origin: "Imported",
    color: p.color || "White / Grey Veins",
    application: p.usage || "Indoor & Outdoor, Floor & Wall",
    pattern: p.tilePattern || "Straight",
    water_absorption: p.waterAbsorption || "< 0.05%",
    images: p.images || [],
    is_active: true,
    meta_title: `${p.name} | Timex Ceramic Premium Tiles`,
    meta_description: p.description || "",
    keywords: `${p.name}, ${p.category}, ${p.look}, vitrified tiles, timex ceramic`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  saveFallbackStore(store);
  console.log(`Successfully saved ${store.products.length} products to store.json!`);
} catch (err) {
  console.error("Error seeding products:", err);
}
