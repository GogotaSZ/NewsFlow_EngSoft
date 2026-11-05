# language: pt
@US02 @RN02
Funcionalidade: Revisar edição antes do envio
  Como revisora
  Quero aprovar ou reprovar uma edição antes do envio
  Para impedir que conteúdos sem revisão sejam enviados aos assinantes

  Contexto:
    Dado que Ana é a autora da edição "Informativo #42"
    E que Beatriz é revisora e não é autora dessa edição

  @feliz @smoke
  Cenário: Aprovar uma edição por uma revisora diferente da autora
    Dado que a edição "Informativo #42" ainda não foi aprovada
    Quando Beatriz aprova a edição "Informativo #42"
    Então a edição "Informativo #42" deve estar aprovada
    E a aprovação deve identificar Beatriz como revisora responsável

  @excecao
  Cenário: Impedir que a autora aprove a própria edição
    Dado que Ana também exerce o papel de revisora
    E que a edição "Informativo #42" ainda não foi aprovada
    Quando Ana tenta aprovar a edição "Informativo #42"
    Então a aprovação deve ser recusada porque a revisora é autora da edição
    E a edição "Informativo #42" deve continuar sem aprovação

  @feliz
  Cenário: Devolver ao rascunho uma edição reprovada com comentário
    Dado que a edição "Informativo #42" está em revisão
    Quando Beatriz reprova a edição com o comentário "Corrigir a data de manutenção"
    Então a edição "Informativo #42" deve estar em rascunho
    E a reprovação deve conter o comentário "Corrigir a data de manutenção"

  @excecao
  Cenário: Impedir a reprovação sem comentário
    Dado que a edição "Informativo #42" está em revisão
    Quando Beatriz tenta reprovar a edição sem informar um comentário
    Então a reprovação deve ser recusada porque o comentário é obrigatório
    E a edição "Informativo #42" deve continuar em revisão

  @excecao
  Esquema do Cenário: Impedir envio e agendamento sem aprovação
    Dado que a edição "Informativo #42" está em rascunho sem aprovação
    Quando a gestora solicita o <operacao> da edição "Informativo #42"
    Então a solicitação deve ser recusada porque a edição exige aprovação de um revisor
    E a edição "Informativo #42" deve continuar em rascunho

    Exemplos:
      | operacao    |
      | envio       |
      | agendamento |
