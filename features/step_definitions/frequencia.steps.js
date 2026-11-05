const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a assinante Carla está ativa na lista de newsletters', function () {
  this.assinante = this.servico.cadastrarAssinante('Carla')
})

Given('que Carla já recebeu {int} newsletter(s) na semana atual', function (quantidade) {
  this.receberNewsletters(quantidade)
})

Given('que a edição aprovada {string} aguarda envio para Carla', function (titulo) {
  this.edicao = this.criarEdicaoAprovada(titulo)
})

When('chega o momento de enviar a edição {string} para Carla', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.resultado = this.servico.enviarNewsletter(this.edicao, this.assinante)
})

Then(/^a entrega dessa edição para Carla deve ficar (entregue|na fila da semana seguinte)$/, function (estado) {
  assert.equal(this.resultado.estado, estado)
  const recebidas = this.assinante.recebimentos.filter(item => item.edicao === this.edicao)
  const enfileiradas = this.servico.fila.filter(item => item.edicao === this.edicao)
  assert.equal(recebidas.length, estado === 'entregue' ? 1 : 0)
  assert.equal(enfileiradas.length, estado === 'entregue' ? 0 : 1)
})

Then('Carla deve ter recebido {int} newsletter(s) na semana atual', function (quantidade) {
  assert.equal(this.servico.quantidadeNewsletters(this.assinante), quantidade)
})

Given('que Carla recebeu {int} newsletters na semana anterior', function (quantidade) {
  // A data inicial do World é uma quarta-feira; avançar sete dias mantém o mesmo horário.
  this.receberNewsletters(quantidade)
  this.inicioSemanaAnterior = this.servico.agora
})

Given('que a edição aprovada {string} ficou na fila desta semana por exceder aquele limite', function (titulo) {
  this.edicao = this.criarEdicaoAprovada(titulo)
  const resultado = this.servico.enviarNewsletter(this.edicao, this.assinante)
  assert.equal(resultado.estado, 'na fila da semana seguinte')
  this.servico.avancarRelogio(7 * 24 * 60 * 60 * 1000)
})

Given('que Carla ainda não recebeu newsletters na semana atual', function () {
  assert.equal(this.servico.quantidadeNewsletters(this.assinante), 0)
})

When('o sistema processa a fila de newsletters da semana atual', function () {
  this.servico.processarFila()
})

Then('a edição {string} deve ser entregue a Carla', function (titulo) {
  assert.ok(this.assinante.recebimentos.some(item =>
    item.tipo === 'newsletter' && item.edicao.titulo === titulo))
})

Then('a edição {string} não deve mais estar na fila de Carla', function (titulo) {
  assert.equal(this.servico.fila.some(item =>
    item.edicao.titulo === titulo && item.assinante === this.assinante), false)
})

Given('que Carla também recebeu {int} e-mails transacionais na semana atual', function (quantidade) {
  for (let numero = 0; numero < quantidade; numero++) {
    this.servico.enviarTransacional(this.assinante, 'Confirmação ' + numero)
  }
})

When('uma compra de Carla gera um e-mail transacional de recibo', function () {
  this.resultado = this.servico.enviarTransacional(this.assinante, 'Recibo')
})

Then('o recibo deve ser entregue a Carla', function () {
  assert.equal(this.resultado.estado, 'entregue')
  assert.ok(this.assinante.recebimentos.some(item =>
    item.tipo === 'transacional' && item.assunto === 'Recibo'))
})

Given('que Carla já recebeu 1 newsletter no domingo às 23h59 em São Paulo', function () {
  // Domingo 08/11/2026. Ajuste do relógio inicial antes de preparar o histórico.
  this.servico.agora = new Date('2026-11-08T23:59:00-03:00').getTime()
  this.receberNewsletters(1)
})

When('o relógio chega à segunda-feira às 00h00 em São Paulo', function () {
  this.avancarSegundos(60)
})

Then('a contagem semanal de Carla deve ser {int}', function (quantidade) {
  assert.equal(this.servico.quantidadeNewsletters(this.assinante), quantidade)
})

When('o sistema processa a fila ainda na mesma semana', function () {
  this.servico.processarFila()
})

Then('a edição {string} deve continuar na fila da semana seguinte para Carla', function (titulo) {
  assert.ok(this.servico.fila.some(item =>
    item.edicao.titulo === titulo && item.assinante === this.assinante))
  assert.equal(this.assinante.recebimentos.some(item => item.edicao.titulo === titulo), false)
})


Given('que a edição aprovada {string} está na fila da semana seguinte para Carla', function (titulo) {
  this.edicao = this.criarEdicaoAprovada(titulo)
  const resultado = this.servico.enviarNewsletter(this.edicao, this.assinante)
  assert.equal(resultado.estado, 'na fila da semana seguinte')
})
