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

// 🔐 LOGIN
app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const connection = getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
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
app.post('/register', async (req, res) => {
  const { nombre, usuario, email, telefono, password } = req.body;

  try {
    const connection = getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'INSERT INTO usuarios (nombre, usuario, email, telefono, password, rol) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, usuario, email, telefono, hashedPassword, 'cliente']
    );

    res.json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// 🛒 CREAR ORDEN
app.post('/orden', verifyToken, async (req, res) => {
  const { userId, productos, total } = req.body;

  try {
    const connection = getConnection();

    const [pedidoRes] = await connection.query(
      'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
      [userId, total]
    );
    const pedidoId = pedidoRes.insertId;

    const detalles = productos.map(p =>
      connection.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
        [pedidoId, p.productoId, p.quantity, p.price]
      )
    );

    await Promise.all(detalles);

    res.json({ message: 'Orden registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar orden:', error);
    res.status(500).json({ error: 'Error al registrar orden' });
  }
});

// 📄 HISTORIAL DE PEDIDOS DEL USUARIO
app.get('/mis-pedidos', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const connection = getConnection();
    const [rows] = await connection.query(`
      SELECT 
        p.id AS pedidoId, p.fecha, p.total, p.estado,
        dp.producto_id, dp.cantidad, dp.precio,
        pr.nombre AS producto_nombre, pr.categoria
      FROM pedidos p
      JOIN detalle_pedidos dp ON p.id = dp.pedido_id
      JOIN productos pr ON dp.producto_id = pr.id
      WHERE p.usuario_id = ?
      ORDER BY p.fecha DESC
    `, [userId]);

    const pedidosAgrupados = {};
    rows.forEach(row => {
      if (!pedidosAgrupados[row.pedidoId]) {
        pedidosAgrupados[row.pedidoId] = {
          id: row.pedidoId,
          fecha: row.fecha,
          total: row.total,
          estado: row.estado,
          productos: []
        };
      }

      pedidosAgrupados[row.pedidoId].productos.push({
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

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
