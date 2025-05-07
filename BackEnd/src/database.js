// database.js
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificar la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    console.error('Detalles de la conexión:', {
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      port: process.env.PGPORT
    });
  } else {
    console.log('Conexión exitosa a la base de datos');
    release();
  }
});

function getConnection() {
  return pool;
}

module.exports = { getConnection };
