const path = require('path');
const { readdir, rm } = require('fs/promises');
const fs = require('fs');

async function mergeStyle () {
  const pathFromDir = path.join(__dirname, 'styles');
  const pathToDir = path.join(__dirname, 'project-dist');
  const pathToFile = path.join(__dirname, 'project-dist', 'bundle.css');
  const filesInDev = await readdir(pathFromDir, {withFileTypes: true});
  const filesInDist = await readdir(pathToDir, {withFileTypes: true});
  for (const file of filesInDist) {
    if (file.name === 'bundle.css') {
      rm(pathToFile);
    }
  }
  for (const file of filesInDev) {
    if(file.isFile()) {
      const fileName = file.name.split('.');
      if (fileName[1] === 'css') {
        const pathToFileInDev = path.join(__dirname, 'styles', file.name);
        fs.readFile(pathToFileInDev, (err, content) => {
          if (err) console.error(err);
          const data = `${Buffer.from(content).toString()}\n`;
          fs.appendFile(pathToFile, data, err => {
            if (err) console.error(err);
          });
        });
      }
    }
  }
}

mergeStyle();