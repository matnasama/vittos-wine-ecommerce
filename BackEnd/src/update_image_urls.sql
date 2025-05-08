-- Actualizar las URLs de las imágenes a formato WebP
UPDATE productos
SET imagen_url = REGEXP_REPLACE(
    imagen_url,
    '(.+)\\.(png|jpg|jpeg)$',
    '\1.webp'
)
WHERE imagen_url ~ '\\.(png|jpg|jpeg)$';

-- Mover las imágenes a la carpeta optimized
UPDATE productos
SET imagen_url = REGEXP_REPLACE(
    imagen_url,
    '/products/([^/]+\\.webp)$',
    '/products/optimized/\1'
)
WHERE imagen_url ~ '/products/[^/]+\\.webp$'; 