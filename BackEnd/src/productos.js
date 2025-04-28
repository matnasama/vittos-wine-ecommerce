const express = require('express');
const router = express.Router();
const { getConnection } = require('./database');
const { verifyToken, verifyAdmin } = require('./verifyToken');

// GET público
router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST solo admin
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen: imagen_url } = req.body;

    if (!nombre || !precio || !stock || !categoria) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const connection = await getConnection();
    const [result] = await connection.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, categoria, imagen_url]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen_url   // ✅ Aquí corregido
    });
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ mensaje: 'Error interno al guardar el producto' });
  }
});

// PUT solo admin
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen: imagen_url } = req.body;
    const { id } = req.params;

    const connection = await getConnection();
    await connection.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen_url=? WHERE id=?',
      [nombre, descripcion, precio, stock, categoria, imagen_url, id]
    );

    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    console.error('Error al actualizar producto:', err.message);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE solo admin
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    await connection.query('DELETE FROM productos WHERE id=?', [id]);

    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
