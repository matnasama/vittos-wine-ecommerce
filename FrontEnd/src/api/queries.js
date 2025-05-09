import { useQuery } from '@tanstack/react-query';
import { config } from '../config';

// Función para obtener productos
const fetchProducts = async () => {
  const response = await fetch(config.API_ENDPOINTS.PRODUCTOS);
  if (!response.ok) {
    throw new Error('Error al cargar productos');
  }
  return response.json();
};

// Hook para obtener productos
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
};

// Función para obtener pedidos
const fetchOrders = async () => {
  const response = await fetch(config.API_ENDPOINTS.PEDIDOS, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Error al cargar pedidos');
  }
  return response.json();
};

// Hook para obtener pedidos
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('token'),
  });
}; 