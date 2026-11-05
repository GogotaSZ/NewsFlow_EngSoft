# language: pt
@US04 @RN07
Funcionalidade: Tratar falhas de entrega
  Como responsável pela operação
  Quero acompanhar as tentativas e o resultado das entregas de newsletters
  Para identificar os envios que falharam e evitar novas entregas a endereços removidos da base

  # A distribuição dos intervalos de 5, 15 e 45 minutos depende da definição em docs/revisao.md.
  # Os cenários abaixo verificam os resultados das tentativas, sem fixar essa distribuição.

  Contexto:
    Dado que a assinante Carla está ativa na lista de newsletters
    E que a edição aprovada "Informativo #42" aguarda entrega para Carla

  @feliz @smoke
  Cenário: Concluir a entrega na segunda tentativa
    Dado que a primeira tentativa de entrega para Carla teve uma falha temporária
    E que chegou o momento da segunda tentativa
    Quando a segunda tentativa entrega a edição "Informativo #42" para Carla com sucesso
    Então a entrega deve estar marcada como concluída após 2 tentativas
    E não deve haver novas tentativas previstas para essa entrega

  @excecao @limite
  Cenário: Marcar falha definitiva após a terceira tentativa sem sucesso
    Dado que as 2 primeiras tentativas de entrega para Carla tiveram falhas temporárias
    E que chegou o momento da terceira tentativa
    Quando a terceira tentativa de entrega para Carla também tem uma falha temporária
    Então a entrega deve estar marcada como falha definitiva após 3 tentativas
    E não deve haver novas tentativas previstas para essa entrega
    E Carla deve continuar na base de assinantes

  @excecao
  Cenário: Remover da base um assinante com falha permanente de endereço
    Quando a primeira tentativa de entrega para Carla resulta em uma falha permanente de endereço
    Então Carla deve ser removida da base de assinantes

  @excecao
  Cenário: Manter na base um assinante com falha temporária de entrega
    Quando a primeira tentativa de entrega para Carla resulta em uma falha temporária
    Então Carla deve continuar na base de assinantes
    E a entrega não deve estar marcada como falha definitiva

  @excecao @limite
  Cenário: Impedir uma quarta tentativa após a falha definitiva
    Dado que a entrega para Carla foi marcada como falha definitiva após 3 tentativas sem sucesso
    Quando o sistema processa novamente as entregas pendentes
    Então a entrega para Carla deve continuar com 3 tentativas
    E a entrega deve continuar marcada como falha definitiva
