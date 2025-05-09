const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const config = {
    API_URL,
    API_ENDPOINTS: {
        LOGIN: `${API_URL}/api/login`,
        REGISTER: `${API_URL}/api/register`,
        PRODUCTOS: `${API_URL}/api/productos`,
        PEDIDOS: `${API_URL}/api/pedidos`,
        USUARIOS: `${API_URL}/api/usuarios`,
        MIS_PEDIDOS: `${API_URL}/api/mis-pedidos`,
    }
}; 