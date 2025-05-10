import axios from 'axios';
import { config } from '../config';

class AuthService {
  constructor() {
    this.token = localStorage.getItem(config.TOKEN_KEY);
    this.user = JSON.parse(localStorage.getItem(config.USER_KEY));
    
    // Configurar el token por defecto si existe
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(config.TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUser(user) {
    if (user && user.rol) {
      user.rol = user.rol.toLowerCase();
    }
    this.user = user;
    localStorage.setItem(config.USER_KEY, JSON.stringify(user));
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
      const response = await axios.post(config.API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      const { token, usuario } = response.data;
      this.setToken(token);
      this.setUser(usuario);
      
      return { token, usuario };
    } catch (error) {
      console.error('Error en login:', error);
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
      console.error('Error en registro:', error);
      this.logout();
      throw error;
    }
  }

  async verifyToken() {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (!token) {
      console.log('No hay token disponible');
      throw new Error('No token available');
    }

    try {
      console.log('Enviando petición de verificación al backend...');
      const response = await axios.get(config.API_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Respuesta del backend:', response.data);
      
      if (response.data && response.data.usuario) {
        console.log('Usuario encontrado:', response.data.usuario);
        this.setToken(token);
        this.setUser(response.data.usuario);
        return response.data;
      } else {
        console.log('No se encontró información del usuario en la respuesta');
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error('Error en verificación de token:', error);
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