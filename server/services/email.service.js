const { Resend } = require("resend");
const nodemailer = require("nodemailer");

function getAdminEmail() {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.ENQUIRY_EMAIL ||
    process.env.RECIPIENT_EMAIL ||
    "info@timexceramic.com"
  );
}

function getFromEmail() {
  if (process.env.SMTP_FROM_EMAIL) return process.env.SMTP_FROM_EMAIL;
  if (process.env.SMTP_USER) return `"Timex Ceramic" <${process.env.SMTP_USER}>`;
  if (process.env.RESEND_FROM_EMAIL) return process.env.RESEND_FROM_EMAIL;
  return "Timex Ceramic <info@timexceramic.com>";
}

const TIMEX_PUBLIC_EMAIL = "info@timexceramic.com";
const TIMEX_PHONE = "+91 22 2612 2960";
const TIMEX_WHATSAPP = "+91 93237 77787";
const TIMEX_WEBSITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.timexceramic.com";

/**
 * Format products into an array of clean product items
 */
function extractProducts(enquiry) {
  const details = enquiry.details || {};
  if (Array.isArray(details.products) && details.products.length > 0) {
    return details.products.map((p, idx) => ({
      index: idx + 1,
      name: p.name || `Product ${idx + 1}`,
      code: p.code || "—",
      size: p.size || "Standard",
      finish: p.finish || "—",
      quantity: p.quantity || 1,
      url: p.productUrl || (p.slug ? `${TIMEX_WEBSITE}/product/${p.slug}` : ""),
    }));
  }

  if (details.productName || enquiry.productName || details.productId) {
    const name = details.productName || enquiry.productName || "Tile Product";
    const code = details.productCode || enquiry.productCode || "";
    const size = details.size || enquiry.size || "Standard";
    const finish = details.finish || enquiry.finish || "";
    const slug = details.slug || enquiry.slug || "";
    const url = details.productUrl || (slug ? `${TIMEX_WEBSITE}/product/${slug}` : "");

    return [
      {
        index: 1,
        name,
        code: code || "—",
        size: size || "Standard",
        finish: finish || "—",
        quantity: details.quantity || 1,
        url,
      },
    ];
  }

  return [];
}

/**
 * Build HTML for Admin Notification Email
 */
