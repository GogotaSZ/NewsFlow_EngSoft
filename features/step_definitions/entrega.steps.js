const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a edição aprovada {string} aguarda entrega para Carla', function (titulo) {
  this.edicao = this.criarEdicaoAprovada(titulo)
  this.entrega = this.servico.prepararEntrega(this.edicao, this.assinante)
})

Given('que a primeira tentativa de entrega para Carla teve uma falha temporária', function () {
  this.falharTemporariamente(1)
})

Given('que chegou o momento da segunda tentativa', function () {
  assert.equal(this.entrega.tentativas.length, 1)
  this.servico.avancarRelogio(this.entrega.proximaTentativa - this.servico.agora)
})

When('a segunda tentativa entrega a edição {string} para Carla com sucesso', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.resultado = this.servico.tentarEntrega(this.entrega, 'sucesso')
  assert.equal(this.resultado.sucesso, true)
})

Then('a entrega deve estar marcada como concluída após {int} tentativas', function (quantidade) {
  assert.equal(this.entrega.estado, 'concluída')
  assert.equal(this.entrega.tentativas.length, quantidade)
  assert.equal(this.assinante.recebimentos.filter(item => item.edicao === this.edicao).length, 1)
})

Then('não deve haver novas tentativas previstas para essa entrega', function () {
  assert.equal(this.entrega.proximaTentativa, null)
})

Given('que as {int} primeiras tentativas de entrega para Carla tiveram falhas temporárias', function (quantidade) {
  this.falharTemporariamente(quantidade)
})

Given('que chegou o momento da terceira tentativa', function () {
  assert.equal(this.entrega.tentativas.length, 2)
  this.servico.avancarRelogio(this.entrega.proximaTentativa - this.servico.agora)
})

When('a terceira tentativa de entrega para Carla também tem uma falha temporária', function () {
  this.resultado = this.servico.tentarEntrega(this.entrega, 'soft bounce')
  assert.equal(this.resultado.sucesso, true)
})

Then('a entrega deve estar marcada como falha definitiva após {int} tentativas', function (quantidade) {
  assert.equal(this.entrega.estado, 'falha definitiva')
  assert.equal(this.entrega.tentativas.length, quantidade)
})

Then('Carla deve continuar na base de assinantes', function () {
  assert.equal(this.assinante.ativa, true)
  assert.ok(this.servico.assinantes.includes(this.assinante))
})

When('a primeira tentativa de entrega para Carla resulta em uma falha permanente de endereço', function () {
  this.resultado = this.servico.tentarEntrega(this.entrega, 'hard bounce')
})

Then('Carla deve ser removida da base de assinantes', function () {
  assert.equal(this.assinante.ativa, false)
  assert.equal(this.servico.assinantes.includes(this.assinante), false)
})

When('a primeira tentativa de entrega para Carla resulta em uma falha temporária', function () {
  this.resultado = this.servico.tentarEntrega(this.entrega, 'soft bounce')
})

Then('a entrega não deve estar marcada como falha definitiva', function () {
  assert.equal(this.entrega.estado, 'aguardando nova tentativa')
  assert.equal(this.entrega.tentativas.length, 1)
  assert.ok(this.entrega.proximaTentativa > this.servico.agora)
})

Given('que a entrega para Carla foi marcada como falha definitiva após {int} tentativas sem sucesso', function (quantidade) {
  this.falharTemporariamente(quantidade)
  assert.equal(this.entrega.estado, 'falha definitiva')
})

When('o sistema processa novamente as entregas pendentes', function () {
  this.servico.processarEntregas()
})

Then('a entrega para Carla deve continuar com {int} tentativas', function (quantidade) {
  assert.equal(this.entrega.tentativas.length, quantidade)
})

Then('a entrega deve continuar marcada como falha definitiva', function () {
  assert.equal(this.entrega.estado, 'falha definitiva')
})

Given('que a entrega já teve {int} tentativas com falhas temporárias', function (quantidade) {
  this.falharTemporariamente(quantidade)
  this.ultimaTentativaEm = this.entrega.tentativas.at(-1).realizadaEm
  this.tentativasAntes = this.entrega.tentativas.length
})

When('passam {int} minutos desde a última tentativa e o sistema processa as entregas', function (minutos) {
  this.servico.avancarRelogio(minutos * 60_000)
  this.servico.processarEntregas()
})

Then('a entrega deve ter {int} tentativas registradas', function (quantidade) {
  assert.equal(this.entrega.tentativas.length, quantidade)
  if (quantidade > this.tentativasAntes) {
    assert.equal(this.entrega.estado, 'concluída')
    assert.ok(this.entrega.tentativas.at(-1).realizadaEm > this.ultimaTentativaEm)
  } else {
    assert.equal(this.entrega.estado, 'aguardando nova tentativa')
  }
})

Then('a entrega deve estar marcada como falha definitiva após o hard bounce', function () {
  assert.equal(this.entrega.estado, 'falha definitiva')
  assert.equal(this.entrega.tentativas.length, 1)
})
