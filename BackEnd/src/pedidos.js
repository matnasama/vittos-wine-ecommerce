const express = require("express");
const database = require("./database");
const { verifyToken, verifyAdmin } = require("./verifyToken");
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

// Obtener todos los pedidos con detalles (solo admin)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const connection = database.getConnection();
        const result = await connection.query(`
            SELECT 
                p.id, p.fecha, p.total, p.estado,
                u.nombre as usuario_nombre, u.email as usuario_email,
                u.direccion as usuario_direccion, u.telefono as usuario_telefono,
                dp.producto_id, dp.cantidad, dp.precio,
                pr.nombre as producto_nombre, pr.categoria, pr.imagen_url
            FROM pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN detalle_pedidos dp ON p.id = dp.pedido_id
            JOIN productos pr ON dp.producto_id = pr.id
            ORDER BY p.fecha DESC
        `);

        // Agrupar los resultados por pedido
        const pedidosAgrupados = {};
        result.rows.forEach(row => {
            if (!pedidosAgrupados[row.id]) {
                pedidosAgrupados[row.id] = {
                    id: row.id,
                    fecha: row.fecha,
                    total: row.total,
                    estado: row.estado,
                    usuario_nombre: row.usuario_nombre,
                    usuario_email: row.usuario_email,
                    usuario_direccion: row.usuario_direccion,
                    usuario_telefono: row.usuario_telefono,
                    productos: []
                };
            }

            pedidosAgrupados[row.id].productos.push({
                id: row.producto_id,
                nombre: row.producto_nombre,
                categoria: row.categoria,
                cantidad: row.cantidad,
                precio: row.precio,
                imagen_url: row.imagen_url
            });
        });

        res.json(Object.values(pedidosAgrupados));
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ message: "Error al obtener pedidos" });
    }
});

// Actualizar estado de pedido (solo admin)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const connection = database.getConnection();
        await connection.query(
            "UPDATE pedidos SET estado = $1 WHERE id = $2",
            [estado, id]
        );
        res.json({ message: "Estado del pedido actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar estado del pedido:", err);
        res.status(500).json({ message: "Error al actualizar estado del pedido" });
    }
});

// Obtener pedidos del usuario
router.get("/mis-pedidos", verifyToken, async (req, res) => {
    try {
        const connection = database.getConnection();
        const result = await connection.query(`
            SELECT 
                p.id, p.fecha, p.total, p.estado,
                dp.producto_id, dp.cantidad, dp.precio,
                pr.nombre as producto_nombre, pr.categoria
            FROM pedidos p
            JOIN detalle_pedidos dp ON p.id = dp.pedido_id
            JOIN productos pr ON dp.producto_id = pr.id
            WHERE p.usuario_id = $1
            ORDER BY p.fecha DESC
        `, [req.user.id]);

        const pedidosAgrupados = {};
        result.rows.forEach(row => {
            if (!pedidosAgrupados[row.id]) {
                pedidosAgrupados[row.id] = {
                    id: row.id,
                    fecha: row.fecha,
                    total: row.total,
                    estado: row.estado,
                    productos: []
                };
            }

            pedidosAgrupados[row.id].productos.push({
                id: row.producto_id,
                nombre: row.producto_nombre,
                categoria: row.categoria,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        res.json(Object.values(pedidosAgrupados));
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ message: "Error al obtener pedidos" });
    }
});

// Crear un nuevo pedido
router.post("/orden", verifyToken, async (req, res) => {
    const { productos, total } = req.body;
    const userId = req.user.id;

    try {
        const connection = database.getConnection();
        await connection.query("BEGIN");

        // Insertar pedido
        const pedidoResult = await connection.query(
            "INSERT INTO pedidos (usuario_id, total, fecha, estado) VALUES ($1, $2, CURRENT_TIMESTAMP, 'pendiente') RETURNING id",
            [userId, total]
        );
        const pedidoId = pedidoResult.rows[0].id;

        // Insertar productos en detalle_pedidos
        for (const prod of productos) {
            await connection.query(
                "INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES ($1, $2, $3, $4)",
                [pedidoId, prod.productoId, prod.quantity, prod.price]
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
