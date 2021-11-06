const { copyFile, readdir, mkdir, rm } = require('fs/promises');
const path = require('path');

async function copyDir() {
  const pathToDir = path.join(__dirname, 'files');
  const pathToDest = path.join(__dirname, 'files-copy');
  await mkdir(pathToDest, {recursive: true});
  try {
    const filesCopy = await readdir(pathToDest);
    if (filesCopy.length > 0) {
      for (const fileCopy of filesCopy) {
        const pathToCopyFile = path.join(__dirname, 'files-copy', fileCopy);
        await rm(pathToCopyFile);
      }
    }
    const files = await readdir(pathToDir);
    for (const file of files) {
      const pathToCopy = `${pathToDir}/${file}`;
      const pathToDestFile = `${pathToDest}/${file}`;
      await copyFile(pathToCopy, pathToDestFile);
    } 
  } catch(err) {
    console.error(`Catch error: ${err}`);
  }
}
copyDir();
