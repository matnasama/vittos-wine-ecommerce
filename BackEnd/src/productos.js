const express = require('express');
const router = express.Router();
const { getConnection } = require('./database');
const { verifyToken, verifyAdmin } = require('./verifyToken');

const db = getConnection();

// GET público
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST solo admin
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, categoria, imagen]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto creado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT solo admin
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id=?',
      [nombre, descripcion, precio, stock, categoria, imagen, id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE solo admin
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id=?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
