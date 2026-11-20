/**
 * scripts/test-auth-security.js
 * Comprehensive end-to-end security verification for Timex Ceramic Authentication
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("  TIMEX CERAMIC - AUTH SECURITY VERIFICATION SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Check Auth Status (Setup Required)
    // -------------------------------------------------------------
    console.log("\n[1] Testing GET /api/v1/auth/status on uninitialized store...");
    const statusRes1 = await request({
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/auth/status",
      method: "GET",
    });
    assert(statusRes1.status === 200, "Status endpoint returns 200");
    assert(statusRes1.data.setupRequired === true, "Setup is required initially");

    // -------------------------------------------------------------
    // Test 2: First-Time Setup Password Complexity Enforcement
    // -------------------------------------------------------------
    console.log("\n[2] Testing First-Time Admin Setup password validation...");

    // 2a. Short password (< 16 chars)
    const shortRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "master_admin",
        email: "security@timexceramic.com",
        password: "Short123!@#",
        confirmPassword: "Short123!@#",
      }
    );
    assert(shortRes.status === 400, "Rejects password under 16 characters (400)");

    // 2b. Missing special character
    const noSpecialRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "master_admin",
        email: "security@timexceramic.com",
        password: "Abcdefghijk12345678",
        confirmPassword: "Abcdefghijk12345678",
      }
    );
    assert(noSpecialRes.status === 400, "Rejects password without special symbol (400)");

    // 2c. Predictable pattern ("timex")
    const predictableRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "master_admin",
        email: "security@timexceramic.com",
        password: "TimexCeramic2026!@#$",
        confirmPassword: "TimexCeramic2026!@#$",
      }
    );
    assert(predictableRes.status === 400, "Rejects password containing predictable brand term 'timex' (400)");

    // 2d. Passwords do not match
    const mismatchRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "master_admin",
        email: "security@timexceramic.com",
        password: "V9#mK$7qL!2zP@8wX^4b",
        confirmPassword: "DifferentPassword123!",
      }
    );
    assert(mismatchRes.status === 400, "Rejects password mismatch (400)");

    // 2e. Valid Strong Password (16+ chars, upper, lower, number, special, unpredictable)
    const validStrongPassword = "V9#mK$7qL!2zP@8wX^4b";
    const setupSuccessRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "master_admin",
        email: "security@timexceramic.com",
        password: validStrongPassword,
        confirmPassword: validStrongPassword,
      }
    );
    assert(setupSuccessRes.status === 200, "Setup succeeds with valid 16+ character strong password (200)");
    assert(setupSuccessRes.data.success === true, "Response reports success: true");
    assert(Boolean(setupSuccessRes.data.token), "Setup response issues session JWT token");
    let authToken = setupSuccessRes.data.token;

    // -------------------------------------------------------------
    // Test 3: Check Auth Status After Setup
    // -------------------------------------------------------------
    console.log("\n[3] Testing GET /api/v1/auth/status after setup...");
    const statusRes2 = await request({
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/auth/status",
      method: "GET",
    });
    assert(statusRes2.data.setupRequired === false, "Setup is NO LONGER required after account initialization");

    // -------------------------------------------------------------
    // Test 4: Prevent Re-Setup
    // -------------------------------------------------------------
    console.log("\n[4] Testing that setup cannot be rerun once admin exists...");
    const reSetupRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/setup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: "hacker",
        email: "hacker@evil.com",
        password: "HackerPassword999!@#",
        confirmPassword: "HackerPassword999!@#",
      }
    );
    assert(reSetupRes.status === 400, "Blocked duplicate setup attempts (400)");

    // -------------------------------------------------------------
    // Test 5: Verify Login Security & Hardcoded Default Rejection
    // -------------------------------------------------------------
    console.log("\n[5] Testing Login Authentication...");

    // 5a. Legacy default "admin123" MUST BE REJECTED
    const defaultRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { username: "master_admin", password: "admin123" }
    );
    assert(defaultRes.status === 401, "Legacy default password 'admin123' is STRICTLY REJECTED (401)");

    // 5b. Correct strong password succeeds
    const goodLoginRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { username: "master_admin", password: validStrongPassword }
    );
    assert(goodLoginRes.status === 200, "Login succeeds with configured strong password (200)");
    assert(Boolean(goodLoginRes.data.token), "Login returns valid JWT token");
    authToken = goodLoginRes.data.token;

    // -------------------------------------------------------------
    // Test 6: Verify GET /api/v1/auth/me Profile
    // -------------------------------------------------------------
    console.log("\n[6] Testing Authenticated Session verification (GET /me)...");
    const meRes = await request({
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/auth/me",
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(meRes.status === 200, "Session token successfully authorized (200)");
    assert(meRes.data.user.username === "master_admin", "Returns authenticated admin profile");

    // -------------------------------------------------------------
    // Test 7: Change Password in Settings
    // -------------------------------------------------------------
    console.log("\n[7] Testing Admin Settings (Change Password)...");
    const newStrongPassword = "N4$pL^9yW!3rQ@7uM#1z";

    // 7a. Bad current password
    const badCurrentRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/change-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
      {
        currentPassword: "WrongCurrentPassword123!",
        newPassword: newStrongPassword,
        confirmPassword: newStrongPassword,
      }
    );
    assert(badCurrentRes.status === 400, "Rejects incorrect current password (400)");

    // 7b. Valid change password
    const goodChangeRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/change-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
      {
        currentPassword: validStrongPassword,
        newPassword: newStrongPassword,
        confirmPassword: newStrongPassword,
      }
    );
    assert(goodChangeRes.status === 200, "Change password succeeds with valid new 16+ credentials (200)");

    // 7c. Old password no longer works
    const oldLoginRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { username: "master_admin", password: validStrongPassword }
    );
    assert(oldLoginRes.status === 401, "Old password is now invalidated (401)");

    // 7d. New password logs in
    const newLoginRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { username: "master_admin", password: newStrongPassword }
    );
    assert(newLoginRes.status === 200, "New password authenticates successfully (200)");
    authToken = newLoginRes.data.token;

    // -------------------------------------------------------------
    // Test 8: Forgot Password & Reset Token Flow
    // -------------------------------------------------------------
    console.log("\n[8] Testing Password Reset Flow (Forgot & Reset)...");
    const forgotRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/forgot-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "security@timexceramic.com" }
    );
    assert(forgotRes.status === 200, "Forgot password endpoint returns 200");
    assert(Boolean(forgotRes.data.resetToken), "Temporary 1-hour reset token generated");
    const resetToken = forgotRes.data.resetToken;

    // Reset password with token
    const finalPassword = "Z8#kW$2mR!6vP@4tQ^9a";
    const resetRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/reset-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        token: resetToken,
        newPassword: finalPassword,
        confirmPassword: finalPassword,
      }
    );
    assert(resetRes.status === 200, "Password reset with valid token succeeds (200)");

    // Try to reuse the same reset token (must fail)
    const reuseRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/reset-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        token: resetToken,
        newPassword: "AnotherPassword123!@#",
        confirmPassword: "AnotherPassword123!@#",
      }
    );
    assert(reuseRes.status === 400, "Single-use token cannot be reused (400)");

    // Final login with updated password
    const finalLoginRes = await request(
      {
        hostname: "localhost",
        port: 5001,
        path: "/api/v1/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { username: "master_admin", password: finalPassword }
    );
    assert(finalLoginRes.status === 200, "Login with reset password succeeds (200)");

    // -------------------------------------------------------------
    // Test 9: Brute-Force Rate Limiting (5 failed attempts triggers 429)
    // -------------------------------------------------------------
    console.log("\n[9] Testing Brute-Force Rate Limiting (Lockout after 5 failed attempts)...");
    const testBruteUser = "brute_target_" + Date.now();
    let lockedOut = false;
    for (let i = 1; i <= 6; i++) {
      const bruteRes = await request(
        {
          hostname: "localhost",
          port: 5001,
          path: "/api/v1/auth/login",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        { username: testBruteUser, password: "WrongPassword" + i }
      );
      if (bruteRes.status === 429) {
        lockedOut = true;
        break;
      }
    }
    assert(lockedOut === true, "Brute force attempts triggered 429 Too Many Requests Lockout");

    // -------------------------------------------------------------
    // Test 10: Store Password Security Audit
    // -------------------------------------------------------------
    console.log("\n[10] Auditing store.json password security...");
    const storePath = path.join(__dirname, "..", "server", "data", "store.json");
    const storeContent = JSON.parse(fs.readFileSync(storePath, "utf8"));
    const storedAdmin = storeContent.admin_users[0];
    assert(Boolean(storedAdmin.password_hash), "Admin user has password_hash");
    assert(
      storedAdmin.password_hash.startsWith("$2a$12$") || storedAdmin.password_hash.startsWith("$2b$12$"),
      "Password stored strictly as bcrypt hash with salt rounds = 12"
    );
    assert(!storeContent.admin_users.some((u) => u.password), "No plain text password property exists in store");

    // -------------------------------------------------------------
    // Test 11: Frontend /admin HTML Security Audit
    // -------------------------------------------------------------
    console.log("\n[11] Auditing /admin HTML response from Next.js (port 3000)...");
    const adminPageRes = await request({
      hostname: "localhost",
      port: 3000,
      path: "/admin",
      method: "GET",
    });
    assert(adminPageRes.status === 200, "Frontend /admin responds with 200");
    const html = typeof adminPageRes.data === "string" ? adminPageRes.data : JSON.stringify(adminPageRes.data);
    assert(!html.includes("admin123"), "No 'admin123' appears anywhere in HTML output");
    assert(!html.includes(finalPassword), "No actual password appears anywhere in HTML output");

    // -------------------------------------------------------------
    // Test 12: Verify Public CMS APIs
    // -------------------------------------------------------------
    console.log("\n[12] Verifying CMS APIs continue running seamlessly...");
    const prodsRes = await request({
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/products",
      method: "GET",
    });
    assert(prodsRes.status === 200, "Products API 200 OK");
    assert(Array.isArray(prodsRes.data.products), `Products list available (${prodsRes.data.products.length} products)`);

    const blogsRes = await request({
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/blogs",
      method: "GET",
    });
    assert(blogsRes.status === 200, `Blogs API 200 OK (${blogsRes.data.blogs.length} articles)`);

    const mediaRes = await request({
      hostname: "localhost",
      port: 5001,
      path: "/api/v1/media",
      method: "GET",
    });
    assert(mediaRes.status === 200, `Media API 200 OK (${mediaRes.data.media?.length || 0} media assets)`);

    console.log("\n==================================================");
    console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("Verification error:", err);
    process.exit(1);
  }
}

runTests();
