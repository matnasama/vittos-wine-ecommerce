const express = require("express");
const database = require("./database");
const router = express.Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const connection = database.getConnection();
        const result = await connection.query("SELECT * FROM productos");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

// Agregar producto
router.post("/", async (req, res) => {
    const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;

    if (!nombre || !descripcion || !precio || !imagen || stock == null || !categoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const connection = database.getConnection();
        const result = await connection.query(
            "INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [nombre, descripcion, Number(precio), imagen, Number(stock), categoria]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error al agregar producto:", err);
        res.status(500).json({ message: "Error al agregar producto" });
    }
});

// Editar producto
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;

    if (!nombre || !descripcion || !precio || !imagen || stock == null || !categoria) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
}

    try {
        const connection = database.getConnection();

        const check = await connection.query("SELECT * FROM productos WHERE id = $1", [id]);
        if (check.rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const result = await connection.query(
            "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, imagen = $4, stock = $5, categoria = $6 WHERE id = $7 RETURNING *",
            [nombre, descripcion, Number(precio), imagen, Number(stock), categoria, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error al actualizar producto:", err);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const connection = database.getConnection();

        const check = await connection.query("SELECT * FROM productos WHERE id = $1", [id]);
        if (check.rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await connection.query("DELETE FROM productos WHERE id = $1", [id]);
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        console.error("Error al eliminar producto:", err);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});

module.exports = router;
