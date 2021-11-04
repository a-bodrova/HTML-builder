const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');

fs.readFile(filePath, (err, content) => {
  if (err) {
    throw err;
  }

  const data = Buffer.from(content);
  stdout.write(data.toString());
});
