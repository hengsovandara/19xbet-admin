const fs = require('fs')

const path = process.cwd() + '/out/index.html';
const content = fs.readFileSync(path, 'utf8');
return fs.writeFileSync(path, content.replace('</html>html>', '</html>'))