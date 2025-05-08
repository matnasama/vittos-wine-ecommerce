import { useQuery } from '@tanstack/react-query';

const API_URL = 'http://localhost:4000/api';

// Función para obtener productos
const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/productos`);
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
  const response = await fetch(`${API_URL}/pedidos`, {
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