// Execute sem outro servidor/teste aberto: altera a regra só durante esta verificação.
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const raiz = path.resolve(__dirname, '..')
const arquivo = path.join(raiz, 'src/newsflow.js')
const original = fs.readFileSync(arquivo, 'utf8')
const regra = 'if (edicao.autora === revisora.nome) {'
if (!original.includes(regra)) throw new Error('Regra não encontrada; nenhum arquivo foi alterado.')
let resultado
try {
  fs.writeFileSync(arquivo, original.replace(regra, 'if (false) { // defeito temporário do antiteste'))
  resultado = spawnSync(process.execPath, [
    require.resolve('@playwright/test/cli'), 'test', '-g', 'C2', '--reporter=list'
  ], { cwd: raiz, encoding: 'utf8', timeout: 60_000, env: { ...process.env, FORCE_COLOR: '0' } })
} finally {
  fs.writeFileSync(arquivo, original)
}
const saida = (resultado.stdout || '') + (resultado.stderr || '')
fs.mkdirSync(path.join(raiz, 'relatorios'), { recursive: true })
fs.writeFileSync(path.join(raiz, 'relatorios/antiteste.txt'),
  'Regra removida temporariamente: bloqueio de autoaprovação.\n' +
  'O arquivo original foi restaurado ao término da execução.\n\n' + saida)
process.stdout.write(saida)
if (resultado.status !== 1 || !saida.includes('A autora não pode aprovar a própria edição.') ||
    !saida.includes('toHaveText')) {
  throw new Error('A execução não demonstrou a falha de comportamento esperada. Consulte o log.')
}
console.log('Antiteste confirmado: C2 detectou o defeito; regra original restaurada.')
