const MINUTO = 60_000
const INTERVALO_SALVAMENTO = 30_000
const INTERVALOS_ENTRE_TENTATIVAS = [5 * MINUTO, 15 * MINUTO]

// A semana começa na segunda-feira, no calendário de America/Sao_Paulo.
function semanaDaData(instante) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(instante))
  const valor = tipo => partes.find(parte => parte.type === tipo).value
  const dia = new Date(Date.UTC(+valor('year'), +valor('month') - 1, +valor('day')))
  dia.setUTCDate(dia.getUTCDate() - (dia.getUTCDay() + 6) % 7)
  return dia.toISOString().slice(0, 10)
}

function semanaSeguinte(semana) {
  const dia = new Date(semana + 'T00:00:00Z')
  dia.setUTCDate(dia.getUTCDate() + 7)
  return dia.toISOString().slice(0, 10)
}

class NewsFlow {
  constructor({ agora = '2026-11-04T12:00:00-03:00', transportar = () => 'sucesso' } = {}) {
    this.agora = new Date(agora).getTime()
    this.transportar = transportar
    this.edicoes = []
    this.assinantes = []
    this.entregas = []
    this.fila = []
  }

  criarEdicao(titulo, texto = '', autora = 'Ana') {
    const edicao = {
      titulo, texto, autora, estado: 'rascunho', versoes: [], numeroVersao: 0,
      proximoSalvamento: this.agora + INTERVALO_SALVAMENTO,
      aprovacao: null, reprovacao: null
    }
    this.edicoes.push(edicao)
    return edicao
  }

  editarTexto(edicao, texto) {
    edicao.texto = texto
    edicao.estado = 'rascunho'
    edicao.aprovacao = null
  }

  avancarRelogio(milissegundos) {
    if (milissegundos < 0) throw new Error('O relógio não pode voltar no tempo')
    const destino = this.agora + milissegundos
    for (const edicao of this.edicoes) {
      while (edicao.proximoSalvamento <= destino) {
        if (edicao.estado === 'rascunho') {
          edicao.versoes.push({
            numero: ++edicao.numeroVersao,
            texto: edicao.texto,
            salvaEm: edicao.proximoSalvamento
          })
          edicao.versoes = edicao.versoes.slice(-20)
        }
        edicao.proximoSalvamento += INTERVALO_SALVAMENTO
      }
    }
    this.agora = destino
  }

  restaurar(edicao, numero) {
    const versao = edicao.versoes.find(item => item.numero === numero)
    if (!versao) return { sucesso: false, motivo: 'versao_indisponivel' }
    this.editarTexto(edicao, versao.texto)
    return { sucesso: true }
  }

  solicitarRevisao(edicao) {
    edicao.estado = 'em revisão'
    edicao.aprovacao = null
  }

  aprovar(edicao, revisora) {
    if (!revisora.papeis.includes('revisora')) {
      return { sucesso: false, motivo: 'papel_invalido' }
    }
    if (edicao.autora === revisora.nome) {
      return { sucesso: false, motivo: 'autora_da_edicao' }
    }
    edicao.estado = 'aprovada'
    edicao.aprovacao = { revisora: revisora.nome, aprovadaEm: this.agora }
    edicao.reprovacao = null
    return { sucesso: true }
  }

  reprovar(edicao, revisora, comentario) {
    if (!revisora.papeis.includes('revisora')) {
      return { sucesso: false, motivo: 'papel_invalido' }
    }
    if (!comentario || !comentario.trim()) {
      return { sucesso: false, motivo: 'comentario_obrigatorio' }
    }
    edicao.estado = 'rascunho'
    edicao.aprovacao = null
    edicao.reprovacao = { revisora: revisora.nome, comentario: comentario.trim() }
    return { sucesso: true }
  }

  solicitarDisparo(edicao, operacao) {
    if (!['envio', 'agendamento'].includes(operacao)) {
      throw new Error('Operação desconhecida')
    }
    if (edicao.estado !== 'aprovada' || !edicao.aprovacao) {
      return { sucesso: false, motivo: 'aprovacao_obrigatoria' }
    }
    // Autoriza pela RN02; regras de segmentos e agendamento estão fora do escopo.
    return { sucesso: true, operacao }
  }

