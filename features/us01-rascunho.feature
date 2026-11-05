# language: pt
@US01 @RN01
Funcionalidade: Salvar rascunho automaticamente
  Como redatora
  Quero que meu texto seja salvo enquanto escrevo
  Para não perder trabalho quando a conexão cair

  @feliz @smoke
  Cenário: Criar uma edição como rascunho
    Dado que a redatora Ana está autenticada
    Quando Ana cria a edição "Informativo #42" com o texto "Novidades da semana"
    Então a edição "Informativo #42" deve estar em rascunho

  @limite
  Esquema do Cenário: Salvar a primeira versão após 30 segundos
    Dado que existe a edição "Informativo #42" em rascunho com o texto "Novidades da semana"
    E que a edição ainda não tem versões salvas
    Quando passam <segundos> segundos desde a criação da edição
    Então a edição deve ter <quantidade> versões salvas
    E o texto atual da edição deve ser "Novidades da semana"

    Exemplos:
      | segundos | quantidade |
      | 29       | 0          |
      | 30       | 1          |
      | 31       | 1          |

  @limite
  Esquema do Cenário: Manter apenas as últimas 20 versões numeradas
    Dado que existe a edição "Informativo #42" em rascunho
    E que ela já teve <anteriores> salvamentos automáticos com versões numeradas a partir de 1
    Quando ocorre o próximo salvamento automático após 30 segundos
    Então a edição deve ter <mantidas> versões salvas
    E a versão mais antiga disponível deve ser a <primeira>
    E a versão mais recente disponível deve ser a <ultima>

    Exemplos:
      | anteriores | mantidas | primeira | ultima |
      | 18         | 19       | 1        | 19     |
      | 19         | 20       | 1        | 20     |
      | 20         | 20       | 2        | 21     |

  @feliz
  Cenário: Restaurar o conteúdo sem apagar versões posteriores
    Dado que existe a edição "Informativo #42" em rascunho
    E que ela tem as seguintes versões salvas:
      | versão | texto                 |
      | 1      | Primeira notícia      |
      | 2      | Notícia revisada      |
      | 3      | Notícia com conclusão |
    Quando a redatora restaura a versão 1 da edição
    Então o texto atual da edição deve ser "Primeira notícia"
    E as versões 2 e 3 devem continuar disponíveis para restauração

  @excecao
  Cenário: Impedir a restauração de uma versão que saiu do histórico
    Dado que existe a edição "Informativo #42" em rascunho com o texto "Texto atual"
    E que ela mantém apenas as versões de 2 a 21 após 21 salvamentos automáticos
    Quando a redatora solicita a restauração da versão 1
    Então a restauração deve ser recusada porque a versão não está disponível
    E o texto atual da edição deve ser "Texto atual"
