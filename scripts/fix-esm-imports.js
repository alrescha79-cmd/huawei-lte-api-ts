#!/usr/bin/env node
/**
 * Add .js extensions to ESM imports
 */

const fs = require('fs');
const path = require('path');

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      addJsExtensions(fullPath);
    } else if (file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Add .js to import/export from statements
      const newContent = content.replace(
        /(from|import)\s+['"](\.[^'"]+)['"]/g,
        (match, keyword, p1) => {
          if (p1.endsWith('.js') || p1.endsWith('.json')) return match;
          modified = true;
          return `${keyword} '${p1}.js'`;
        }
      );
      
      if (modified) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('  Fixed:', path.relative(dir, fullPath));
      }
    }
  }
}

const esmDir = path.join(__dirname, '..', 'dist', 'esm');
console.log('Adding .js extensions to ESM imports in:', esmDir);
addJsExtensions(esmDir);
console.log('Done!');
