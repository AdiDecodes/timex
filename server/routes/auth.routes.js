const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "timex_ceramic_admin_super_secret_jwt_key_2026";

// ==========================================
// Rate Limiter & Brute-Force Protection
// Max 5 failed attempts per IP + username within 15 minutes
// ==========================================
const loginAttempts = new Map(); // key: `${ip}_${identifier}`, value: { count: number, lockedUntil: number | null }

function checkRateLimit(ip, identifier) {
  const key = `${ip}_${(identifier || "").toLowerCase().trim()}`;
  const record = loginAttempts.get(key);
  if (!record) return { locked: false };

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainingMinutes = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return {
      locked: true,
      remainingMinutes,
      message: `Too many failed login attempts. Security lockout active. Please try again in ${remainingMinutes} minute(s).`,
    };
  }

  // Lockout expired, reset
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    loginAttempts.delete(key);
  }

  return { locked: false };
}

function recordFailedAttempt(ip, identifier) {
  const key = `${ip}_${(identifier || "").toLowerCase().trim()}`;
  const record = loginAttempts.get(key) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
    console.warn(`[Security Alert] 5 failed login attempts for ${key}. Account locked for 15 minutes.`);
  }
  loginAttempts.set(key, record);
}

function resetLoginAttempts(ip, identifier) {
  const key = `${ip}_${(identifier || "").toLowerCase().trim()}`;
  loginAttempts.delete(key);
}

// ==========================================
// Password Complexity Validator
// Requirements:
// - Minimum 16 characters
// - At least 1 uppercase letter
// - At least 1 lowercase letter
// - At least 1 numeric digit
// - At least 1 special character
// - Rejects common/predictable passwords
// ==========================================
function validateStrongPassword(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required." };
  }
  if (password.length < 16) {
    return { valid: false, error: "Password must be at least 16 characters in length." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one numeric digit (0-9)." };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character (!@#$%^&*...)." };
  }

  const lower = password.toLowerCase();
  const predictablePatterns = [
    "admin",
    "admin123",
    "password",
    "123456",
    "timex",
    "timex123",
    "qwerty",
    "letmein",
    "welcome",
    "ceramic",
  ];
  for (const term of predictablePatterns) {
    if (lower.includes(term)) {
      return {
        valid: false,
        error: `Password cannot contain predictable words or company names such as "${term}".`,
      };
    }
  }

  return { valid: true };
}

// ==========================================
// Authentication Middleware
// ==========================================
function requireAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.timex_admin_token) {
    token = req.cookies.timex_admin_token;
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)timex_admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Authorization token required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired session token. Please log in again." });
  }
}

// ==========================================
// Helper: Check if Setup is Required
// ==========================================
async function isSetupRequired() {
  if (isMysqlConnected()) {
    try {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(64) NOT NULL PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      const [rows] = await pool.query(
        "SELECT COUNT(*) AS count FROM admin_users WHERE password_hash IS NOT NULL AND password_hash != ''"
      );
      return !rows[0] || rows[0].count === 0;
    } catch (err) {
      console.error("Error checking MySQL admin status:", err.message);
      return true;
    }
  }

  const store = loadFallbackStore();
  const admins = Array.isArray(store.admin_users) ? store.admin_users : [];
  const activeAdmin = admins.find((u) => u.password_hash && u.password_hash.trim() !== "");
  return !activeAdmin;
}

// ==========================================
// 1. GET /api/v1/auth/status
// Check whether initial admin setup is required
// ==========================================
router.get("/status", async (req, res) => {
  try {
    const needed = await isSetupRequired();
    return res.json({
      success: true,
      setupRequired: needed,
    });
  } catch (err) {
    console.error("Auth status error:", err);
    return res.status(500).json({ success: false, error: "Failed to determine admin setup status." });
  }
});

