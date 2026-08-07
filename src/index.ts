async function main() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    const { sql } = await import("./db/index.js");

    console.log("Database connection test...");
    await sql`SELECT 1`;
    console.log("✅ Connection established.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exitCode = 1;
  }
}

void main();
