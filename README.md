# NewsFlow — Testes de aceitação com Cucumber.js

A suíte verifica quatro regras da plataforma de newsletters NewsFlow. Os cenários em Gherkin descrevem caminhos de sucesso, bloqueios esperados e valores de fronteira.

## Resultados

**37 cenários aprovados e 209 passos aprovados**, sem falhas ou passos indefinidos. A suíte completa também passou em paralelo, e a verificação rápida passou nos 6 cenários marcados com `@smoke`.

```text
> npm test
37 scenarios (37 passed)
209 steps (209 passed)
0m 0.250s (0m 0.104s executing your code)
```

O Cucumber gerou um relatório HTML navegável com o resultado de cada cenário e de seus passos. Abra o arquivo no navegador para consultar a execução. [Relatório de testes](relatorios/cucumber-report.html).

## O que foi testado

| História | Comportamentos verificados | Cenários |
| --- | --- | --- |
| US01 — RN01 | Criação do rascunho, salvamento aos 30 segundos, retenção das últimas 20 versões e restauração sem perda das versões posteriores. | [Rascunho](features/us01-rascunho.feature) |
| US02 — RN02 | Aprovação por outra revisora, bloqueio da autoaprovação, comentário obrigatório na reprovação e exigência de aprovação para enviar ou agendar. | [Aprovação](features/us02-aprovacao.feature) |
| US03 — RN05 | Limite de duas newsletters por semana, fila para o excedente, reinício da contagem na virada da semana e exclusão dos e-mails transacionais. | [Frequência](features/us03-frequencia.feature) |
| US04 — RN07 | Sucesso em nova tentativa, intervalos de 5 e 15 minutos, falha definitiva após três tentativas e tratamento de falhas permanentes e temporárias. | [Falhas de entrega](features/us04-falha-entrega.feature) |

Os testes usam dados em memória e um relógio controlado para verificar prazos e a virada da semana. A decisão de usar três tentativas no total na RN07 e as demais interpretações do enunciado estão documentadas junto aos critérios. [Histórias e critérios](docs/historias.md) · [Decisões da revisão](docs/revisao.md).

## Como reproduzir

Com Node.js 24 ou superior, rode na raiz do projeto:

```sh
npm ci
npm test
```

O segundo comando atualiza o relatório HTML. No PowerShell, use `npm.cmd` se a execução de `npm.ps1` estiver bloqueada.

## Fora de escopo

- **RN03 — Agendamento.** Prazos, reagendamento e cancelamento ficaram fora do recorte. A suíte cobre a autorização para agendar pela RN02.
- **RN04 — Segmentação.** A seleção de público e a deduplicação ficaram fora para concentrar os cenários no fluxo de edição e entrega.
- **RN06 — Descadastro.** O descadastro e o retorno à lista formam um fluxo separado de consentimento.
- **RN08 — Notificações push.** O recorte de entrega cobre newsletters por e-mail.
