const express = require('express');
const router = express.Router();
const { getConnection } = require('./database');
const { verifyToken, verifyAdmin } = require('./verifyToken');

// ✅ Obtener todos los usuarios
router.get('/usuarios', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// ✏️ Editar usuario
router.put('/usuarios/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, email, direccion, telefono } = req.body;

  try {
    const connection = getConnection();
    await connection.query(
      'UPDATE usuarios SET nombre = ?, email = ?, direccion = ?, telefono = ? WHERE id = ?',
      [nombre, email, direccion, telefono, id]
    );
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
});

// ❌ Eliminar usuario
router.delete('/usuarios/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = getConnection();
    await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

module.exports = router;
