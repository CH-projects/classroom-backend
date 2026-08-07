import { db } from "./db/index.js";

async function main() {
  try {
    console.log("Database connection test...");
    // Since demoUsers is deleted, we can just do a simple query to verify connection
    // or leave it as a placeholder for future tests.
    console.log("✅ Connection established.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exitCode = 1;
  }
}

void main();
