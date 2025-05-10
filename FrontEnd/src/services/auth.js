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
    if (user && user.role) {
      user.role = user.role.toLowerCase();
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
    return this.user?.rol?.toLowerCase() === config.ROLES.ADMIN;
  }

  async login(email, password) {
    try {
      const response = await axios.post(config.API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;
      this.setToken(token);
      this.setUser(user);
      
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      this.logout();
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(config.API_ENDPOINTS.REGISTER, userData);
      const { token, user } = response.data;
      this.setToken(token);
      this.setUser(user);
      
      return { token, user };
    } catch (error) {
      console.error('Register error:', error);
      this.logout();
      throw error;
    }
  }

  async verifyToken() {
    if (!this.token) {
      throw new Error('No token available');
    }

    try {
      const response = await axios.get(config.API_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      
      const { user } = response.data;
      
      if (user) {
        this.setUser(user);
      } else {
        throw new Error('Invalid user data');
      }
      
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      if (error.response?.status === 404) {
        console.error('Endpoint not found. Please check the API configuration.');
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