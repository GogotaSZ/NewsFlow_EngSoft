const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que Ana é a autora da edição {string}', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, '', this.ana.nome)
})

Given('que Beatriz é revisora e não é autora dessa edição', function () {
  assert.ok(this.beatriz.papeis.includes('revisora'))
  assert.notEqual(this.edicao.autora, this.beatriz.nome)
})

Given('que a edição {string} ainda não foi aprovada', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.aprovacao, null)
})

When('Beatriz aprova a edição {string}', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.resultado = this.servico.aprovar(this.edicao, this.beatriz)
  assert.equal(this.resultado.sucesso, true)
})

Then('a edição {string} deve estar aprovada', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.estado, 'aprovada')
  assert.ok(this.edicao.aprovacao)
})

Then('a aprovação deve identificar Beatriz como revisora responsável', function () {
  assert.equal(this.edicao.aprovacao.revisora, 'Beatriz')
})

Given('que Ana também exerce o papel de revisora', function () {
  this.ana.papeis.push('revisora')
})

When('Ana tenta aprovar a edição {string}', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.resultado = this.servico.aprovar(this.edicao, this.ana)
})

Then('a aprovação deve ser recusada porque a revisora é autora da edição', function () {
  assert.deepEqual(this.resultado, { sucesso: false, motivo: 'autora_da_edicao' })
})

Then('a edição {string} deve continuar sem aprovação', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.aprovacao, null)
  assert.notEqual(this.edicao.estado, 'aprovada')
})

Given('que a edição {string} está em revisão', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.servico.solicitarRevisao(this.edicao)
})

When('Beatriz reprova a edição com o comentário {string}', function (comentario) {
  this.resultado = this.servico.reprovar(this.edicao, this.beatriz, comentario)
  assert.equal(this.resultado.sucesso, true)
})

Then('a edição {string} deve estar em rascunho', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.estado, 'rascunho')
})

Then('a reprovação deve conter o comentário {string}', function (comentario) {
  assert.equal(this.edicao.reprovacao.comentario, comentario)
  assert.equal(this.edicao.aprovacao, null)
})

When('Beatriz tenta reprovar a edição sem informar um comentário', function () {
  this.resultado = this.servico.reprovar(this.edicao, this.beatriz, '')
})

Then('a reprovação deve ser recusada porque o comentário é obrigatório', function () {
  assert.deepEqual(this.resultado, { sucesso: false, motivo: 'comentario_obrigatorio' })
})

Then('a edição {string} deve continuar em revisão', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.estado, 'em revisão')
  assert.equal(this.edicao.reprovacao, null)
})

Given('que a edição {string} está em rascunho sem aprovação', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.estado, 'rascunho')
  assert.equal(this.edicao.aprovacao, null)
})

When(/^a gestora solicita o (envio|agendamento) da edição "([^"]+)"$/, function (operacao, titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.resultado = this.servico.solicitarDisparo(this.edicao, operacao)
})

Then('a solicitação deve ser recusada porque a edição exige aprovação de um revisor', function () {
  assert.deepEqual(this.resultado, { sucesso: false, motivo: 'aprovacao_obrigatoria' })
})

Then('a edição {string} deve continuar em rascunho', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.edicao.estado, 'rascunho')
})

Given('que a edição {string} foi aprovada por Beatriz', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  assert.equal(this.servico.aprovar(this.edicao, this.beatriz).sucesso, true)
})

Then('a solicitação deve ser autorizada pela aprovação da edição', function () {
  assert.equal(this.resultado.sucesso, true)
})
