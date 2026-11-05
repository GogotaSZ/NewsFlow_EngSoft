const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a redatora Ana está autenticada', function () {
  this.ana.autenticada = true
})

When('Ana cria a edição {string} com o texto {string}', function (titulo, texto) {
  assert.equal(this.ana.autenticada, true)
  this.edicao = this.servico.criarEdicao(titulo, texto, this.ana.nome)
})

Given('que existe a edição {string} em rascunho com o texto {string}', function (titulo, texto) {
  this.edicao = this.servico.criarEdicao(titulo, texto)
})

Given('que existe a edição {string} em rascunho', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo)
})

Given('que a edição ainda não tem versões salvas', function () {
  assert.equal(this.edicao.versoes.length, 0)
})

When('passam {int} segundos desde a criação da edição', function (segundos) {
  this.avancarSegundos(segundos)
})

Then('a edição deve ter {int} versões salvas', function (quantidade) {
  assert.equal(this.edicao.versoes.length, quantidade)
})

Then('o texto atual da edição deve ser {string}', function (texto) {
  assert.equal(this.edicao.texto, texto)
})

Given('que ela já teve {int} salvamentos automáticos com versões numeradas a partir de 1', function (quantidade) {
  this.avancarSegundos(quantidade * 30)
  assert.equal(this.edicao.numeroVersao, quantidade)
})

When('ocorre o próximo salvamento automático após {int} segundos', function (segundos) {
  this.avancarSegundos(segundos)
})

Then('a versão mais antiga disponível deve ser a {int}', function (numero) {
  assert.equal(this.edicao.versoes[0].numero, numero)
})

Then('a versão mais recente disponível deve ser a {int}', function (numero) {
  assert.equal(this.edicao.versoes.at(-1).numero, numero)
})

Given('que ela tem as seguintes versões salvas:', function (tabela) {
  for (const linha of tabela.hashes()) {
    this.servico.editarTexto(this.edicao, linha.texto)
    this.avancarSegundos(30)
    assert.equal(this.edicao.versoes.at(-1).numero, Number(linha['versão']))
  }
  this.versoesAntes = structuredClone(this.edicao.versoes)
})

When('a redatora restaura a versão {int} da edição', function (numero) {
  this.resultado = this.servico.restaurar(this.edicao, numero)
  assert.equal(this.resultado.sucesso, true)
})

Then('as versões {int} e {int} devem continuar disponíveis para restauração', function (primeira, segunda) {
  for (const numero of [primeira, segunda]) {
    assert.deepEqual(this.edicao.versoes.find(item => item.numero === numero),
      this.versoesAntes.find(item => item.numero === numero))
  }
})

Given('que ela mantém apenas as versões de {int} a {int} após {int} salvamentos automáticos', function (primeira, ultima, quantidade) {
  this.avancarSegundos(quantidade * 30)
  assert.equal(this.edicao.versoes[0].numero, primeira)
  assert.equal(this.edicao.versoes.at(-1).numero, ultima)
})

When('a redatora solicita a restauração da versão {int}', function (numero) {
  this.resultado = this.servico.restaurar(this.edicao, numero)
})

Then('a restauração deve ser recusada porque a versão não está disponível', function () {
  assert.deepEqual(this.resultado, { sucesso: false, motivo: 'versao_indisponivel' })
})


Given('que passam {int} segundos e a redatora altera o texto para {string}', function (segundos, texto) {
  this.avancarSegundos(segundos)
  this.servico.editarTexto(this.edicao, texto)
})

Then('a versão {int} deve conter o texto {string}', function (numero, texto) {
  assert.equal(this.edicao.versoes.find(item => item.numero === numero).texto, texto)
})