function buildAdminHtml(enquiry, products) {
  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const details = enquiry.details || {};
  const origin = enquiry.page_source || enquiry.pageSource || "Timex Ceramic Website";

  // Build Extra Details rows
  const extraRows = [];

  if (details.preferredVisitDate || details.visitDate) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 35%;">Preferred Visit Date:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 700;">${details.preferredVisitDate || details.visitDate}</td>
      </tr>
    `);
  }
  if (details.preferredTimeSlot || details.timeSlot) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Preferred Time Slot:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 700;">${details.preferredTimeSlot || details.timeSlot}</td>
      </tr>
    `);
  }
  if (details.profile) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Customer Profile (You are a):</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 600;">${details.profile}</td>
      </tr>
    `);
  }
  if (Array.isArray(details.lookingFor) && details.lookingFor.length > 0) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Looking For Categories:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 600;">${details.lookingFor.join(", ")}</td>
      </tr>
    `);
  }
  if (details.projectType) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Project Type:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 600;">${details.projectType}</td>
      </tr>
    `);
  }
  if (details.preferredTileCategory) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Preferred Tile Category:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 600;">${details.preferredTileCategory}</td>
      </tr>
    `);
  }
  if (details.projectLocation) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Project Location:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 600;">${details.projectLocation}</td>
      </tr>
    `);
  }
  if (details.resourceTitle) {
    extraRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Requested Resource:</td>
        <td style="padding: 8px 0; color: #0A1931; font-weight: 700;">${details.resourceTitle}</td>
      </tr>
    `);
  }

  const productsTableHtml =
    products.length > 0
      ? `
        <div style="margin-top: 24px;">
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #C95745; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">
            Selected Tile Products (${products.length})
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #101B38; color: #ffffff;">
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">#</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Code</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Size</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Finish</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Link</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (p) => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px; color: #64748b; font-weight: bold;">${p.index}</td>
                  <td style="padding: 10px; font-weight: 600; color: #101B38;">${p.name}</td>
                  <td style="padding: 10px; color: #475569;"><code style="background:#f1f5f9; padding:2px 6px; border-radius:3px;">${p.code}</code></td>
                  <td style="padding: 10px; color: #475569;">${p.size}</td>
                  <td style="padding: 10px; color: #475569;">${p.finish}</td>
                  <td style="padding: 10px; font-weight: 600; color: #101B38;">${p.quantity} Box(es)</td>
                  <td style="padding: 10px;">
                    ${
                      p.url
                        ? `<a href="${p.url}" target="_blank" style="color: #C95745; text-decoration: underline; font-size: 12px;">View Tile &rarr;</a>`
                        : "—"
                    }
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
      : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Website Enquiry - Timex Ceramic</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937;">
      <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #101B38; padding: 26px 32px; text-align: center; border-bottom: 3px solid #C95745;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px;">TIMEX CERAMIC</h1>
          <p style="color: #EDEAE4; margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px;">New Customer Enquiry</p>
        </div>

        <div style="padding: 32px;">
          <!-- Badges -->
          <div style="margin-bottom: 24px;">
            <span style="background-color: #f1f5f9; color: #101B38; font-weight: 700; font-size: 11px; padding: 6px 14px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #cbd5e1;">
              REF: ${enquiry.id}
            </span>
            <span style="background-color: #ecfdf5; color: #047857; font-weight: 700; font-size: 11px; padding: 6px 14px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-left: 8px; border: 1px solid #a7f3d0;">
              ${(enquiry.type || "GENERAL").replace(/_/g, " ")}
            </span>
          </div>

          <!-- Customer Info -->
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #C95745; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">
            Customer &amp; Submission Details
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 35%;">Customer Name:</td>
              <td style="padding: 8px 0; color: #101B38; font-weight: 700;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Mobile Number:</td>
              <td style="padding: 8px 0; color: #101B38; font-weight: 700;">
                <a href="tel:${enquiry.phone.replace(/\s+/g, '')}" style="color: #101B38; text-decoration: none;">${enquiry.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Email Address:</td>
              <td style="padding: 8px 0; color: #101B38; font-weight: 600;">
                ${
                  enquiry.email && !enquiry.email.startsWith("expert.")
                    ? `<a href="mailto:${enquiry.email}" style="color: #C95745; text-decoration: none;">${enquiry.email}</a>`
                    : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'
                }
              </td>
            </tr>
            ${
              enquiry.company
                ? `<tr><td style="padding: 8px 0; color: #64748b;">Company / Studio:</td><td style="padding: 8px 0; color: #101B38; font-weight: 600;">${enquiry.company}</td></tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Form Name / Source:</td>
              <td style="padding: 8px 0; color: #101B38; font-weight: 600;">${origin}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Submission Time:</td>
              <td style="padding: 8px 0; color: #475569;">${timestamp} (IST)</td>
            </tr>
            ${extraRows.join("")}
          </table>

          <!-- Message Box -->
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #C95745; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">
            Enquiry Message / Project Notes
          </div>
          <div style="background-color: #f8fafc; border-left: 3px solid #C95745; padding: 14px 16px; font-size: 13.5px; color: #334155; line-height: 1.6; border-radius: 3px; white-space: pre-wrap;">${
            enquiry.message || "No additional message submitted."
          }</div>

          <!-- Products Table -->
          ${productsTableHtml}

          <!-- Quick Action CTA -->
          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <a href="tel:${enquiry.phone.replace(/\s+/g, '')}" style="display: inline-block; background-color: #101B38; color: #ffffff; padding: 10px 22px; border-radius: 3px; font-size: 12px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; margin-right: 8px;">
              Call Customer
            </a>
            ${
              enquiry.email && !enquiry.email.startsWith("expert.")
                ? `<a href="mailto:${enquiry.email}?subject=Regarding your enquiry with Timex Ceramic (${enquiry.id})" style="display: inline-block; background-color: #C95745; color: #ffffff; padding: 10px 22px; border-radius: 3px; font-size: 12px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Reply via Email</a>`
                : ""
            }
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e5e7eb;">
          Automated enquiry notification from <strong>Timex Ceramic</strong>.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Build HTML for Customer Thank You Email
 * Uses the exact requested copy and professional Timex Ceramic branding.
 */
