import axios from 'axios';
import { config } from '../config';

class AuthService {
  constructor() {
    this.token = localStorage.getItem(config.TOKEN_KEY);
    this.user = JSON.parse(localStorage.getItem(config.USER_KEY));
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(config.TOKEN_KEY, token);
  }

  setUser(user) {
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
    return !!this.token;
  }

  isAdmin() {
    return this.user?.role === config.ROLES.ADMIN;
  }

  async login(email, password) {
    try {
      const response = await axios.post(config.API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Asegurarnos de que el rol esté en minúsculas
      if (user.role) {
        user.role = user.role.toLowerCase();
      }
      
      this.setToken(token);
      this.setUser(user);
      
      // Configurar el token por defecto para todas las peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(config.API_ENDPOINTS.REGISTER, userData);
      const { token, user } = response.data;
      
      // Asegurarnos de que el rol esté en minúsculas
      if (user.role) {
        user.role = user.role.toLowerCase();
      }
      
      this.setToken(token);
      this.setUser(user);
      
      // Configurar el token por defecto para todas las peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { token, user };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async verifyToken() {
    try {
      const response = await axios.get(config.API_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      
      const { user } = response.data;
      
      // Actualizar el usuario en caso de que haya cambios
      if (user) {
        this.setUser(user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
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
    return {
      Authorization: `Bearer ${this.token}`
    };
  }
}

export const authService = new AuthService(); 