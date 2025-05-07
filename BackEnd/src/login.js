const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("./database");
const SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = database.getConnection();
        const result = await connection.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        const user = result.rows[0];
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            SECRET,
            { expiresIn: "1h" }
        );

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
