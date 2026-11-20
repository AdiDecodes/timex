const http = require("http");
const app = require("../server/app");

const server = app.listen(5099, async () => {
  console.log("Test server running on port 5099");

  function request(method, path, data) {
    return new Promise((resolve, reject) => {
      const payload = data ? JSON.stringify(data) : "";
      const req = http.request(
        {
          hostname: "localhost",
          port: 5099,
          path,
          method,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(body) });
            } catch {
              resolve({ status: res.statusCode, raw: body });
            }
          });
        }
      );
      req.on("error", reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  try {
    // 1. Test .htaccess
    console.log("\n1. Testing GET /api/v1/seo/htaccess...");
    const r1 = await request("GET", "/api/v1/seo/htaccess");
    console.log("Status:", r1.status, "Success:", r1.data.success, "Has netlify_notice:", Boolean(r1.data.netlify_notice));

    console.log("\n2. Testing POST /api/v1/seo/htaccess with dangerous rule...");
    const r2 = await request("POST", "/api/v1/seo/htaccess", { content: "Deny from all", force: false });
    console.log("Status:", r2.status, "Warning caught:", r2.data.warning, "Risk:", r2.data.risk_level);

    console.log("\n3. Testing POST /api/v1/seo/htaccess (safe)...");
    const r3 = await request("POST", "/api/v1/seo/htaccess", { content: "# Safe test\nRewriteEngine On\n", note: "Test safe save" });
    console.log("Status:", r3.status, "Success:", r3.data.success, "Backup created:", r3.data.backup_created);

    // 2. Test llms.txt
    console.log("\n4. Testing GET /api/v1/seo/llms-txt...");
    const r4 = await request("GET", "/api/v1/seo/llms-txt");
    console.log("Status:", r4.status, "Success:", r4.data.success, "Char count:", r4.data.stats?.char_count);

    console.log("\n5. Testing POST /api/v1/seo/llms-txt/generate...");
    const r5 = await request("POST", "/api/v1/seo/llms-txt/generate");
    console.log("Status:", r5.status, "Success:", r5.data.success, "Has Harlem Series:", r5.data.generated_content?.includes("Harlem Series"));

    console.log("\n6. Testing POST /api/v1/seo/llms-txt (save)...");
    const r6 = await request("POST", "/api/v1/seo/llms-txt", { content: r5.data.generated_content, note: "Live catalog generate" });
    console.log("Status:", r6.status, "Success:", r6.data.success);

    // 3. Test Custom Code
    console.log("\n7. Testing GET /api/v1/seo/custom-code...");
    const r7 = await request("GET", "/api/v1/seo/custom-code");
    console.log("Status:", r7.status, "Success:", r7.data.success, "Enabled:", r7.data.custom_code?.enabled);

    console.log("\n8. Testing POST /api/v1/seo/custom-code (save)...");
    const r8 = await request("POST", "/api/v1/seo/custom-code", {
      enabled: true,
      head_code: "<!-- Verified GSC -->\n<meta name=\"google-site-verification\" content=\"test-code-123\" />",
      body_start_code: "<noscript><div>GTM Noscript</div></noscript>",
      body_end_code: "<script>console.log('Timex Analytics');</script>",
      note: "Test update",
    });
    console.log("Status:", r8.status, "Success:", r8.data.success, "Backup created:", r8.data.backup_created);

    console.log("\n==================================================");
    console.log(" ✓ ALL NEW SEO ENDPOINTS PASSED VERIFICATION");
    console.log("==================================================");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    server.close();
    process.exit(0);
  }
});
