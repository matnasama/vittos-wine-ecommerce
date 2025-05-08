// database.js
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.getConnectionConfig());

// Verificar la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    console.error('Detalles de la conexión:', config.getConnectionConfig());
  } else {
    console.log('Conexión exitosa a la base de datos');
    release();
  }
});

function getConnection() {
  return pool;
}

module.exports = { getConnection };
