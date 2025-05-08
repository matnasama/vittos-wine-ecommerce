const { optimizeDirectory } = require('../src/utils/imageOptimizer');
const path = require('path');

const inputDir = path.join(__dirname, '../public/products');
const outputDir = path.join(__dirname, '../public/products/optimized');

console.log('Starting image optimization...');
console.log(`Input directory: ${inputDir}`);
console.log(`Output directory: ${outputDir}`);

optimizeDirectory(inputDir, outputDir)
  .then(() => {
    console.log('Image optimization completed successfully!');
  })
  .catch(error => {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }); 