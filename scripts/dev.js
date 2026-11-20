/**
 * scripts/dev.js
 * Unified development runner for Timex Ceramic
 * Starts Express Backend API (port 5001) and Next.js Frontend Dev Server (port 3000)
 * Includes memory optimization and error resilience
 */

const { spawn } = require("child_process");
const path = require("path");

console.log("==================================================");
console.log("  Starting Timex Ceramic (Fullstack Dev Mode)");
console.log("  Frontend: http://localhost:3000");
console.log("  Admin:    http://localhost:3000/admin");
console.log("  API:      http://localhost:5001/api/v1");
console.log("==================================================");

const rootDir = path.resolve(__dirname, "..");

// Configure expanded Node memory to prevent heap exhaustion during HMR
const maxMemoryOptions = "--max-old-space-size=4096";
const baseNodeOptions = process.env.NODE_OPTIONS || "";
const memoryNodeOptions = baseNodeOptions.includes("max-old-space-size")
  ? baseNodeOptions
  : `${baseNodeOptions} ${maxMemoryOptions}`.trim();

// 1. Start Express Backend API on port 5001
const serverEnv = {
  ...process.env,
  PORT: "5001",
  NODE_OPTIONS: memoryNodeOptions,
};

let serverProcess = spawn(
  process.execPath,
  [path.join(rootDir, "server/index.js")],
  {
    stdio: "inherit",
    shell: false,
    cwd: rootDir,
    env: serverEnv,
  }
);

serverProcess.on("error", (err) => {
  console.error("[Backend Process Error]", err);
});

serverProcess.on("exit", (code, signal) => {
  if (signal === "SIGINT" || signal === "SIGTERM") return;
  console.warn(`[Backend Notice] Express API exited with code ${code}.`);
});

// 2. Start Next.js Development Server on port 3000
const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
const nextEnv = {
  ...process.env,
  NODE_OPTIONS: memoryNodeOptions,
};
delete nextEnv.PORT;

const nextProcess = spawn(
  process.execPath,
  [nextBin, "dev", "--webpack", "-p", "3000"],
  {
    stdio: "inherit",
    shell: false,
    cwd: rootDir,
    env: nextEnv,
  }
);

nextProcess.on("error", (err) => {
  console.error("[Next.js Process Error]", err);
});

nextProcess.on("exit", (code, signal) => {
  if (signal === "SIGINT" || signal === "SIGTERM") return;
  console.warn(`[Next.js Notice] Development server exited with code ${code}.`);
});

let isShuttingDown = false;
function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("\nShutting down Timex Ceramic development servers...");
  try {
    serverProcess.kill();
  } catch {}
  try {
    nextProcess.kill();
  } catch {}
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
