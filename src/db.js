const { Pool } = require("pg");
require("dotenv").config({ path: "./.env" });

let pool;

if (process.env.DATABASE_URL) {
  // 🔹 Supabase / producción
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log("✅ DB Supabase");
} else {
  // 🔹 Local
  const { db } = require("./config.js");

  pool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.PORT,
    database: db.database,
  });
  console.log("✅ DB Local");
}

module.exports = { pool };
