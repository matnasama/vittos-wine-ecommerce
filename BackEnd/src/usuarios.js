const express = require("express");
const database = require("./database");
const bcrypt = require("bcrypt");
const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const connection = database.getConnection();
        const result = await connection.query("SELECT id, nombre, email, rol FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

// Crear usuario (registro)
router.post("/", async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = database.getConnection();
        const result = await connection.query(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol",
            [nombre, email, hashedPassword, rol || "usuario"]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error al crear usuario:", err);
        res.status(500).json({ message: "Error al crear usuario" });
    }
});

module.exports = router;
