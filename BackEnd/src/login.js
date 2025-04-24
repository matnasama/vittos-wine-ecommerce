const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("./database");
const SECRET = 'clave_secreta';

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = database.getConnection();
        const [rows] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        const user = rows[0]; // Acceder correctamente al primer usuario
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

        res.json({
            message: "Autenticación exitosa",
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = router;

