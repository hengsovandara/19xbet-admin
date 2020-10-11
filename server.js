const { createServer } = require('http');
const { parse } = require('url');
const { createReadStream } = require('fs');
const next = require('next');

console.log("In")
const port = parseInt(process.env.npm_lifecycle_script.split('-p ').pop()) || 8080
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, port, host: '0.0.0.0' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    console.log("Hi")
    if(!pathname.includes('firebase-messaging-sw.js'))
      return handle(req, res, parsedUrl);
    
    res.setHeader('content-type', 'text/javascript');
    createReadStream('./public/firebase-messaging-sw.js').pipe(res);

  }).listen(port, err => {
    if (err) throw err;
    console.log('> Ready on http://0.0.0.0:' + port);
  });
});