const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false }
});

module.exports = { pool };
