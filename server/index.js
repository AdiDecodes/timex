const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.production") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");

const PORT = process.env.BACKEND_PORT || process.env.PORT || 5001;

// Resilient process-level error handlers preventing dev-server crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Backend Warning] Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[Backend Error] Uncaught Exception:", err);
});

// Only start the HTTP listener when executed directly (e.g. node server/index.js)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Timex Ceramic Backend Running on port ${PORT}`);
    console.log(` Health: http://localhost:${PORT}/api/v1/health`);
    console.log(` API Base: http://localhost:${PORT}/api/v1`);
    console.log(`=========================================`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[Backend Warning] Port ${PORT} already in use. Service may already be active.`);
    } else {
      console.error("[Backend Server Error]", err);
    }
  });
}

module.exports = app;
