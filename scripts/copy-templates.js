const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'templates');
const targetDir = path.join(__dirname, '..', 'dist', 'templates');

async function copyTemplates() {
  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // Copy templates directory
    await fs.copy(sourceDir, targetDir, {
      overwrite: true,
      errorOnExist: false
    });
    
    console.log('Templates copied successfully!');
  } catch (err) {
    console.error('Error copying templates:', err);
    process.exit(1);
  }
}

copyTemplates(); 