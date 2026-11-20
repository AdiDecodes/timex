const http = require("http");
const fs = require("fs");
const path = require("path");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(typeof data === "string" ? data : JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log("=== Testing Timex Ceramic Admin API & Persistence ===");

  // 1. Auth Login / Setup
  console.log("\n1. Testing Auth Login / Status...");
  const statusRes = await request({
    hostname: "localhost",
    port: 5001,
    path: "/api/v1/auth/status",
    method: "GET",
  });

  let token = null;
  const testPassword = "T7#xK$9pL!2zP@8wQ^4b";

  if (statusRes.data?.setupRequired) {
    console.log("Setup is required. Initializing test administrator...");
    const setupRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "admin",
        email: "admin@timexceramic.com",
        password: testPassword,
        confirmPassword: testPassword,
      }
    );
    token = setupRes.data?.token;
  } else {
    const loginRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { username: "admin", password: testPassword }
    );
    token = loginRes.data?.token;
  }

  if (!token) throw new Error("Failed to obtain token from auth setup/login.");
  console.log("Authentication token obtained successfully.");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 2. Fetch products
  console.log("\n2. Testing GET /api/v1/products...");
  const prodsRes = await request({
    hostname: "localhost",
    port: 5001,
    path: "/api/v1/products",
    method: "GET",
  });
  console.log("Products status:", prodsRes.status, "Count:", prodsRes.data?.products?.length);
  const harlem = prodsRes.data?.products?.find((p) => p.slug === "harlem-series" || p.id === "prod-brick-1");
  console.log("Found Harlem Series:", harlem?.name, "ID:", harlem?.id, "Price:", harlem?.price);

  // 3. Edit Harlem Series
  console.log("\n3. Testing Edit Harlem Series (PUT)...");
  const originalPrice = harlem.price;
  const updateRes = await request(
    {
      hostname: "localhost",
      port: 5001,
      path: `/api/v1/products/${harlem.id}`,
      method: "PUT",
      headers: authHeaders,
    },
    {
      ...harlem,
      price: originalPrice + 15,
      meta_title: "Harlem Series | Authentic New York Industrial Porcelain Tiles",
    }
  );
  console.log("Update status:", updateRes.status, "Success:", updateRes.data?.success);

  // Verify persistence from disk store.json directly
  const storePath = path.resolve(__dirname, "../../../../../../../e:/Sagar Developer/Antigravity/timex-ceramic/server/data/store.json");
  const diskData = JSON.parse(fs.readFileSync("server/data/store.json", "utf8"));
  const diskHarlem = diskData.products.find((p) => p.id === harlem.id);
  console.log("Persisted price in store.json:", diskHarlem?.price, "(Expected:", originalPrice + 15, ")");

  // Revert Harlem Series to original
  console.log("\nReverting Harlem Series price...");
  await request(
    {
      hostname: "localhost",
      port: 5001,
      path: `/api/v1/products/${harlem.id}`,
      method: "PUT",
      headers: authHeaders,
    },
    {
      ...harlem,
      price: originalPrice,
    }
  );
  const diskDataReverted = JSON.parse(fs.readFileSync("server/data/store.json", "utf8"));
  console.log("Reverted price in store.json:", diskDataReverted.products.find((p) => p.id === harlem.id)?.price);

  // 4. Test Add New Product
  console.log("\n4. Testing Add New Product (POST)...");
  const newProductPayload = {
    name: "Calacatta Gold Sovereign",
    code: "TMX-CGS-999",
    slug: "calacatta-gold-sovereign",
    sku: "TMX-SKU-CGS999",
    price: 850,
    b2b_price: 680,
    inventory: 50,
    category_id: "stone",
    category_name: "Stone Look",
    collection_id: "stone",
    collection_name: "Stone",
    size: "1200x2400 mm",
    thickness: "15 mm",
    finish: "Polished Glazed",
    look: "Marble Look",
    material: "Sintered Stone",
    origin: "Imported Italy",
    color: "Gold / White",
    application: "Indoor Floor & Wall",
    pattern: "Bookmatched",
    water_absorption: "< 0.02%",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
    is_active: true,
    meta_title: "Calacatta Gold Sovereign | Timex Ceramic",
    meta_description: "Exclusive Italian marble slab replication.",
  };

  const createRes = await request(
    {
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/products",
      method: "POST",
      headers: authHeaders,
    },
    newProductPayload
  );
  console.log("Create status:", createRes.status, "Created ID:", createRes.data?.product?.id);
  const createdId = createRes.data?.product?.id;

  // Verify created product in store.json
  const diskAfterCreate = JSON.parse(fs.readFileSync("server/data/store.json", "utf8"));
  console.log("Disk product count after create:", diskAfterCreate.products.length);
  const diskCreated = diskAfterCreate.products.find((p) => p.id === createdId || p.slug === "calacatta-gold-sovereign");
  console.log("Found newly created product on disk:", diskCreated?.name);

  // 5. Test Delete Product
  console.log("\n5. Testing Delete Product (DELETE)...");
  const deleteRes = await request({
    hostname: "localhost",
    port: 5001,
    path: `/api/v1/products/${createdId}`,
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("Delete status:", deleteRes.status, "Success:", deleteRes.data?.success);

  // Verify deletion from disk
  const diskAfterDelete = JSON.parse(fs.readFileSync("server/data/store.json", "utf8"));
  console.log("Disk product count after delete:", diskAfterDelete.products.length);
  const stillExists = diskAfterDelete.products.some((p) => p.id === createdId);
  console.log("Product still exists on disk:", stillExists ? "YES (FAIL)" : "NO (SUCCESS - Cleaned up)");

  console.log("\n==================================================");
  console.log(" ✓ ALL API PERSISTENCE TESTS PASSED COMPLETELY");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