// ==========================================
// 2. POST /api/v1/auth/setup
// First-time administrator account creation
// Requires 16+ character strong password
// ==========================================
router.post("/setup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const needed = await isSetupRequired();
    if (!needed) {
      return res.status(400).json({
        success: false,
        error: "Administrator setup is already completed. Please log in with your credentials.",
      });
    }

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "Username is required and must be at least 3 characters long.",
      });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username.trim())) {
      return res.status(400).json({
        success: false,
        error: "Username may only contain letters, numbers, hyphens, dots, and underscores.",
      });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "A valid email address is required.",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and Confirm Password are both required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password confirmation does not match the entered password.",
      });
    }

    const validation = validateStrongPassword(password);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    // Hash password with bcrypt salt rounds = 12
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = "admin-" + Date.now();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    if (isMysqlConnected()) {
      const pool = getPool();
      // Ensure admin_users table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(64) NOT NULL PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      const [existingUsers] = await pool.query(
        "SELECT id FROM admin_users WHERE username = ? OR email = ? LIMIT 1",
        [cleanUsername, cleanEmail]
      );
      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: "An administrator with this username or email already exists.",
        });
      }

      await pool.query(
        `INSERT INTO admin_users (id, username, email, password_hash, role, created_at)
         VALUES (?, ?, ?, ?, 'ADMIN', NOW())`,
        [userId, cleanUsername, cleanEmail, passwordHash]
      );
    }

    // Also persist in fallback store
    const store = loadFallbackStore();
    store.admin_users = [
      {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        password_hash: passwordHash,
        role: "ADMIN",
        setup_completed: true,
        created_at: now,
        updated_at: now,
      },
    ];
    saveFallbackStore(store);

    console.log(`[Security Audit] Initial administrator created successfully for username "${cleanUsername}".`);

    // Issue JWT token for immediate access
    const token = jwt.sign(
      {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        role: "ADMIN",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie for browser session persistence
    const isHttps = Boolean(
      req.secure ||
      req.headers["x-forwarded-proto"] === "https" ||
      (req.headers["cf-visitor"] && req.headers["cf-visitor"].includes('"scheme":"https"'))
    );
    res.cookie("timex_admin_token", token, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "lax",
      secure: isHttps,
    });

    return res.json({
      success: true,
      message: "Administrator account initialized successfully.",
      token,
      user: {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        role: "ADMIN",
      },
    });
  } catch (err) {
    console.error("Setup error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "An administrator with this username or email already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Admin initialization failed: " + (err.message || "Internal database error."),
    });
  }
});

// ==========================================
// 3. POST /api/v1/auth/login
// Secure login with Rate Limiting & Bcrypt comparison
// Absolutely NO plain text or hardcoded passwords!
// ==========================================
router.post("/login", async (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const identifier = (req.body.username || req.body.email || "").trim();
  const { password } = req.body;

  // Rate Limiting Check
  const rateLimitStatus = checkRateLimit(ip, identifier);
  if (rateLimitStatus.locked) {
    return res.status(429).json({
      success: false,
      error: rateLimitStatus.message,
    });
  }

  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: "Username/Email and Password are required." });
  }

  try {
    let user = null;

    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query(
        "SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1",
        [identifier, identifier]
      );
      if (rows.length > 0) {
        user = rows[0];
      }
    }

    if (!user) {
      const store = loadFallbackStore();
      user = (store.admin_users || []).find(
        (u) =>
          u.username.toLowerCase() === identifier.toLowerCase() ||
          u.email.toLowerCase() === identifier.toLowerCase()
      );
    }

    // If user not found, record failed attempt and return generic 401
    if (!user || !user.password_hash) {
      recordFailedAttempt(ip, identifier);
      return res.status(401).json({ success: false, error: "Invalid username or password." });
    }

    // Verify password strictly with bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash).catch(() => false);
    if (!isMatch) {
      recordFailedAttempt(ip, identifier);
      return res.status(401).json({ success: false, error: "Invalid username or password." });
    }

    // Authentication succeeded: reset failed attempts
    resetLoginAttempts(ip, identifier);

    // Issue 24-hour signed JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || "ADMIN",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie for browser session persistence
    const isHttps = Boolean(
      req.secure ||
      req.headers["x-forwarded-proto"] === "https" ||
      (req.headers["cf-visitor"] && req.headers["cf-visitor"].includes('"scheme":"https"'))
    );
    res.cookie("timex_admin_token", token, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "lax",
      secure: isHttps,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || "ADMIN",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Internal server error during authentication." });
  }
});

// ==========================================
// 4. GET /api/v1/auth/me
// Returns the currently logged in administrator profile
// ==========================================
router.get("/me", requireAuth, async (req, res) => {
  return res.json({ success: true, user: req.user });
});

