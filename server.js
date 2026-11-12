const http = require('node:http')
const fs = require('node:fs/promises')
const path = require('node:path')

const arquivos = {
  '/': ['public/index.html', 'text/html'],
  '/app.js': ['public/app.js', 'text/javascript'],
  '/style.css': ['public/style.css', 'text/css'],
  '/newsflow.js': ['src/newsflow.js', 'text/javascript']
}
http.createServer(async (req, res) => {
  const arquivo = arquivos[new URL(req.url, 'http://localhost').pathname]
  if (!arquivo || !['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(404).end('Não encontrado')
    return
  }
  try {
    const conteudo = await fs.readFile(path.join(__dirname, arquivo[0]))
    res.writeHead(200, { 'Content-Type': arquivo[1] + '; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(req.method === 'HEAD' ? undefined : conteudo)
  } catch {
    res.writeHead(500).end('Não foi possível abrir o aplicativo')
  }
}).listen(5173, '127.0.0.1', () => console.log('NewsFlow: http://127.0.0.1:5173'))
