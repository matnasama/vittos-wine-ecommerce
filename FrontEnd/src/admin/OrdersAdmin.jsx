import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel
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

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                setError("No hay sesión activa. Por favor, inicie sesión.");
                navigate("/login");
                return;
            }

            const response = await axios.get(`${config.API_URL}/api/pedidos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            setPedidos(response.data);
            setError(null);
        } catch (err) {
            console.error("Error al obtener pedidos:", err);
            if (err.response?.status === 403) {
                setError("No tiene permisos para acceder a esta sección.");
                navigate("/");
            } else if (err.response?.status === 401) {
                setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                setError("Error al cargar los pedidos. Por favor, intente nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.rol !== "admin") {
            navigate("/");
            return;
        }
        fetchPedidos();
    }, [navigate]);

    const handleEstadoChange = async (pedidoId, nuevoEstado) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${config.API_URL}/api/pedidos/${pedidoId}`,
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
                localStorage.removeItem("token");
                localStorage.removeItem("user");
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Productos</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos.map((pedido) => (
                            <TableRow key={pedido.id}>
                                <TableCell>{pedido.id}</TableCell>
                                <TableCell>{formatDate(pedido.fecha)}</TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell>
                                    {pedido.productos.map((producto) => (
                                        <Box key={producto.id} mb={1}>
                                            <Typography variant="body2">
                                                {producto.nombre} x {producto.cantidad}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {formatCurrency(producto.precio)} c/u
                                            </Typography>
                                        </Box>
                                    ))}
                                </TableCell>
                                <TableCell>{formatCurrency(pedido.total)}</TableCell>
                                <TableCell>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={pedido.estado}
                                            onChange={(e) =>
                                                handleEstadoChange(pedido.id, e.target.value)
                                            }
                                        >
                                            <MenuItem value="pendiente">Pendiente</MenuItem>
                                            <MenuItem value="confirmado">Confirmado</MenuItem>
                                            <MenuItem value="en_preparacion">En Preparación</MenuItem>
                                            <MenuItem value="enviado">Enviado</MenuItem>
                                            <MenuItem value="entregado">Entregado</MenuItem>
                                            <MenuItem value="cancelado">Cancelado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleEstadoChange(pedido.id, "entregado")}
                                    >
                                        Marcar como Entregado
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrdersAdmin;