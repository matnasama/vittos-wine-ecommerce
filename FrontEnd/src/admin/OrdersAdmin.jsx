import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    Card,
    CardContent,
    Divider,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { config } from "../config";
import { useNavigate } from "react-router-dom";

const OrdersAdmin = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem(config.TOKEN_KEY);
            
            if (!token) {
                setError("No hay sesión activa. Por favor, inicie sesión.");
                navigate("/login");
                return;
            }

            const response = await axios.get(config.API_ENDPOINTS.ADMIN_PEDIDOS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            // Asegurarse de que cada pedido tenga un array de productos
            const pedidosProcesados = response.data.map(pedido => ({
                ...pedido,
                productos: pedido.productos || []
            }));
            
            setPedidos(pedidosProcesados);
            setError(null);
        } catch (err) {
            console.error("Error al obtener pedidos:", err);
            if (err.response?.status === 403) {
                setError("No tiene permisos para acceder a esta sección.");
                navigate("/");
            } else if (err.response?.status === 401) {
                setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
                localStorage.removeItem(config.TOKEN_KEY);
                localStorage.removeItem(config.USER_KEY);
                navigate("/login");
            } else {
                setError("Error al cargar los pedidos. Por favor, intente nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem(config.USER_KEY));
        if (!user || user.rol !== "admin") {
            navigate("/");
            return;
        }
        fetchPedidos();
    }, [navigate]);

    const handleEstadoChange = async (pedidoId, nuevoEstado) => {
        try {
            const token = localStorage.getItem(config.TOKEN_KEY);
            await axios.put(
                `${config.API_ENDPOINTS.ADMIN_PEDIDOS}/${pedidoId}`,
                { estado: nuevoEstado },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            await fetchPedidos();
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            if (err.response?.status === 401) {
                setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
                localStorage.removeItem(config.TOKEN_KEY);
                localStorage.removeItem(config.USER_KEY);
                navigate("/login");
            } else {
                setError("Error al actualizar el estado del pedido.");
            }
        }
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
            locale: es
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        }).format(amount);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Gestión de Pedidos
            </Typography>
            <Grid container spacing={3}>
                {pedidos.map((pedido) => (
                    <Grid item xs={12} key={pedido.id}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" gutterBottom>
                                            Pedido #{pedido.id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {formatDate(pedido.fecha)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={pedido.estado}
                                                onChange={(e) =>
                                                    handleEstadoChange(pedido.id, e.target.value)
                                                }
                                            >
                                                <MenuItem value="pendiente">Pendiente</MenuItem>
                                                <MenuItem value="entregado">Entregado</MenuItem>
                                                <MenuItem value="cancelado">Cancelado</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Información del Cliente
                                        </Typography>
                                        <Typography variant="body2">
                                            {pedido.usuario_nombre}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {pedido.usuario_email}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {pedido.usuario_telefono}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {pedido.usuario_direccion}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Productos
                                        </Typography>
                                        {pedido.productos && pedido.productos.map((producto) => (
                                            <Box key={producto.id} mb={1}>
                                                <Typography variant="body2">
                                                    {producto.marca} - {producto.nombre} x {producto.cantidad}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {formatCurrency(producto.precio)} c/u
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6">
                                                Total: {formatCurrency(pedido.total)}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEstadoChange(pedido.id, "entregado")}
                                            >
                                                Marcar como Entregado
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default OrdersAdmin;