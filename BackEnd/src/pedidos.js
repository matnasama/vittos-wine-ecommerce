const express = require("express");
const database = require("./database");
const router = express.Router();

// Obtener todos los pedidos
router.get("/", async (req, res) => {
    try {
        const connection = database.getConnection();
        const result = await connection.query("SELECT * FROM pedidos ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ message: "Error al obtener pedidos" });
    }
});

// Crear un nuevo pedido
router.post("/", async (req, res) => {
    const { usuario_id, total, productos } = req.body;

    try {
        const connection = database.getConnection();
        await connection.query("BEGIN");

        // Insertar pedido
        const pedidoResult = await connection.query(
            "INSERT INTO pedidos (usuario_id, total, fecha) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id",
            [usuario_id, total]
        );
        const pedidoId = pedidoResult.rows[0].id;

        // Insertar productos en detalle_pedidos
        for (const prod of productos) {
            await connection.query(
                "INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)",
                [pedidoId, prod.id, prod.cantidad, prod.precio]
            );
        }

        await connection.query("COMMIT");
        res.status(201).json({ message: "Pedido creado correctamente", pedidoId });
    } catch (err) {
        console.error("Error al crear pedido:", err);
        await connection.query("ROLLBACK");
        res.status(500).json({ message: "Error al crear pedido" });
    }
});

module.exports = router;
