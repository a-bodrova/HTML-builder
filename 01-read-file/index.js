const fs = require('fs');
const path = require('path');
const stream = require('stream');

const filePath = path.join(__dirname, 'text.txt');

fs.readFile(filePath, (err, content) => {
    if (err) {
        throw err;
    }

    const data = Buffer.from(content);
    console.log(data.toString());
});
