# language: pt
@US03 @RN05
Funcionalidade: Limitar o recebimento de newsletters
  Como assinante
  Quero receber no máximo duas newsletters por semana
  Para acompanhar as novidades sem receber um volume excessivo de mensagens

  Contexto:
    Dado que a assinante Carla está ativa na lista de newsletters

  @limite @smoke
  Esquema do Cenário: Aplicar o limite de duas newsletters por semana
    Dado que Carla já recebeu <anteriores> newsletters na semana atual
    E que a edição aprovada "Informativo #42" aguarda envio para Carla
    Quando chega o momento de enviar a edição "Informativo #42" para Carla
    Então a entrega dessa edição para Carla deve ficar <resultado>
    E Carla deve ter recebido <total> newsletters na semana atual

    Exemplos:
      | anteriores | resultado                    | total |
      | 0          | entregue                     | 1     |
      | 1          | entregue                     | 2     |
      | 2          | na fila da semana seguinte   | 2     |

  @feliz
  Cenário: Entregar na semana seguinte uma newsletter que excedeu o limite
    Dado que Carla recebeu 2 newsletters na semana anterior
    E que a edição aprovada "Informativo #42" ficou na fila desta semana por exceder aquele limite
    E que Carla ainda não recebeu newsletters na semana atual
    Quando o sistema processa a fila de newsletters da semana atual
    Então a edição "Informativo #42" deve ser entregue a Carla
    E Carla deve ter recebido 1 newsletter na semana atual
    E a edição "Informativo #42" não deve mais estar na fila de Carla

  @feliz
  Cenário: Desconsiderar e-mails transacionais na contagem semanal
    Dado que Carla já recebeu 1 newsletter na semana atual
    E que Carla também recebeu 3 e-mails transacionais na semana atual
    E que a edição aprovada "Informativo #42" aguarda envio para Carla
    Quando chega o momento de enviar a edição "Informativo #42" para Carla
    Então a edição "Informativo #42" deve ser entregue a Carla
    E Carla deve ter recebido 2 newsletters na semana atual

  @excecao
  Cenário: Entregar um recibo mesmo após atingir o limite de newsletters
    Dado que Carla já recebeu 2 newsletters na semana atual
    Quando uma compra de Carla gera um e-mail transacional de recibo
    Então o recibo deve ser entregue a Carla
    E Carla deve ter recebido 2 newsletters na semana atual

  @limite
  Cenário: Reiniciar a contagem na virada da semana em São Paulo
    Dado que Carla já recebeu 1 newsletter no domingo às 23h59 em São Paulo
    Quando o relógio chega à segunda-feira às 00h00 em São Paulo
    Então a contagem semanal de Carla deve ser 0

  @excecao
  Cenário: Manter o excedente na fila até a semana seguinte
    Dado que Carla já recebeu 2 newsletters na semana atual
    E que a edição aprovada "Informativo #42" está na fila da semana seguinte para Carla
    Quando o sistema processa a fila ainda na mesma semana
    Então a edição "Informativo #42" deve continuar na fila da semana seguinte para Carla
    E Carla deve ter recebido 2 newsletters na semana atual
