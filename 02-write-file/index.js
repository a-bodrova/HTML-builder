const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const greeting = 'Hello! Enter the text...\n';
const farewell = 'Good bye!';

stdout.write(greeting);

process.on('SIGINT', () => {
  stdout.write(farewell);
  process.exit();
});

stdin.on('data', data => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    stdout.write(farewell);
    process.exit();
  }
  fs.appendFile(filePath, data, (err) => {
    if (err) throw err;
  });
});