// Backend de test (équivalent du contrôleur Spring Boot @CrossOrigin("*")) sur le port 8083
const http = require('http');
let products = [
  { id: 1, name: 'Ordinateur Portable', price: 1300, selected: true },
  { id: 2, name: 'Imprimante Multifonction', price: 300, selected: false },
  { id: 3, name: 'Smartphone 5G', price: 800, selected: true }
];
let nextId = 4;
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};
http.createServer((req, res) => {
  const send = (code, body) => { res.writeHead(code, { ...cors, 'Content-Type': 'application/json' }); res.end(body === undefined ? '' : JSON.stringify(body)); };
  if (req.method === 'OPTIONS') return send(204);
  const m = req.url.match(/^\/products(?:\/(\d+))?$/);
  if (!m) return send(404, { error: 'not found' });
  const id = m[1] ? +m[1] : null;
  let raw = '';
  req.on('data', c => raw += c);
  req.on('end', () => {
    const body = raw ? JSON.parse(raw) : {};
    if (req.method === 'GET' && !id) return send(200, products);
    if (req.method === 'POST' && !id) { const p = { ...body, id: nextId++ }; products.push(p); return send(201, p); }
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      const i = products.findIndex(p => p.id === id); if (i < 0) return send(404, {});
      products[i] = { ...products[i], ...body, id }; return send(200, products[i]);
    }
    if (req.method === 'DELETE' && id) { products = products.filter(p => p.id !== id); return send(204); }
    send(405, {});
  });
}).listen(8083, () => console.log('Mock API sur http://localhost:8083'));
