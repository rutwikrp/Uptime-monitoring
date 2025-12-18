const { Pool } = require("pg");



// pool.on("connect", () => {
//   console.log("✅ Connected to PostgreSQL");
// });

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

module.exports = { getPool };