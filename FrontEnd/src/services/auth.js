import axios from 'axios';
import { config } from '../config';

class AuthService {
  constructor() {
    try {
      this.token = localStorage.getItem(config.TOKEN_KEY) || null;
      const storedUser = localStorage.getItem(config.USER_KEY);
      this.user = storedUser ? JSON.parse(storedUser) : null;
      
      // Configurar el token por defecto si existe
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    } catch (error) {
      console.error('Error al inicializar AuthService:', error);
      this.token = null;
      this.user = null;
      localStorage.removeItem(config.TOKEN_KEY);
      localStorage.removeItem(config.USER_KEY);
    }
  }

  setToken(token) {
    if (!token) {
      this.token = null;
      localStorage.removeItem(config.TOKEN_KEY);
      delete axios.defaults.headers.common['Authorization'];
      return;
    }
    
    this.token = token;
    localStorage.setItem(config.TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUser(user) {
    if (!user) {
      this.user = null;
      localStorage.removeItem(config.USER_KEY);
      return;
    }

    // Asegurarse de que el rol esté en minúsculas
    if (user.rol) {
      user.rol = user.rol.toLowerCase();
    }
    
    this.user = user;
    try {
      localStorage.setItem(config.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error al guardar usuario en localStorage:', error);
    }
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  isAdmin() {
    return this.user?.rol?.toLowerCase() === 'admin';
  }

  async login(email, password) {
    try {
      // Limpiar headers antes de intentar login
      delete axios.defaults.headers.common['Authorization'];
      
      const response = await axios.post(config.API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      if (!response.data || !response.data.token || !response.data.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }

      const { token, usuario } = response.data;
      
      // Verificar que el usuario tenga un rol válido
      if (!usuario.rol) {
        throw new Error('Usuario sin rol definido');
      }

      // Asegurarse de que el rol esté en minúsculas
      usuario.rol = usuario.rol.toLowerCase();

      this.setToken(token);
      this.setUser(usuario);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      this.logout();
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(config.API_ENDPOINTS.REGISTER, userData);
      const { token, usuario } = response.data;
      this.setToken(token);
      this.setUser(usuario);
      
      return { token, usuario };
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async verifyToken() {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (!token) {
      throw new Error('No token available');
    }

    try {
      const response = await axios.get(config.API_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.usuario) {
        this.setToken(token);
        this.setUser(response.data.usuario);
        return response.data;
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('Endpoint no encontrado. Verificar configuración de API.');
      }
      this.logout();
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem(config.TOKEN_KEY);
    localStorage.removeItem(config.USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  getAuthHeader() {
    return this.token ? {
      Authorization: `Bearer ${this.token}`
    } : {};
  }
}

export const authService = new AuthService(); 