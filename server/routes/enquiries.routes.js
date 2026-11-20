const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const XLSX = require("xlsx");
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");

// GET /api/v1/enquiries
router.get("/", async (req, res) => {
  const { type, status, search } = req.query;

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      let sql = "SELECT * FROM enquiries WHERE 1=1";
      const params = [];

      if (type && type !== "ALL") {
        sql += " AND type = ?";
        params.push(type);
      }
      if (status && status !== "ALL") {
        sql += " AND status = ?";
        params.push(status);
      }
      if (search) {
        sql += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR message LIKE ?)";
        const q = `%${search}%`;
        params.push(q, q, q, q, q);
      }

      sql += " ORDER BY created_at DESC";

      const [rows] = await pool.query(sql, params);
      const parsed = rows.map((r) => ({
        ...r,
        details: r.details_json ? JSON.parse(r.details_json) : {},
      }));
      return res.json({ success: true, count: parsed.length, enquiries: parsed });
    }

    const store = loadFallbackStore();
    let result = (store.enquiries || []).map((e) => ({
      ...e,
      details: e.details || (e.details_json ? (typeof e.details_json === "string" ? JSON.parse(e.details_json) : e.details_json) : {}),
    }));

    if (type && type !== "ALL") {
      result = result.filter((e) => e.type?.toUpperCase() === type.toUpperCase());
    }
    if (status && status !== "ALL") {
      result = result.filter((e) => e.status?.toUpperCase() === status.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.phone?.toLowerCase().includes(q) ||
          e.company?.toLowerCase().includes(q) ||
          e.message?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return res.json({ success: true, count: result.length, enquiries: result });
  } catch (err) {
    console.error("Fetch enquiries error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/enquiries/export (Download Excel .xlsx file of all enquiries)
router.get("/export", async (req, res) => {
  try {
    let enquiries = [];

    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM enquiries ORDER BY created_at DESC");
      enquiries = rows.map((r) => ({
        ...r,
        details: r.details_json ? JSON.parse(r.details_json) : {},
      }));
    } else {
      const store = loadFallbackStore();
      enquiries = (store.enquiries || []).map((e) => ({
        ...e,
        details: e.details || (e.details_json ? (typeof e.details_json === "string" ? JSON.parse(e.details_json) : e.details_json) : {}),
      }));
      enquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const rows = enquiries.map((enq, index) => {
      let productsSummary = "—";
      const details = enq.details || {};

      if (Array.isArray(details.products) && details.products.length > 0) {
        productsSummary = details.products
          .map((p, i) => {
            const parts = [
              `Product ${i + 1}: ${p.name || "Tile"}`,
              p.code ? `[Code: ${p.code}]` : null,
              p.size ? `Size: ${p.size}` : null,
              p.finish ? `Finish: ${p.finish}` : null,
              p.quantity ? `Qty: ${p.quantity} Box(es)` : null,
            ].filter(Boolean);
            return parts.join(" | ");
          })
          .join("\r\n");
      } else if (details.productName || enq.productName) {
        const pName = details.productName || enq.productName;
        const pCode = details.productCode || enq.productCode;
        const pSize = details.size || enq.size;
        productsSummary = `${pName}${pCode ? ` [Code: ${pCode}]` : ""}${pSize ? ` (Size: ${pSize})` : ""}`;
      } else if (details.collectionName || enq.collectionName) {
        productsSummary = `Collection: ${details.collectionName || enq.collectionName}`;
      } else {
        productsSummary = (enq.type || "GENERAL").replace(/_/g, " ");
      }

      const dateObj = new Date(enq.created_at);
      const formattedDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : enq.created_at || "—";

      return {
        "Sr No": index + 1,
        "Enquiry ID": enq.id,
        "Customer Name": enq.name || "—",
        "Company / Studio": enq.company || "—",
        "Email Address": enq.email || "—",
        "Phone Number": enq.phone || "—",
        "City / Location": details.city || "—",
        "Enquiry Type": (enq.type || "GENERAL").replace(/_/g, " "),
        "Product Name / Products Added": productsSummary,
        "Message / Enquiry Details": enq.message || "—",
        "Page Source": enq.page_source || "Website",
        "Date and Time": formattedDate,
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 8 },
      { wch: 26 },
      { wch: 24 },
      { wch: 24 },
      { wch: 28 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 50 },
      { wch: 45 },
      { wch: 24 },
      { wch: 22 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Enquiries");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const today = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Disposition", `attachment; filename="Timex_Ceramic_Customer_Enquiries_${today}.xlsx"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (err) {
    console.error("Export enquiries error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/enquiries/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM enquiries WHERE id = ? LIMIT 1", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Enquiry not found." });
      }
      const item = rows[0];
      item.details = item.details_json ? JSON.parse(item.details_json) : {};
      return res.json({ success: true, enquiry: item });
    }

    const store = loadFallbackStore();
    const item = (store.enquiries || []).find((e) => e.id === id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }
    return res.json({ success: true, enquiry: item });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const { sendEnquiryEmails } = require("../services/email.service");
const { validateName, validatePhone, validateEmail, sanitizeText } = require("../utils/validation");

// In-memory rate limiting and duplicate submission tracking
const ipSubmissions = new Map();
const recentSubmissions = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAllowed = 12;

  let records = ipSubmissions.get(ip) || [];
  records = records.filter((t) => now - t < windowMs);
  ipSubmissions.set(ip, records);

  if (records.length >= maxAllowed) {
    return true;
  }
  records.push(now);
  return false;
}

function getDuplicateSubmission(name, phone, message) {
  const cleanKey = `${String(name).toLowerCase()}_${String(phone).replace(/\D/g, '')}_${String(message).slice(0, 30)}`.replace(/\s+/g, "");
  const now = Date.now();
  const existing = recentSubmissions.get(cleanKey);

  if (existing && now - existing.timestamp < 30000) { // 30 seconds
    return existing.id;
  }

  // Record this submission
  const newId = `inq-${now}-${crypto.randomBytes(3).toString("hex")}`;
  recentSubmissions.set(cleanKey, { timestamp: now, id: newId });

  // Cleanup old entries periodically
  if (recentSubmissions.size > 500) {
    for (const [k, v] of recentSubmissions.entries()) {
      if (now - v.timestamp > 60000) recentSubmissions.delete(k);
    }
  }

  return null;
}

// POST /api/v1/enquiries & /api/inquiry (Public submission from website forms & carts)
router.post("/", async (req, res) => {
  const { type, name, email, phone, company, message, page_source, pageSource, details, honeypot } = req.body;

  // 1. Anti-spam Honeypot Check
  if (honeypot) {
    return res.status(400).json({ success: false, error: "Spam bot submission blocked." });
  }

  // 2. IP Rate Limiting Check
  const clientIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: "Too many submission attempts. Please wait a few minutes before submitting again.",
    });
  }

  // 3. Strict Backend Field Validations
  const nameResult = validateName(name);
  if (!nameResult.valid) {
    return res.status(400).json({ success: false, error: nameResult.error });
  }

  const phoneResult = validatePhone(phone);
  if (!phoneResult.valid) {
    return res.status(400).json({ success: false, error: phoneResult.error });
  }

  // Email is optional on some forms (e.g. showroom booking or quick callbacks)
  // If provided, it must be strictly valid.
  const isEmailProvided = Boolean(email && String(email).trim());
  if (isEmailProvided) {
    const emailResult = validateEmail(email, true);
    if (!emailResult.valid) {
      return res.status(400).json({ success: false, error: emailResult.error });
    }
  }

  const cleanName = (name || "").trim();
  const cleanEmail = isEmailProvided ? (email || "").trim() : "";
  const cleanPhone = (phone || "").trim();
  const cleanCompany = (company || "").trim();
  const cleanMessage = sanitizeText(message || "", 3000);
  const source = page_source || pageSource || "Website Form";

  // 4. Duplicate Check (prevents accidental double clicks within 30 seconds)
  const existingDupId = getDuplicateSubmission(cleanName, cleanPhone, cleanMessage);
  if (existingDupId) {
    return res.status(200).json({
      success: true,
      message: "Enquiry already received. Our team will contact you shortly.",
      id: existingDupId,
      enquiryId: existingDupId,
      duplicate: true,
    });
  }

  const id = `inq-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
  const record = {
    id,
    type: (type || "GENERAL").toUpperCase(),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    company: cleanCompany,
    message: cleanMessage,
    status: "PENDING",
    page_source: source,
    pageSource: source,
    details: details || {},
    details_json: JSON.stringify(details || {}),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      await pool.query(
        `INSERT INTO enquiries (id, type, name, email, phone, company, message, status, page_source, details_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.type,
          record.name,
          record.email,
          record.phone,
          record.company,
          record.message,
          record.status,
          record.page_source,
          record.details_json,
        ]
      );
    } else {
      const store = loadFallbackStore();
      store.enquiries = [record, ...(store.enquiries || [])];
      saveFallbackStore(store);
    }

    // Send emails: Admin notification and Customer thank you confirmation
    let emailDelivery = null;
    try {
      emailDelivery = await sendEnquiryEmails(record);
      if (emailDelivery) {
        record.details = { ...(record.details || {}), email_delivery: emailDelivery };
        record.details_json = JSON.stringify(record.details);
        if (isMysqlConnected()) {
          try {
            const pool = getPool();
            await pool.query("UPDATE enquiries SET details_json = ? WHERE id = ?", [record.details_json, record.id]);
          } catch (dbErr) {
            console.warn("[DB] Could not update enquiry email delivery details:", dbErr.message);
          }
        } else {
          try {
            const store = loadFallbackStore();
            const target = (store.enquiries || []).find((e) => e.id === record.id);
            if (target) {
              target.details = record.details;
              target.details_json = record.details_json;
              saveFallbackStore(store);
            }
          } catch (storeErr) {
            console.warn("[Store] Could not update enquiry email delivery details:", storeErr.message);
          }
        }
      }
    } catch (mailErr) {
      console.error("[Email Notification Warning]", mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. Our team will contact you shortly.",
      id,
      enquiryId: id,
      emailDelivery,
    });
  } catch (err) {
    console.error("Submit enquiry error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/enquiries/:id/retry-email (Retry sending customer thank-you email)
router.post("/:id/retry-email", async (req, res) => {
  const { id } = req.params;
  try {
    let enquiry = null;
    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM enquiries WHERE id = ? LIMIT 1", [id]);
      if (rows.length > 0) {
        enquiry = rows[0];
        enquiry.details = enquiry.details_json ? JSON.parse(enquiry.details_json) : {};
      }
    } else {
      const store = loadFallbackStore();
      enquiry = (store.enquiries || []).find((e) => e.id === id);
    }

    if (!enquiry) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }

    const { retryCustomerEmail } = require("../services/email.service");
    const result = await retryCustomerEmail(enquiry);

    // Update delivery status in details
    const emailDelivery = enquiry.details?.email_delivery || {};
    emailDelivery.customer = {
      recipient: enquiry.email,
      status: result.success ? "SUCCESS" : "ERROR",
      method: result.method || "none",
      id: result.id || null,
      error: result.error || null,
      retried_at: new Date().toISOString(),
    };
    enquiry.details = { ...(enquiry.details || {}), email_delivery: emailDelivery };
    const detailsJson = JSON.stringify(enquiry.details);

    if (isMysqlConnected()) {
      const pool = getPool();
      await pool.query("UPDATE enquiries SET details_json = ? WHERE id = ?", [detailsJson, id]);
    } else {
      const store = loadFallbackStore();
      const target = (store.enquiries || []).find((e) => e.id === id);
      if (target) {
        target.details = enquiry.details;
        target.details_json = detailsJson;
        saveFallbackStore(store);
      }
    }

    return res.json({
      success: result.success,
      message: result.success ? "Customer thank-you email sent successfully." : `Failed: ${result.error}`,
      delivery: emailDelivery.customer,
    });
  } catch (err) {
    console.error("Retry email error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/enquiries/:id/status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED"];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  const normalizedStatus = status.toUpperCase();

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      const [result] = await pool.query(
        "UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?",
        [normalizedStatus, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Enquiry not found." });
      }
      return res.json({ success: true, status: normalizedStatus });
    }

    const store = loadFallbackStore();
    const idx = (store.enquiries || []).findIndex((e) => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }

    store.enquiries[idx].status = normalizedStatus;
    store.enquiries[idx].updated_at = new Date().toISOString();
    saveFallbackStore(store);

    return res.json({ success: true, status: normalizedStatus });
  } catch (err) {
    console.error("Update enquiry status error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/enquiries/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      const [result] = await pool.query("DELETE FROM enquiries WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Enquiry not found." });
      }
      return res.json({ success: true, message: "Enquiry deleted successfully." });
    }

    const store = loadFallbackStore();
    const initialLen = (store.enquiries || []).length;
    store.enquiries = (store.enquiries || []).filter((e) => e.id !== id);
    if (store.enquiries.length === initialLen) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }
    saveFallbackStore(store);
    return res.json({ success: true, message: "Enquiry deleted successfully." });
  } catch (err) {
    console.error("Delete enquiry error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
