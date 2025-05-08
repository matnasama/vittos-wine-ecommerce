require('dotenv').config();

const config = {
    // Configuración de la base de datos
    database: {
        // Conexión remota (Neon)
        remote: {
            connectionString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`,
            ssl: {
                rejectUnauthorized: false
            }
        },
        // Conexión local
        local: {
            host: process.env.LOCAL_PGHOST || 'localhost',
            port: process.env.LOCAL_PGPORT || 5432,
            database: process.env.LOCAL_PGDATABASE || 'vittos_wine_db',
            user: process.env.LOCAL_PGUSER || 'postgres',
            password: process.env.LOCAL_PGPASSWORD || 'postgres'
        }
    },
    // Determinar qué conexión usar basado en el entorno
    getConnectionConfig: () => {
        // Si estamos en desarrollo y la variable de entorno DB_MODE es 'local', usar conexión local
        if (process.env.NODE_ENV === 'development' && process.env.DB_MODE === 'local') {
            return config.database.local;
        }
        // En cualquier otro caso, usar la conexión remota
        return config.database.remote;
    }
};

module.exports = config; 