const { stat } = require('fs/promises');
const path = require('path');
const { readdir } = require('fs/promises');

const filePath = path.join(__dirname, 'secret-folder');

async function getFiles() {
  try {
    const files = await readdir(filePath, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        getDataFromFile(file);
      }
    }       
  } catch (err) {
    console.error(err);
  }
}

getFiles();

async function getDataFromFile(file) {
  const pathToFile = path.join(__dirname, 'secret-folder', `${file.name}`);
  const item = path.parse(pathToFile);
  const fileName = item.name;
  const fileExt = item.ext.slice(1);
  const stats = await stat(pathToFile, (err, stats) => {
    if (err) console.error(err);
    return stats.size;
  });
  console.log(fileName, '-', fileExt, '-', stats.size);
}