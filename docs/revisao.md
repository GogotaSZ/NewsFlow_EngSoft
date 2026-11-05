# Pontos para revisão das histórias

As histórias reproduzem as regras selecionadas e foram revisadas, com prioridade média para a RN05. Os cenários estão em primeira versão. Os pontos abaixo registram o tratamento dado às ambiguidades e o que ainda precisa ser esclarecido antes da automação.

## RN01 — Periodicidade do salvamento

A tabela de regras determina salvamento automático a cada 30 segundos. O exemplo de história usa a expressão “30 segundos de inatividade”. Esses comportamentos são diferentes quando a redatora continua digitando.

**Texto adotado na US01:** a cada 30 segundos, conforme a tabela de regras de negócio. A revisão deve confirmar se o tempo depende de inatividade.

A restauração sem apagar versões posteriores foi mantida por constar no exemplo de história do próprio enunciado. Ela respeita o limite das últimas 20 versões.

## RN05 — Definição de semana

A regra define o limite de duas newsletters por semana, mas não informa quando a semana começa nem qual fuso deve ser usado nessa contagem.

**A definir:** início e término da semana e fuso da contagem. Essas definições serão necessárias para os cenários que atravessam a mudança de semana.

**Tratamento nos cenários:** os dados informam explicitamente a semana atual, a anterior e a seguinte. O cenário de fila já começa na semana seguinte à retenção, sem assumir uma data ou um fuso para a virada. A automação dessa fronteira de calendário dependerá da definição acima.

## RN07 — Quantidade de tentativas e intervalos

A regra informa “até 3 tentativas”, lista os intervalos de 5, 15 e 45 minutos e determina falha definitiva depois da terceira tentativa. Três tentativas no total têm apenas dois intervalos entre elas; três novas tentativas após o envio inicial totalizam quatro tentativas.

**Texto adotado na US04:** os números foram preservados como aparecem no enunciado, sem escolher silenciosamente uma interpretação.

**A definir:** se o envio inicial conta como a primeira tentativa e como os três intervalos se aplicam à sequência de entregas. O critério de intervalos será ajustado após essa definição.

A regra também não explicita se um hard bounce encerra imediatamente as tentativas da entrega atual. A remoção do assinante da base está prevista na história; o comportamento da entrega em andamento precisa ser confirmado antes da automação.

**Tratamento nos cenários:** a terceira tentativa sem sucesso encerra a entrega, conforme o texto da regra. Os cenários não fixam os intervalos entre tentativas; essa cobertura está pendente da definição acima. O cenário de hard bounce verifica a remoção da base, sem assumir o destino das tentativas da entrega atual.

## Cobertura da primeira versão dos cenários

| História | Comportamentos descritos | Ponto ainda pendente |
| --- | --- | --- |
| US01 — RN01 | Criação em rascunho, fronteira de 30 segundos, numeração e retenção de 20 versões, restauração e versão indisponível | Confirmar periodicidade em relação à inatividade |
| US02 — RN02 | Aprovação por outra revisora, bloqueio da autora, reprovação com e sem comentário, bloqueio de envio e agendamento sem aprovação | Nenhum ponto adicional identificado |
| US03 — RN05 | Limite semanal, fila da semana seguinte e tratamento de e-mails transacionais | Definir a fronteira de calendário da semana |
| US04 — RN07 | Sucesso na segunda tentativa, falha definitiva na terceira, bloqueio da quarta, hard bounce e soft bounce | Distribuir os intervalos e definir o efeito do hard bounce nas tentativas atuais |

Os cenários de aprovação verificam apenas o bloqueio de envio e agendamento pela RN02. As regras de antecedência, segmentos e execução do agendamento continuam fora do escopo.
