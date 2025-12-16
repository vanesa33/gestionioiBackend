const { Pool } = require("pg");
const { db } = require("./config.js");
require("dotenv").config({ path: './.env' });

let pool;

if (process.env.DATABASE_URL) {
  // 🔹 Conexión en Render o entorno remoto
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log("✅ Conectado a la base de datos en Render");
  
} else {
  // 🔹 Conexión local (usando tu archivo config.js)
  pool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.PORT,
    database: db.database,
  });
  console.log("✅ Conectado a la base de datos local");
}

module.exports = { pool };
