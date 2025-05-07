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
  Alert
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Sort, RestartAlt, Add } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/usuarios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsuarios(res.data);
      setFilteredUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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
      rol: 'cliente',
      telefono: '',
      direccion: ''
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
        await axios.post('http://localhost:4000/api/register', form);
      } else {
        await axios.put(`http://localhost:4000/api/usuarios/${editandoId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setEditandoId(null);
      setOpenModal(false);
      fetchUsuarios();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError(err.response?.data?.message || 'Error al guardar usuario');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

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

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              backgroundColor: '#e4adb0',
              '&:hover': {
                backgroundColor: '#d49a9d'
              },
              whiteSpace: 'nowrap'
            }}
          >
            Crear Usuario
          </Button>
        </Box>
      </Box>

      {/* Vista de escritorio - Tabla */}
      {!isMobile && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell>{usuario.telefono}</TableCell>
                  <TableCell>{usuario.direccion}</TableCell>
                  <TableCell align="right">
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
      )}

      {/* Vista móvil - Cards */}
      {isMobile && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filteredUsuarios.map((usuario) => (
            <Grid item xs={12} key={usuario.id}>
              <Card sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {usuario.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {usuario.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Rol:</strong> {usuario.rol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Teléfono:</strong> {usuario.telefono}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Dirección:</strong> {usuario.direccion}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton onClick={() => handleEdit(usuario)} color="primary" size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(usuario.id)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de edición/creación */}
      <Dialog open={openModal} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{isCreating ? 'Crear Usuario' : 'Editar Usuario'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            {isCreating && (
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={form.password || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                name="rol"
                value={form.rol || ''}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Teléfono"
              name="telefono"
              value={form.telefono || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={form.direccion || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {isCreating ? 'Crear' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}