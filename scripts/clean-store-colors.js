const fs = require("fs");
const path = require("path");

const storePath = path.resolve(__dirname, "../server/data/store.json");
if (fs.existsSync(storePath)) {
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  let updatedCount = 0;
  if (Array.isArray(store.products)) {
    store.products.forEach((p) => {
      if (
        (p.color === "White / Grey Veins" || p.color === "White") &&
        (!p.colorImages || Object.keys(p.colorImages).length === 0)
      ) {
        p.color = "";
        p.availableColors = [];
        updatedCount++;
      }
    });
  }
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
  console.log(`Successfully cleaned default colors for ${updatedCount} products in store.json.`);
}
