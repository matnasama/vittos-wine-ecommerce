-- Insertar algunos pedidos de prueba
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(1, 13000, 'pendiente'),
(1, 19500, 'enviado'),
(1, 11000, 'entregado');

-- Insertar detalles de los pedidos
INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES
-- Detalles del primer pedido
(1, 1, 2, 6500),  -- 2 Malbec Abuelo Nito
-- Detalles del segundo pedido
(2, 1, 3, 6500),  -- 3 Malbec Abuelo Nito
-- Detalles del tercer pedido
(3, 4, 2, 5500);  -- 2 Malbec Bournett 