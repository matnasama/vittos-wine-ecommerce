// src/pedidos.js
const express = require('express');
const router = express.Router();
const { getConnection } = require('./database');
const { verifyToken, verifyAdmin } = require('./verifyToken');

// 📦 Obtener todos los pedidos con detalles (solo admin)
router.get('/pedidos', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const connection = getConnection();

    // Incluimos direccion y telefono en la consulta de usuarios
    const [pedidos] = await connection.query(`
      SELECT 
        p.id, 
        p.fecha, 
        p.estado, 
        CAST(p.total AS DECIMAL(10,2)) AS total, 
        u.email AS usuario_email,
        u.nombre AS usuario_nombre,
        u.direccion AS usuario_direccion,
        u.telefono AS usuario_telefono
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha DESC
    `);

    // Incluimos categoria (marca) en los productos
    const detallesPedidos = await Promise.all(
      pedidos.map(async pedido => {
        const [productos] = await connection.query(`
          SELECT 
            pr.nombre, 
            pr.imagen_url,
            pr.categoria AS marca,
            dp.cantidad, 
            CAST(dp.precio AS DECIMAL(10,2)) AS precio
          FROM detalle_pedidos dp
          JOIN productos pr ON dp.producto_id = pr.id
          WHERE dp.pedido_id = ?
        `, [pedido.id]);

        return { 
          ...pedido, 
          productos,
          fecha: new Date(pedido.fecha).toISOString()
        };
      })
    );

    res.json(detallesPedidos);
  } catch (error) {
    console.error('Error al obtener pedidos admin:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
});


// ✏️ Actualizar estado del pedido (solo admin)
router.put('/pedidos/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Validar estado
  const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  try {
    const connection = getConnection();
    await connection.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    
    // Devolver el pedido actualizado
    const [pedidoActualizado] = await connection.query(`
      SELECT p.*, u.email AS usuario_email
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [id]);
    
    res.json({ 
      mensaje: 'Estado del pedido actualizado correctamente',
      pedido: pedidoActualizado[0]
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ mensaje: 'Error al actualizar pedido' });
  }
});

module.exports = router;