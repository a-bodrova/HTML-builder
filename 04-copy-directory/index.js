const { copyFile, readdir, mkdir, rm } = require('fs/promises');
const path = require('path');

const pathToDir = path.join(__dirname, 'files');
const pathToDest = path.join(__dirname, 'files-copy');


async function copyDir(from, to) {

  await mkdir(to, {recursive: true});

  try {
    const filesCopy = await readdir(to);
    if (filesCopy.length > 0) {
      for (const fileCopy of filesCopy) {
        const pathToCopyFile = path.join(to, fileCopy);
        await rm(pathToCopyFile);
      }
    }
    const files = await readdir(from);

    for (const file of files) {
      const pathToCopy = path.join(from, file);
      const pathToDestFile = path.join(to, file);
      await copyFile(pathToCopy, pathToDestFile);
    } 
  } catch(err) {
    console.error(`Catch error: ${err}`);
  }
}

copyDir(pathToDir, pathToDest);
