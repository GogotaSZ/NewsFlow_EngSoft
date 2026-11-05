const { setWorldConstructor } = require('@cucumber/cucumber')
const { NewsFlow } = require('../../src/newsflow')

class MundoDoNewsFlow {
  constructor() {
    this.servico = new NewsFlow()
    this.edicao = null
    this.assinante = null
    this.entrega = null
    this.resultado = null
    this.ana = { nome: 'Ana', papeis: ['redatora'] }
    this.beatriz = { nome: 'Beatriz', papeis: ['revisora'] }
  }

  avancarSegundos(segundos) {
    this.servico.avancarRelogio(segundos * 1000)
  }

  criarEdicaoAprovada(titulo) {
    const edicao = this.servico.criarEdicao(titulo)
    this.servico.aprovar(edicao, this.beatriz)
    return edicao
  }

  receberNewsletters(quantidade) {
    for (let numero = 0; numero < quantidade; numero++) {
      const edicao = this.criarEdicaoAprovada('Edição anterior ' + (numero + 1))
      const resultado = this.servico.enviarNewsletter(edicao, this.assinante)
      if (resultado.estado !== 'entregue') throw new Error('Pré-condição excede o limite semanal')
    }
  }

  falharTemporariamente(quantidade) {
    for (let numero = 0; numero < quantidade; numero++) {
      if (this.entrega.proximaTentativa === null) throw new Error('Entrega já encerrada')
      this.servico.avancarRelogio(this.entrega.proximaTentativa - this.servico.agora)
      this.servico.tentarEntrega(this.entrega, 'soft bounce')
    }
  }
}

setWorldConstructor(MundoDoNewsFlow)
