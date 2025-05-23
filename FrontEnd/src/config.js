// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://vittos-wine-backend.onrender.com';

export const config = {
    API_URL,
    API_ENDPOINTS: {
        LOGIN: `${API_URL}/api/login`,
        REGISTER: `${API_URL}/api/register`,
        PRODUCTOS: `${API_URL}/api/productos`,
        PEDIDOS: `${API_URL}/api/pedidos`,
        USUARIOS: `${API_URL}/api/usuarios`,
        MIS_PEDIDOS: `${API_URL}/api/pedidos/mis-pedidos`,
        VERIFY_TOKEN: `${API_URL}/api/usuarios/verify-token`,
        // Endpoints del panel de administrador
        ADMIN_STATS: `${API_URL}/api/admin/stats`,
        ADMIN_PRODUCTOS: `${API_URL}/api/admin/productos`,
        ADMIN_PEDIDOS: `${API_URL}/api/admin/pedidos`,
        ADMIN_USUARIOS: `${API_URL}/api/admin/usuarios`,
    },
    TOKEN_KEY: 'vittos_token',
    USER_KEY: 'vittos_user',
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    ROLES: {
        ADMIN: 'admin',
        USER: 'user'
    }
}; 