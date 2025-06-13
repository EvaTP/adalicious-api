// 1. Le code importé par NEON pour configurer la BDD créée :
require("dotenv").config();

// 2. Importer le client PostgreSQL
const { Pool } = require("pg");


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

