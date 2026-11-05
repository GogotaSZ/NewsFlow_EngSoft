# Decisões e interpretação do enunciado

As histórias e os cenários estão implementados. Este arquivo registra as definições usadas para que a documentação, os testes e o domínio tenham o mesmo comportamento.

## RN01 — Periodicidade do salvamento

A tabela de regras determina salvamento automático a cada 30 segundos. O exemplo de história usa “30 segundos de inatividade”.

**Definição adotada:** salvamento periódico a cada 30 segundos a partir da criação da edição, sem depender de inatividade, seguindo a tabela de regras. Os testes avançam um relógio controlado; não há espera real.

A restauração recupera o conteúdo sem apagar as versões posteriores que continuam entre as últimas 20. Esse comportamento segue o exemplo de história do enunciado. A numeração continua crescente mesmo depois de versões antigas saírem do histórico.

## RN02 — Aprovação

A autora não pode aprovar sua edição, mesmo tendo o papel de revisora. A reprovação exige comentário não vazio e devolve a edição ao rascunho. Alterar ou restaurar o texto remove a aprovação anterior.

A autorização de envio e agendamento verifica a aprovação. Não implementa os prazos nem os segmentos das regras RN03 e RN04, que estão fora do escopo.

## RN05 — Definição de semana

O enunciado não informa quando começa a semana nem o fuso da contagem.

**Convenção adotada na implementação:** a semana começa na segunda-feira às 00h00 e termina imediatamente antes da segunda-feira seguinte, no fuso America/Sao_Paulo. Essa é uma convenção do projeto, não uma exigência expressa do enunciado. Um cenário verifica a passagem de domingo às 23h59 para segunda-feira às 00h00.

O excedente permanece em fila até a semana seguinte. Ao processar a fila, o sistema verifica novamente o limite de duas newsletters; se o assinante continuar no limite, a entrega fica para a próxima semana. E-mails transacionais não entram na contagem.

## RN07 — Quantidade de tentativas e intervalos

O enunciado informa “até 3 tentativas”, lista intervalos de 5, 15 e 45 minutos e determina falha definitiva depois da terceira tentativa. Três tentativas no total permitem apenas dois intervalos entre elas.

**Decisão aprovada na revisão:**

1. Primeira tentativa no momento inicial.
2. Segunda tentativa após 5 minutos da primeira falha temporária.
3. Terceira tentativa após mais 15 minutos da segunda falha temporária.
4. Se a terceira tentativa falhar, a entrega é marcada como falha definitiva, sem quarta tentativa.

O intervalo de **45 minutos não é utilizado**, pois seria necessário permitir uma quarta tentativa, contrariando a decisão de manter três no total. A inconsistência fica registrada aqui e no critério de aceitação da US04.

**Convenção complementar da implementação:** hard bounce remove o assinante da base e encerra imediatamente a entrega, sem novas tentativas. Soft bounce mantém o assinante na base e permite novas tentativas enquanto houver limite. Essa convenção evita continuar tentando um endereço identificado como permanentemente inválido.

Os cenários cobrem os dois lados das fronteiras: 4/5/6 minutos para a segunda tentativa e 14/15/16 minutos para a terceira.

## Rastreabilidade

| História | Regra | Arquivo de cenários | Implementação dos passos |
| --- | --- | --- | --- |
| US01 | RN01 | features/us01-rascunho.feature | features/step_definitions/rascunho.steps.js |
| US02 | RN02 | features/us02-aprovacao.feature | features/step_definitions/aprovacao.steps.js |
| US03 | RN05 | features/us03-frequencia.feature | features/step_definitions/frequencia.steps.js |
| US04 | RN07 | features/us04-falha-entrega.feature | features/step_definitions/entrega.steps.js |

O domínio está em src/newsflow.js. Cada cenário recebe um serviço e um relógio próprios por meio do World, sem estado global compartilhado.
