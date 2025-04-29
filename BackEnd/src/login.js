const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("./database");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const connection = database.getConnection();
      const [rows] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);

      const user = rows[0];
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
  }
);

module.exports = router;
