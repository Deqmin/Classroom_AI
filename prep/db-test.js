require("dotenv").config({ path: "../api/.env" });

const { Pool } = require("pg");

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Create api/.env from api/.env.example first.");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
  });

  const result = await pool.query("SELECT NOW() AS now");
  console.log("DB time:", result.rows[0].now);
  await pool.end();
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
