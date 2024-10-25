const fs = require('fs-extra');
const chokidar = require('chokidar');

// Define source and destination paths
const sourcePath = 'src/assets';
const destinationPath = 'dist/assets';

// Function to copy assets
function copyAssets() {
  fs.copy(sourcePath, destinationPath, { overwrite: true }, (err) => {
    if (err) {
      console.error('Error copying assets:', err);
    } else {
      console.log('Assets copied successfully!');
    }
  });
}
// Function to copy assets
function copyConfig() {
  fs.copy(`src/config.json`, `dist/config.json`, { overwrite: true }, (err) => {
    if (err) {
      console.error('Error copying assets:', err);
    } else {
      console.log('Config updated successfully!');
    }
  });
}

// Watch for changes in assets directory
chokidar.watch(sourcePath).on('all', (event, path) => {
  console.log(`File ${path} changed. Copying assets...`);
  copyAssets();
});

chokidar.watch(`src/config.json`).on('all', (event, path) => {
  console.log(`File ${path} changed. Copying config...`);
  copyConfig();
});
