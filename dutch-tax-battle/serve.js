#!/usr/bin/env node
// Minimal static file server for local development of the dutch-tax-battle PWA.
// Zero dependencies — uses Node's built-in `http` and `fs` modules.
//
// Usage:
//   node serve.js [port]
//   PORT=8080 node serve.js
//
// Then open http://localhost:8080/ on desktop, or http://<your-lan-ip>:8080/
// on your phone (same Wi-Fi network).

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = parseInt(process.argv[2] || process.env.PORT || '8080', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function safeJoin(root, p) {
  const resolved = path.resolve(root, '.' + p);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = safeJoin(ROOT, urlPath);
  if (!filePath) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n  💼 ZZP vs Belastingdienst — De Blauwe Wraak`);
  console.log(`  ▶ Open in browser:  http://localhost:${PORT}/`);
  console.log(`  📱 On phone (same Wi-Fi): http://<your-lan-ip>:${PORT}/\n`);
});
