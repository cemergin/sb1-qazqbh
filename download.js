const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

function zipDirectory(dir, zip, root = '') {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      zipDirectory(filePath, zip, path.join(root, file));
    } else {
      const fileContent = fs.readFileSync(filePath);
      zip.file(path.join(root, file), fileContent);
    }
  }
}

async function createDownloadLink() {
  const zip = new JSZip();
  zipDirectory('/home/project', zip);

  const content = await zip.generateAsync({type: 'base64'});
  const dataUrl = `data:application/zip;base64,${content}`;

  console.log('Copy and paste this URL into your browser to download the project:');
  console.log(dataUrl);
}

createDownloadLink();