function buildCustomerHtml(enquiry, products) {
  const details = enquiry.details || {};

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Contacting Timex Ceramic</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #101B38; padding: 28px 32px; text-align: center; border-bottom: 3px solid #C95745;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px;">TIMEX CERAMIC</h1>
          <p style="color: #EDEAE4; margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px;">World-Class Tiles for Inspiring Spaces</p>
        </div>

        <div style="padding: 32px;">
          <!-- Standard Content required by User -->
          <p style="font-size: 15px; line-height: 1.6; color: #101B38; font-weight: 600; margin: 0 0 16px 0;">
            Hello ${enquiry.name},
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 14px 0;">
            Thank you for contacting Timex Ceramic.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 14px 0;">
            We have successfully received your enquiry. Our team will review your requirements and get in touch with you shortly.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">
            We appreciate your interest in Timex Ceramic and look forward to assisting you.
          </p>

          <!-- Reference Box -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px 16px; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Enquiry Reference ID:</div>
            <div style="font-size: 15px; font-weight: 700; color: #101B38; font-family: monospace; margin-top: 3px;">${enquiry.id}</div>
          </div>

          <!-- Regards & Company Signature -->
          <p style="font-size: 14px; line-height: 1.6; color: #101B38; font-weight: 600; margin: 24px 0 6px 0;">
            Best Regards,<br>
            Team Timex Ceramic
          </p>

          <div style="font-size: 12.5px; color: #64748b; line-height: 1.6; margin-top: 14px; border-top: 1px solid #e5e7eb; padding-top: 14px;">
            <strong style="color: #101B38;">Timex Ceramic</strong> | Chandan Exports<br>
            402 Pratik Avenue, Opp. Shiv Sagar Restaurant, Nehru Road, Vile Parle (E), Mumbai – 400 057, India<br>
            <strong>Phone:</strong> <a href="tel:+912226122960" style="color: #101B38; text-decoration: none;">+91 22 2612 2960</a><br>
            <strong>Email:</strong> <a href="mailto:info@timexceramic.com" style="color: #C95745; text-decoration: none;">info@timexceramic.com</a><br>
            <strong>Website:</strong> <a href="https://www.timexceramic.com" style="color: #101B38; text-decoration: none;">www.timexceramic.com</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #101B38; padding: 16px 32px; text-align: center; font-size: 11px; color: #EDEAE4; border-top: 1px solid #1e293b;">
          &copy; ${new Date().getFullYear()} Timex Ceramic. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Dispatch an email through configured transports:
 * 1. Nodemailer SMTP (Primary when credentials configured in environment)
 * 2. Resend API (Secondary or when SMTP not provided)
 */
async function sendRawMail({ to, from, replyTo, subject, html, text }) {
  let lastError = null;

  // 1. Nodemailer SMTP (Direct delivery to any recipient with no domain restrictions)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // Fast connection timeout to avoid hanging if host is unreachable
        connectionTimeout: 8000,
        greetingTimeout: 5000,
      });

      const info = await transporter.sendMail({
        from: from || getFromEmail(),
        to,
        replyTo: replyTo || undefined,
        subject,
        html,
        text,
      });

      return { success: true, method: "SMTP", id: info.messageId };
    } catch (smtpErr) {
      lastError = smtpErr.message;
      console.warn(`[SMTP Error for ${to}]`, smtpErr.message);
    }
  }

  // 2. Resend API (when key configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddr = from || process.env.RESEND_FROM_EMAIL || "Timex Ceramic <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from: fromAddr,
        to: Array.isArray(to) ? to : [to],
        replyTo: replyTo || undefined,
        subject,
        html,
        text,
      });

      if (result.data && result.data.id) {
        return { success: true, method: "Resend", id: result.data.id };
      }

      if (result.error) {
        lastError = result.error.message || JSON.stringify(result.error);
        if (result.error.statusCode === 403 || result.error.name === "validation_error") {
          console.warn(`[Resend Sandbox Notice for ${to}]: ${result.error.message}. To send customer emails via Resend, verify your domain at resend.com/domains or configure SMTP credentials.`);
        } else {
          console.warn(`[Resend Notice for ${to}]`, result.error.message || result.error);
        }
      }
    } catch (err) {
      lastError = err.message;
      console.warn(`[Resend Error for ${to}]`, err.message);
    }
  }

  return {
    success: false,
    error: lastError || "No email transport configured (set SMTP credentials or RESEND_API_KEY in environment)",
  };
}

/**
 * Main service method: Send Admin Notification AND Customer Thank You Email
 */
