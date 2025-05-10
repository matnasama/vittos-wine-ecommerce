import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  TableContainer,
  useMediaQuery,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Sort, RestartAlt, Add } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { config } from '../config';

export default function UsersAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openModal, setOpenModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(config.API_ENDPOINTS.ADMIN_USUARIOS);
      setUsuarios(res.data);
      setFilteredUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('No se pudieron cargar los usuarios');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [search, usuarios]);

  const handleFilter = () => {
    const result = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsuarios(result);
  };

  const handleSort = () => {
    const sorted = [...filteredUsuarios].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.rol.localeCompare(b.rol);
      } else {
        return b.rol.localeCompare(a.rol);
      }
    });
    setFilteredUsuarios(sorted);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleReset = () => {
    setSearch('');
    setSortOrder('asc');
    setFilteredUsuarios(usuarios);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setForm({
      nombre: '',
      email: '',
      password: '',
      rol: 'cliente'
    });
    setOpenModal(true);
  };

  const handleEdit = (usuario) => {
    setIsCreating(false);
    setEditandoId(usuario.id);
    setForm({ ...usuario });
    setOpenModal(true);
  };

  const handleCancel = () => {
    setEditandoId(null);
    setForm({});
    setOpenModal(false);
    setError('');
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setError('');
      if (isCreating) {
        await axios.post(config.API_ENDPOINTS.ADMIN_USUARIOS, form);
      } else {
        await axios.put(`${config.API_ENDPOINTS.ADMIN_USUARIOS}/${editandoId}`, form);
      }
      setEditandoId(null);
      setOpenModal(false);
      fetchUsuarios();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await axios.delete(`${config.API_ENDPOINTS.ADMIN_USUARIOS}/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('No se pudo eliminar el usuario');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Título y acciones */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
        <Typography variant="body1" gutterBottom>Lista de usuarios registrados.</Typography>

        <Box sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          mt: 2
        }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              backgroundColor: '#e4adb0',
              '&:hover': { backgroundColor: '#d49a9d' },
              whiteSpace: 'nowrap'
            }}
          >
            AGREGAR USUARIO
          </Button>

          <TextField
            label="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={handleSort}
            sx={{
              borderColor: '#e4adb0',
              color: '#e4adb0',
              '&:hover': {
                borderColor: '#d49a9d',
                backgroundColor: 'rgba(228, 173, 176, 0.08)'
              },
              whiteSpace: 'nowrap'
            }}
          >
            ORDENAR POR ROL ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
          </Button>

          <Button
            variant="text"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            sx={{
              color: '#999',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              },
              whiteSpace: 'nowrap'
            }}
          >
            Resetear filtros
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de usuarios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(usuario)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(usuario.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para editar/crear */}
      <Dialog open={openModal} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isCreating ? 'Nuevo Usuario' : 'Editar Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email || ''}
              onChange={handleChange}
              fullWidth
            />
            {isCreating && (
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={form.password || ''}
                onChange={handleChange}
                fullWidth
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                name="rol"
                value={form.rol || 'cliente'}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#e4adb0',
              '&:hover': { backgroundColor: '#d49a9d' }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}