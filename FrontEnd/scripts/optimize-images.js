const { optimizeDirectory } = require('../src/utils/imageOptimizer');
const path = require('path');

const inputDir = path.join(__dirname, '../public/products');
const outputDir = path.join(__dirname, '../public/products/optimized');

optimizeDirectory(inputDir, outputDir)
  .then(() => {
  })
  .catch(error => {
    process.exit(1);
  }); 