async function sendEnquiryEmails(enquiry) {
  const products = extractProducts(enquiry);
  const adminRecipient = getAdminEmail();
  const trimmedCustomerEmail = (enquiry.email || "").trim();

  const results = {
    admin: { status: "PENDING", recipient: adminRecipient },
    customer: { status: "SKIPPED", recipient: trimmedCustomerEmail || "none" },
  };

  console.log(`\n==================================================`);
  console.log(`[EMAIL DISPATCH] Enquiry ID: ${enquiry.id}`);
  console.log(`Customer: ${enquiry.name} <${trimmedCustomerEmail || "no-email"}>`);
  console.log(`Type: ${enquiry.type}`);
  console.log(`--------------------------------------------------`);

  // 1. Admin Notification Email
  const formName = enquiry.page_source || enquiry.pageSource || "Website Form";
  const adminSubject = `[Timex Ceramic Enquiry] ${enquiry.name} - ${formName} (#${enquiry.id})`;
  const adminHtml = buildAdminHtml(enquiry, products);
  const adminText = `New Enquiry #${enquiry.id}\nCustomer: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email || "Not provided"}\nForm: ${formName}\nMessage: ${enquiry.message}`;

  try {
    console.log(`[EMAIL][ADMIN] Sending notification to ${adminRecipient}...`);
    const adminRes = await sendRawMail({
      to: adminRecipient,
      replyTo: (trimmedCustomerEmail && !trimmedCustomerEmail.startsWith("expert.") && !trimmedCustomerEmail.startsWith("visit.")) ? trimmedCustomerEmail : undefined,
      subject: adminSubject,
      html: adminHtml,
      text: adminText,
    });
    results.admin = {
      recipient: adminRecipient,
      status: adminRes.success ? "SUCCESS" : "ERROR",
      method: adminRes.method || "none",
      id: adminRes.id || null,
      error: adminRes.error || null,
    };
    if (adminRes.success) {
      console.log(`[EMAIL][ADMIN] SUCCESS -> Delivered to ${adminRecipient} via ${adminRes.method} (ID: ${adminRes.id})`);
    } else {
      console.warn(`[EMAIL][ADMIN] FAILED -> Could not deliver to ${adminRecipient}: ${adminRes.error}`);
    }
  } catch (err) {
    results.admin = { recipient: adminRecipient, status: "ERROR", error: err.message };
    console.warn(`[EMAIL][ADMIN] Exception: ${err.message}`);
  }

  // 2. Customer Thank You Email
  // Send ONLY if customer provided a valid non-empty email address
  const hasValidCustomerEmail =
    Boolean(trimmedCustomerEmail) &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(trimmedCustomerEmail) &&
    !trimmedCustomerEmail.startsWith("expert.") &&
    !trimmedCustomerEmail.startsWith("visit.");

  if (hasValidCustomerEmail) {
    const customerSubject = "Thank You for Contacting Timex Ceramic";
    const customerHtml = buildCustomerHtml(enquiry, products);
    const customerText = `Hello ${enquiry.name},

Thank you for contacting Timex Ceramic.

We have successfully received your enquiry. Our team will review your requirements and get in touch with you shortly.

We appreciate your interest in Timex Ceramic and look forward to assisting you.

Best Regards,
Team Timex Ceramic

Timex Ceramic | Chandan Exports
402 Pratik Avenue, Opp. Shiv Sagar Restaurant, Nehru Road, Vile Parle (E), Mumbai – 400 057, India
Phone: +91 22 2612 2960
Email: info@timexceramic.com
Website: www.timexceramic.com`;

    try {
      console.log(`[EMAIL][CUSTOMER] Sending thank-you email to ${trimmedCustomerEmail}...`);
      const customerRes = await sendRawMail({
        to: trimmedCustomerEmail,
        replyTo: TIMEX_PUBLIC_EMAIL,
        subject: customerSubject,
        html: customerHtml,
        text: customerText,
      });
      results.customer = {
        recipient: trimmedCustomerEmail,
        status: customerRes.success ? "SUCCESS" : "ERROR",
        method: customerRes.method || "none",
        id: customerRes.id || null,
        error: customerRes.error || null,
      };
      if (customerRes.success) {
        console.log(`[EMAIL][CUSTOMER] SUCCESS -> Delivered to ${trimmedCustomerEmail} via ${customerRes.method} (ID: ${customerRes.id})`);
      } else {
        console.warn(`[EMAIL][CUSTOMER] FAILED -> Could not deliver to ${trimmedCustomerEmail}: ${customerRes.error}`);
      }
    } catch (err) {
      results.customer = { recipient: trimmedCustomerEmail, status: "ERROR", error: err.message };
      console.warn(`[EMAIL][CUSTOMER] Exception: ${err.message}`);
    }
  } else {
    console.log(`[EMAIL][CUSTOMER] SKIPPED (No valid customer email address provided)`);
  }

  console.log(`==================================================\n`);
  return results;
}

/**
 * Retry helper for customer thank-you email
 */
async function retryCustomerEmail(enquiry) {
  const trimmed = (enquiry.email || "").trim();
  if (!trimmed) {
    return { success: false, error: "No email address found on enquiry record." };
  }
  const products = extractProducts(enquiry);
  const customerSubject = "Thank You for Contacting Timex Ceramic";
  const customerHtml = buildCustomerHtml(enquiry, products);
  const customerText = `Hello ${enquiry.name},\n\nThank you for contacting Timex Ceramic.\n\nWe have successfully received your enquiry. Our team will review your requirements and get in touch with you shortly.\n\nWe appreciate your interest in Timex Ceramic and look forward to assisting you.\n\nBest Regards,\nTeam Timex Ceramic`;

  return await sendRawMail({
    to: trimmed,
    replyTo: TIMEX_PUBLIC_EMAIL,
    subject: customerSubject,
    html: customerHtml,
    text: customerText,
  });
}

module.exports = {
  getAdminEmail,
  getFromEmail,
  TIMEX_PUBLIC_EMAIL,
  sendEnquiryEmails,
  retryCustomerEmail,
};
