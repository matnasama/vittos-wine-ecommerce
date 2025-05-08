import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../../public/products');
const OUTPUT_DIR = path.join(__dirname, '../../public/products/optimized');

// Asegurarse de que el directorio de salida existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`Optimizada: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error al optimizar ${inputPath}:`, error);
  }
}

async function optimizeAllImages() {
  try {
    const files = fs.readdirSync(SOURCE_DIR);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(SOURCE_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, `${path.parse(file).name}.webp`);
        
        await optimizeImage(inputPath, outputPath);
      }
    }
    
    console.log('¡Optimización de imágenes completada!');
  } catch (error) {
    console.error('Error durante la optimización:', error);
  }
}

// Ejecutar la optimización
optimizeAllImages(); 