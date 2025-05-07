require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('./database');
const { verifyToken } = require('./verifyToken');

// Rutas externas
const productosRouter = require('./productos');
const pedidosRouter = require('./pedidos');
const usuariosRouter = require('./usuarios');

const app = express();
const PORT = process.env.SERVER_PORT || 4000;
const SECRET = process.env.JWT_SECRET;

// 🧩 Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 📦 Rutas
app.use('/api/productos', productosRouter);
app.use('/api', pedidosRouter);
app.use('/api', usuariosRouter);

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

// Middleware para verificar si es admin
const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
  next();
};

// Obtener todos los usuarios (solo admin)
app.get('/api/usuarios', verificarToken, esAdmin, async (req, res) => {
  try {
    const client = await getConnection();
    const result = await client.query('SELECT id, nombre, email, rol, telefono, direccion FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Actualizar usuario (solo admin)
app.put('/api/usuarios/:id', verificarToken, esAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, telefono, direccion } = req.body;

  try {
    const client = await getConnection();
    await client.query(
      'UPDATE usuarios SET nombre = $1, email = $2, rol = $3, telefono = $4, direccion = $5 WHERE id = $6',
      [nombre, email, rol, telefono, direccion, id]
    );
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
app.delete('/api/usuarios/:id', verificarToken, esAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const client = await getConnection();
    await client.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

// 🔐 LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await getConnection();
    const result = await client.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 🧾 REGISTRO
app.post('/api/register', async (req, res) => {
  const { nombre, email, telefono, password, direccion } = req.body;

  try {
    const client = await getConnection();
    
    // Verificar si el email ya existe
    const existingUser = await client.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      'INSERT INTO usuarios (nombre, email, telefono, password, direccion, rol) VALUES ($1, $2, $3, $4, $5, $6)',
      [nombre, email, telefono, hashedPassword, direccion, 'cliente']
    );

    res.json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// 🛒 CREAR ORDEN
app.post('/api/orden', verifyToken, async (req, res) => {
  const { userId, productos, total } = req.body;

  try {
    const client = await getConnection();

    const pedidoRes = await client.query(
      'INSERT INTO pedidos (usuario_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total]
    );
    const pedidoId = pedidoRes.rows[0].id;

    const insertPromises = productos.map(p =>
      client.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES ($1, $2, $3, $4)',
        [pedidoId, p.productoId, p.quantity, p.price]
      )
    );

    await Promise.all(insertPromises);

    res.json({ message: 'Orden registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar orden:', error);
    res.status(500).json({ error: 'Error al registrar orden' });
  }
});

// 📄 HISTORIAL DE PEDIDOS DEL USUARIO
app.get('/api/mis-pedidos', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const client = await getConnection();
    const result = await client.query(`
      SELECT 
        p.id AS pedido_id, p.fecha, p.total, p.estado,
        dp.producto_id, dp.cantidad, dp.precio,
        pr.nombre AS producto_nombre, pr.categoria
      FROM pedidos p
      JOIN detalle_pedidos dp ON p.id = dp.pedido_id
      JOIN productos pr ON dp.producto_id = pr.id
      WHERE p.usuario_id = $1
      ORDER BY p.fecha DESC
    `, [userId]);

    const pedidosAgrupados = {};
    result.rows.forEach(row => {
      if (!pedidosAgrupados[row.pedido_id]) {
        pedidosAgrupados[row.pedido_id] = {
          id: row.pedido_id,
          fecha: row.fecha,
          total: row.total,
          estado: row.estado,
          productos: []
        };
      }

      pedidosAgrupados[row.pedido_id].productos.push({
        id: row.producto_id,
        nombre: row.producto_nombre,
        categoria: row.categoria,
        cantidad: row.cantidad,
        precio: row.precio
      });
    });

    res.json(Object.values(pedidosAgrupados));
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Obtener todos los pedidos (solo admin)
app.get('/api/pedidos', verificarToken, esAdmin, async (req, res) => {
  try {
    const client = await getConnection();
    const result = await client.query(`
      SELECT 
        p.id AS pedido_id, p.fecha, p.total, p.estado,
        u.nombre AS usuario_nombre, u.email AS usuario_email,
        dp.producto_id, dp.cantidad, dp.precio,
        pr.nombre AS producto_nombre, pr.categoria
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN detalle_pedidos dp ON p.id = dp.pedido_id
      JOIN productos pr ON dp.producto_id = pr.id
      ORDER BY p.fecha DESC
    `);

    const pedidosAgrupados = {};
    result.rows.forEach(row => {
      if (!pedidosAgrupados[row.pedido_id]) {
        pedidosAgrupados[row.pedido_id] = {
          id: row.pedido_id,
          fecha: row.fecha,
          total: row.total,
          estado: row.estado,
          usuario: {
            nombre: row.usuario_nombre,
            email: row.usuario_email
          },
          productos: []
        };
      }

      pedidosAgrupados[row.pedido_id].productos.push({
        id: row.producto_id,
        nombre: row.producto_nombre,
        categoria: row.categoria,
        cantidad: row.cantidad,
        precio: row.precio
      });
    });

    res.json(Object.values(pedidosAgrupados));
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Actualizar estado de pedido (solo admin)
app.put('/api/pedidos/:id', verificarToken, esAdmin, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const client = await getConnection();
    await client.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2',
      [estado, id]
    );
    res.json({ mensaje: 'Estado del pedido actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado del pedido' });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
