# NewsFlow — Prática de BDD com Cucumber.js

Exercício de histórias de usuário, cenários Gherkin e automação de testes para o NewsFlow, plataforma de newsletters e notificações da Vértice.

As quatro histórias estão automatizadas em um domínio em memória: não é necessário configurar servidor, banco de dados ou envio real de e-mails.

## Como executar

Requisito: Node.js 24 ou superior, compatível com a versão instalada do Cucumber.js, e npm.

1. Abra o terminal na pasta do projeto.
2. Execute `npm install` para instalar as dependências.
3. Execute `npm test` para rodar a suíte e gerar o relatório.
4. Abra [relatorios/cucumber-report.html](relatorios/cucumber-report.html) no navegador.

No PowerShell, se houver bloqueio do script npm.ps1, use `npm.cmd` no lugar de `npm`. Para instalar as versões exatas do package-lock.json, use `npm ci`.

## Verificações adicionais

| Comando | Objetivo |
| --- | --- |
| `npm run test:dry` | Verificar os cenários e a existência dos steps sem executar o domínio |
| `npm run test:parallel` | Executar a suíte com dois processos para conferir a independência dos cenários |
| `npm run test:smoke` | Executar somente os cenários marcados com @smoke |

No dry-run, cenários e passos aparecem como skipped porque não são executados. Não há passos undefined ou pending. Os comandos adicionais usam um perfil sem relatório para preservar o relatório da suíte completa.

## Resultado da suíte

Execução validada em 04/11/2026 com `npm test`:

```text
> newsflow_engsoft@1.0.0 test
> cucumber-js

37 scenarios (37 passed)
209 steps (209 passed)
0m 0.250s (0m 0.104s executing your code)
```

Os tempos variam entre execuções. A execução em paralelo também passou nos 37 cenários; o smoke passou em 6 cenários e 34 passos.

O [relatório HTML](relatorios/cucumber-report.html) acompanha o projeto e é atualizado a cada execução de `npm test`. Ele deve ser incluído no commit de entrega.

## Organização do repositório

```text
NewsFlow_EngSoft/
├── cucumber.js
├── package.json
├── package-lock.json
├── README.md
├── docs/
│   ├── historias.md
│   └── revisao.md
├── src/
│   └── newsflow.js
├── features/
│   ├── us01-rascunho.feature
│   ├── us02-aprovacao.feature
│   ├── us03-frequencia.feature
│   ├── us04-falha-entrega.feature
│   ├── step_definitions/
│   │   ├── rascunho.steps.js
│   │   ├── aprovacao.steps.js
│   │   ├── frequencia.steps.js
│   │   └── entrega.steps.js
│   └── support/
│       └── world.js
└── relatorios/
    └── cucumber-report.html
```

As pastas de suporte e relatórios podem conter arquivos .gitkeep remanescentes da organização inicial.

## Histórias selecionadas

As regras mantêm os IDs do enunciado; as histórias são numeradas de US01 a US04.

| História | Título | Regra coberta | Prioridade |
| --- | --- | --- | --- |
| US01 | Salvar rascunho automaticamente | RN01 — Rascunho | Alta |
| US02 | Revisar edição antes do envio | RN02 — Aprovação | Alta |
| US03 | Limitar o recebimento de newsletters | RN05 — Frequência | Média |
| US04 | Tratar falhas de entrega | RN07 — Falha de entrega | Alta |

Leia os critérios em [docs/historias.md](docs/historias.md) e as definições em [docs/revisao.md](docs/revisao.md).

## Decisões de negócio

- **RN01:** salvamento a cada 30 segundos, sem exigir inatividade, mantendo as últimas 20 versões.
- **RN05:** contagem semanal de segunda-feira a domingo no fuso America/Sao_Paulo, com limite de duas newsletters e exclusão dos e-mails transacionais.
- **RN07:** três tentativas no total, com intervalos de 5 e 15 minutos; os 45 minutos citados no enunciado foram desconsiderados por decisão da revisão, pois exigiriam uma quarta tentativa.
- **Hard bounce:** remoção da base e encerramento imediato da entrega; soft bounce mantém o assinante.

Os cenários avançam um relógio em memória, sem sleep fixo. Cada World cria um novo serviço para evitar dependência entre cenários. O transporte de e-mails é simulado no domínio; não há integração com provedor externo.

## Fora de escopo

- **RN03 — Agendamento:** antecedência mínima, fuso do agendamento, reagendamento e cancelamento ficam fora para concentrar o trabalho nas quatro regras selecionadas. A RN02 verifica apenas a exigência de aprovação para autorizar agendamento.
- **RN04 — Segmentação:** seleção de segmentos e eliminação de destinatários duplicados ficam fora para manter o recorte nas regras de conteúdo, aprovação e entrega.
- **RN06 — Descadastro:** saída da lista e retorno por duplo opt-in formam um fluxo próprio de consentimento, não desenvolvido neste exercício.
- **RN08 — Notificação:** janela de silêncio e limite diário de push ficam fora porque o recorte de entrega adotado trata de newsletters por e-mail.

## Checklist da implementação

- [x] Quatro histórias com papel, objetivo, benefício, regras, prioridade e 3 a 5 critérios.
- [x] Um arquivo .feature em português por história, com sucesso e exceção.
- [x] Esquemas com exemplos nas fronteiras de tempo, versões, frequência e novas tentativas.
- [x] Steps implementados e reutilizados, sem passos pendentes.
- [x] Estado isolado no World e relógio controlado.
- [x] Dry-run sem passos indefinidos e suíte verde.
- [x] Execução em paralelo e smoke validados.
- [x] Instalação limpa com npm ci e nova execução da suíte validadas.
- [x] Relatório HTML gerado na pasta relatorios.
- [x] README com execução, resultado, decisões e fora de escopo.

Para entregar, inclua o código, a documentação, package-lock.json e o relatório HTML no repositório Git. A pasta node_modules está ignorada e não deve ser versionada.