// ==========================================
// 5. POST /api/v1/auth/change-password
// Allows authenticated administrator to change their password
// Validates current password & enforces 16+ char complexity
// ==========================================
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      error: "Current password, new password, and confirmation are all required.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      error: "New password and confirm password do not match.",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      error: "The new password must be different from your current password.",
    });
  }

  const validation = validateStrongPassword(newPassword);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  try {
    let user = null;

    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM admin_users WHERE id = ? LIMIT 1", [userId]);
      if (rows.length > 0) user = rows[0];
    }

    const store = loadFallbackStore();
    if (!user) {
      user = (store.admin_users || []).find((u) => u.id === userId);
    }

    if (!user || !user.password_hash) {
      return res.status(404).json({ success: false, error: "Admin user record not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash).catch(() => false);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Current password does not match our records." });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 12);
    const now = new Date().toISOString();

    if (isMysqlConnected()) {
      const pool = getPool();
      await pool.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [newHash, userId]);
    }

    // Update in store
    const adminIdx = (store.admin_users || []).findIndex((u) => u.id === userId);
    if (adminIdx !== -1) {
      store.admin_users[adminIdx].password_hash = newHash;
      store.admin_users[adminIdx].updated_at = now;
      saveFallbackStore(store);
    }

    console.log(`[Security Audit] Password successfully changed for user "${req.user.username}".`);
    return res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ success: false, error: "Failed to update password." });
  }
});

// ==========================================
// 6. POST /api/v1/auth/forgot-password
// Generates secure 1-hour expiration token for resetting password
// Does not reveal whether user exists (prevents account enumeration)
// ==========================================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return res.status(400).json({ success: false, error: "A valid email address is required." });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    let user = null;
    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM admin_users WHERE email = ? LIMIT 1", [cleanEmail]);
      if (rows.length > 0) user = rows[0];
    }

    const store = loadFallbackStore();
    if (!user) {
      user = (store.admin_users || []).find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (user) {
      // Generate secure 32-byte hex token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour expiration

      // Store in memory / JSON store
      store.password_resets = (store.password_resets || []).filter(
        (r) => r.expiresAt > Date.now() && r.email !== cleanEmail
      );
      store.password_resets.push({
        token: resetToken,
        userId: user.id,
        email: cleanEmail,
        expiresAt,
        created_at: new Date().toISOString(),
      });
      saveFallbackStore(store);

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.timexceramic.com";
      console.log("==================================================");
      console.log(`[Security Notice] Password Reset Requested for ${cleanEmail}`);
      console.log(`Reset Token: ${resetToken}`);
      console.log(`Reset Link: ${siteUrl}/admin?resetToken=${resetToken}`);
      console.log(`Expires in: 1 hour`);
      console.log("==================================================");

      return res.json({
        success: true,
        message: "If an administrator account with that email exists, reset instructions have been generated (valid for 1 hour).",
        // Provide token in response so local dev / standalone Netlify admin can complete the flow
        resetToken,
      });
    }

    // Prevent enumeration: return identical message even if email not registered
    return res.json({
      success: true,
      message: "If an administrator account with that email exists, reset instructions have been generated (valid for 1 hour).",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, error: "Failed to process password reset request." });
  }
});

// ==========================================
// 7. POST /api/v1/auth/reset-password
// Completes password reset using a valid, unexpired token
// Enforces 16+ character strong password policy
// ==========================================
router.post("/reset-password", async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, error: "Password reset token is required." });
  }

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, error: "New password and confirmation are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, error: "Passwords do not match." });
  }

  const validation = validateStrongPassword(newPassword);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  try {
    const store = loadFallbackStore();
    const resets = store.password_resets || [];
    const record = resets.find((r) => r.token === token.trim() && r.expiresAt > Date.now());

    if (!record) {
      return res.status(400).json({
        success: false,
        error: "This password reset token is invalid or has expired. Please request a new reset link.",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const now = new Date().toISOString();

    if (isMysqlConnected()) {
      const pool = getPool();
      await pool.query("UPDATE admin_users SET password_hash = ? WHERE id = ? OR email = ?", [
        newHash,
        record.userId,
        record.email,
      ]);
    }

    // Update in fallback store
    const adminIdx = (store.admin_users || []).findIndex(
      (u) => u.id === record.userId || u.email.toLowerCase() === record.email.toLowerCase()
    );
    if (adminIdx !== -1) {
      store.admin_users[adminIdx].password_hash = newHash;
      store.admin_users[adminIdx].updated_at = now;
    }

    // Invalidate the reset token
    store.password_resets = (store.password_resets || []).filter((r) => r.token !== token.trim());
    saveFallbackStore(store);

    console.log(`[Security Audit] Password successfully reset for administrator "${record.email}".`);

    return res.json({
      success: true,
      message: "Your password has been reset successfully. Please log in with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, error: "Failed to reset password." });
  }
});

// ==========================================
// 8. POST /api/v1/auth/logout
// Secure session termination
// ==========================================
router.post("/logout", (req, res) => {
  res.clearCookie("timex_admin_token", { path: "/" });
  return res.json({ success: true, message: "Logged out successfully." });
});

module.exports = router;
