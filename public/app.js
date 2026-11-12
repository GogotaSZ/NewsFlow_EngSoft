const app = new NewsFlow({ agora: new Date().toISOString() })
const chave = 'newsflow.edicoes.v1'
const porId = id => document.getElementById(id)
try {
  const salvas = JSON.parse(localStorage.getItem(chave) || '[]')
  if (!Array.isArray(salvas) || salvas.some(e => !e ||
    typeof e.titulo !== 'string' || typeof e.texto !== 'string' ||
    typeof e.autora !== 'string' || !Array.isArray(e.versoes) ||
    !['rascunho', 'em revisão', 'aprovada'].includes(e.estado))) throw new Error('Dados inválidos')
  app.edicoes = salvas
  for (const edicao of app.edicoes) edicao.proximoSalvamento = app.agora + 30_000
} catch {
  porId('erro').textContent = 'Não foi possível recuperar os dados salvos neste navegador.'
}
function salvar() {
  try { localStorage.setItem(chave, JSON.stringify(app.edicoes)); return true } catch {
    avisar('Não foi possível salvar neste navegador. Mantenha esta página aberta e copie seu texto.', true)
    return false
  }
}
function avisar(texto, erro = false) {
  porId('erro').textContent = erro ? texto : ''
  porId('mensagem').textContent = erro ? '' : texto
}
function elemento(tag, texto, pai) {
  const node = document.createElement(tag)
  node.textContent = texto
  pai.append(node)
  return node
}
function renderizar() {
  porId('edicoes').replaceChildren()
  porId('resumo').textContent = `${app.edicoes.length} edição(ões) · ${app.edicoes.filter(e => e.estado === 'aprovada').length} aprovada(s)`
  porId('vazio').hidden = app.edicoes.length > 0
  app.edicoes.forEach((edicao, indice) => {
    const item = elemento('li', '', porId('edicoes'))
    elemento('h3', edicao.titulo, item)
    elemento('p', `Autora: ${edicao.autora}`, item)
    elemento('span', `Estado: ${edicao.estado}`, item).className = 'badge'
    if (edicao.aprovacao) elemento('p', `Aprovada por ${edicao.aprovacao.revisora}`, item)
    if (edicao.reprovacao) elemento('p', `Comentário da revisão: ${edicao.reprovacao.comentario}`, item)
    const label = elemento('label', `Conteúdo de ${edicao.titulo}`, item)
    label.htmlFor = `texto-${indice}`
    const texto = elemento('textarea', '', item)
    texto.id = label.htmlFor
    texto.value = edicao.texto
    texto.rows = 4
    const acao = (nome, executar) => elemento('button', nome, item).onclick = executar
    acao('Salvar alterações', () => {
      app.editarTexto(edicao, texto.value)
      avisar('Alterações salvas. A edição está em rascunho e precisa de nova revisão.')
      salvar(); renderizar()
    })
    acao('Solicitar revisão', () => {
      if (texto.value !== edicao.texto) app.editarTexto(edicao, texto.value)
      app.solicitarRevisao(edicao)
      avisar('Edição enviada para revisão.'); salvar(); renderizar()
    })
    const revisar = () => ({ nome: porId('perfil').value, papeis: ['revisora'] })
    acao('Aprovar edição', () => {
      if (edicao.estado !== 'em revisão') return avisar('Solicite a revisão antes de aprovar.', true)
      const resultado = app.aprovar(edicao, revisar())
      if (!resultado.sucesso) return avisar('A autora não pode aprovar a própria edição.', true)
      avisar('Edição aprovada e liberada para envio.'); salvar(); renderizar()
    })
    const comentarioLabel = elemento('label', `Comentário para ${edicao.titulo}`, item)
    comentarioLabel.htmlFor = `comentario-${indice}`
    const comentario = elemento('input', '', item)
    comentario.id = comentarioLabel.htmlFor
    acao('Reprovar edição', () => {
      if (edicao.estado !== 'em revisão') return avisar('Solicite a revisão antes de reprovar.', true)
      const resultado = app.reprovar(edicao, revisar(), comentario.value)
      if (!resultado.sucesso) return avisar('Informe um comentário para reprovar.', true)
      avisar('Edição devolvida para ajustes.'); salvar(); renderizar()
    })
  })
}
porId('nova').onsubmit = evento => {
  evento.preventDefault()
  const titulo = porId('titulo').value.trim()
  if (!titulo) return avisar('Informe um título para criar a edição.', true)
  app.criarEdicao(titulo, porId('conteudo').value, porId('perfil').value)
  avisar('Rascunho criado com sucesso.'); salvar(); renderizar()
  porId('nova').reset()
}
renderizar()
