const path = require('path');
const fs = require('fs');
const { readFile, writeFile, readdir, rm, copyFile, mkdir } = require('fs/promises');

async function buildPage() {
  const pathToProjectDist = path.join(__dirname, 'project-dist');
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToComponents = path.join(__dirname, 'components');
  
  await rm(pathToProjectDist, {recursive: true, force: true});

  try {
    await mkdir(pathToProjectDist);
    const data = await readFile(pathToTemplate);
    let template = data.toString();
    const components = await readdir(pathToComponents);
    let names = [];

    for (const component of components) {
      const pathToFullNames = path.join(pathToComponents, component);
      const content = await readFile(pathToFullNames);
      const anyname = path.parse(pathToFullNames);
      let name;

      if (anyname.ext === '.html') {
        name = anyname.name;
      }
      
      names.push(name);
      template = template.replaceAll(`{{${name}}}`, content);

      await writeFile(`${pathToProjectDist}/index.html`, template, (err) => {
        console.error(`Error to write index.html: ${err}`);
      });
    }

    const pathToAssets = path.join(__dirname, 'assets');
    const pathToAssetsDist = path.join(pathToProjectDist, 'assets');
    const pathToStyle = path.join(__dirname, 'styles');

    copyDir(pathToAssets, pathToAssetsDist);
    mergeStyles(pathToStyle, pathToProjectDist, 'style.css');
  } catch (err) {

    if (err === 'ENOENT') {
      await mkdir(pathToProjectDist);
      buildPage();
    } else {
      console.error(`Unknown error: ${err}`);
    }
  }
}

buildPage();

async function copyDir(from, to) {
  await mkdir(to, {recursive: true});

  try {
    const filesCopy = await readdir(to);

    if (filesCopy.length > 0) {
      await rm(to, {recursive: true, force: true});
    }

    const files = await readdir(from, {withFileTypes: true});

    for (const file of files) {
      if (file.isFile()) {
        const pathToCopy = `${from}/${file.name}`;
        const pathToDestFile = `${to}/${file.name}`;

        await copyFile(pathToCopy, pathToDestFile);
      } else if (file.isDirectory()) {
        copyDir(`${from}/${file.name}`, `${to}/${file.name}`);
      }
    } 
  } catch(err) {
    console.error(`Catch error: ${err}`);
  }
}

async function mergeStyles(from, to, fullnameOfBundle) {
  const pathToFile = path.join(to, fullnameOfBundle);
  const filesInDev = await readdir(from, {withFileTypes: true});
  const filesInDist = await readdir(to, {withFileTypes: true});

  for (const file of filesInDist) {
    if (file.name === fullnameOfBundle) {
      rm(pathToFile);
    }
  }

  for (const file of filesInDev) {
    if(file.isFile()) {
      const fileName = file.name.split('.');
      if (fileName[1] === 'css') {
        const pathToFileInDev = path.join(from, file.name);
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