  cadastrarAssinante(nome) {
    const assinante = { nome, ativa: true, recebimentos: [] }
    this.assinantes.push(assinante)
    return assinante
  }

  quantidadeNewsletters(assinante, instante = this.agora) {
    const semana = semanaDaData(instante)
    return assinante.recebimentos.filter(item =>
      item.tipo === 'newsletter' && semanaDaData(item.recebidaEm) === semana
    ).length
  }

  enviarNewsletter(edicao, assinante) {
    const autorizacao = this.solicitarDisparo(edicao, 'envio')
    if (!autorizacao.sucesso) return autorizacao
    if (!assinante.ativa) return { sucesso: false, motivo: 'assinante_inativa' }
    if (this.quantidadeNewsletters(assinante) >= 2) {
      const existente = this.fila.find(item => item.edicao === edicao && item.assinante === assinante)
      if (!existente) {
        this.fila.push({ edicao, assinante, semana: semanaSeguinte(semanaDaData(this.agora)) })
      }
      return { sucesso: true, estado: 'na fila da semana seguinte' }
    }
    assinante.recebimentos.push({ tipo: 'newsletter', edicao, recebidaEm: this.agora })
    return { sucesso: true, estado: 'entregue' }
  }

  enviarTransacional(assinante, assunto) {
    assinante.recebimentos.push({ tipo: 'transacional', assunto, recebidaEm: this.agora })
    return { sucesso: true, estado: 'entregue', assunto }
  }

  processarFila() {
    const semana = semanaDaData(this.agora)
    const pendentes = this.fila
    this.fila = []
    for (const item of pendentes) {
      if (item.semana > semana) {
        this.fila.push(item)
      } else {
        this.enviarNewsletter(item.edicao, item.assinante)
      }
    }
  }

  prepararEntrega(edicao, assinante) {
    const entrega = {
      edicao, assinante, tentativas: [], estado: 'pendente', proximaTentativa: this.agora
    }
    this.entregas.push(entrega)
    return entrega
  }

  tentarEntrega(entrega, resultado) {
    if (['concluída', 'falha definitiva'].includes(entrega.estado)) {
      return { sucesso: false, motivo: 'entrega_encerrada' }
    }
    if (this.agora < entrega.proximaTentativa) {
      return { sucesso: false, motivo: 'aguardar_intervalo' }
    }
    if (!entrega.assinante.ativa) {
      entrega.estado = 'falha definitiva'
      entrega.proximaTentativa = null
      return { sucesso: false, motivo: 'assinante_inativa' }
    }
    const autorizacao = this.solicitarDisparo(entrega.edicao, 'envio')
    if (!autorizacao.sucesso) return autorizacao
    if (!['sucesso', 'soft bounce', 'hard bounce'].includes(resultado)) {
      throw new Error('Resultado de entrega desconhecido')
    }
    entrega.tentativas.push({ resultado, realizadaEm: this.agora })
    const quantidade = entrega.tentativas.length
    if (resultado === 'sucesso') {
      entrega.estado = 'concluída'
      entrega.assinante.recebimentos.push({
        tipo: 'newsletter', edicao: entrega.edicao, recebidaEm: this.agora
      })
    } else if (resultado === 'hard bounce') {
      entrega.estado = 'falha definitiva'
      entrega.assinante.ativa = false
      this.assinantes = this.assinantes.filter(item => item !== entrega.assinante)
    } else if (quantidade >= 3) {
      entrega.estado = 'falha definitiva'
    } else {
      entrega.estado = 'aguardando nova tentativa'
    }
    entrega.proximaTentativa = entrega.estado === 'aguardando nova tentativa'
      ? this.agora + INTERVALOS_ENTRE_TENTATIVAS[quantidade - 1]
      : null
    return { sucesso: true, estado: entrega.estado }
  }

  processarEntregas() {
    for (const entrega of this.entregas) {
      if (entrega.proximaTentativa !== null && entrega.proximaTentativa <= this.agora) {
        this.tentarEntrega(entrega, this.transportar(entrega))
      }
    }
  }
}

module.exports = { NewsFlow, semanaDaData }
