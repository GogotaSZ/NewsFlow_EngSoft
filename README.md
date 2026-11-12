# NewsFlow — Testes de aceitação com Cucumber.js e Playwright

## Parte 2 — Aplicação e testes no navegador

A interface permite criar e editar rascunhos, solicitar revisão, bloquear autoaprovação, aprovar com outra revisora e reprovar com comentário. Os dados são persistidos localmente no navegador. Os perfis são simulados e não há envio real de e-mails.

```sh
npm ci
npx playwright install chromium
npx playwright test
npx playwright show-report
```

O Playwright inicia e encerra o app automaticamente. Para usar a interface manualmente, rode `npm start` e abra <http://127.0.0.1:5173>. Deixe a porta livre antes de executar a suíte.

Os três cenários verificam aprovação por outra revisora, bloqueio de autoaprovação e persistência do conteúdo editado. Veja os critérios, comandos e limites da entrega em [ACEITACAO.md](ACEITACAO.md).

**Validação: 3 testes aprovados em 4,4 segundos**, também aprovados individualmente. [Relatório Playwright com capturas](relatorios/playwright/index.html). O antiteste confirmou que a remoção do bloqueio de autoaprovação faz C2 falhar; a regra foi restaurada antes da execução final.

## Roteiro para apresentar ao professor (cerca de 5 minutos)

### 1. Apresentar o objetivo

> O NewsFlow organiza a criação e revisão de newsletters. Nesta etapa, usamos Playwright para comprovar, pelo navegador, que os principais comportamentos da interface funcionam.

### 2. Demonstrar o aplicativo

Na raiz do projeto, abra um terminal PowerShell e execute:

```powershell
npm.cmd start
```

Abra [o aplicativo local](http://127.0.0.1:5173) e faça o seguinte:

1. Com o perfil **Ana**, preencha o título e o conteúdo e clique em **Criar rascunho**.
2. Altere o conteúdo da edição, clique em **Salvar alterações** e recarregue a página. Mostre que o texto permaneceu salvo.
3. Clique em **Solicitar revisão** e depois em **Aprovar edição**, ainda como Ana. Mostre o alerta que impede a autoaprovação e o estado **em revisão**.
4. Troque o **Perfil ativo** para **Beatriz** e clique em **Aprovar edição**. Mostre o estado **aprovada** e a identificação da revisora.

### 3. Executar os três testes

Encerre o servidor manual com `Ctrl+C` no terminal anterior para liberar a porta 5173. Depois execute:

```powershell
npx.cmd playwright test
```

O Playwright sobe o app sozinho, executa os testes e encerra o servidor. Explique o que cada cenário comprova:

| Cenário | Tipo | Comportamento verificado |
| --- | --- | --- |
| C1 | Caminho principal | Criar uma edição, solicitar revisão e obter aprovação de outra revisora. |
| C2 | Regra que barra erro | Impedir que a autora aprove a própria edição, mantendo a revisão pendente. |
| C3 | Regra de estado | Manter o título, o conteúdo editado e o estado do rascunho após recarregar. |

Cada teste usa seletores por papel, rótulo ou texto, possui várias asserções e roda independentemente. Não há esperas fixas. A execução validada teve **3 testes aprovados em 4,4 segundos**; o tempo pode variar entre máquinas.

### 4. Mostrar o relatório e os critérios

Para abrir o relatório da execução que acabou de fazer:

```powershell
npx.cmd playwright show-report
```

Mostre os três testes verdes e suas capturas. Abra também [ACEITACAO.md](ACEITACAO.md), que relaciona critério, localização do teste e evidência. Encerre o visualizador com `Ctrl+C` quando terminar.

Uma cópia da execução validada está preservada no projeto e pode ser aberta com:

```powershell
npx.cmd playwright show-report relatorios/playwright
```

### 5. Explicar o antiteste

> Removemos temporariamente o bloqueio de autoaprovação. C2 falhou, comprovando que detecta o defeito. Restauramos a regra e os três testes voltaram a passar.

A evidência está no [log do antiteste](relatorios/antiteste.txt). Se precisar repetir ao vivo, sem outro servidor ou teste aberto, execute e aguarde cada comando terminar:

```powershell
npm.cmd run test:antiteste
npx.cmd playwright test
```

No primeiro comando, **uma falha de C2 é esperada**: o script introduz o defeito temporariamente, confirma que o teste o detectou e restaura o código original. Não interrompa essa demonstração. O segundo comando confirma novamente os três testes verdes com a regra correta.

### O que explicar se o professor perguntar

- **Playwright:** verifica ações e resultados visíveis em um navegador real.
- **Cucumber:** mantém os 37 cenários da parte 1, cobrindo as regras de domínio. Para demonstrá-los, execute `npm.cmd test`.
- **Perfis:** Ana e Beatriz são simuladas; não há autenticação real.
- **Persistência:** os dados ficam no `localStorage` do navegador. C3 verifica o botão **Salvar alterações**; o salvamento automático de 30 segundos é coberto no domínio pelo Cucumber, não por esse teste de interface.
- **Envio:** a aprovação libera a edição, mas este protótipo não envia e-mails reais.

### Preparar a entrega

Entregue o repositório atualizado ou um ZIP sem `node_modules`, incluindo `tests/`, `playwright.config.js`, o aplicativo, `ACEITACAO.md` e `relatorios/`. Informe os nomes dos integrantes e os comandos de execução. Em outro computador, instale Node.js 24 ou superior e execute primeiro `npm ci` e `npx playwright install chromium`.

## Parte 1 — Cucumber

A suíte verifica quatro regras da plataforma de newsletters NewsFlow. Os cenários em Gherkin descrevem caminhos de sucesso, bloqueios esperados e valores de fronteira.

## Resultados

**37 cenários aprovados e 209 passos aprovados**, sem falhas ou passos indefinidos. A suíte completa também passou em paralelo, e a verificação rápida passou nos 6 cenários marcados com `@smoke`.

```text
> npm test
37 scenarios (37 passed)
209 steps (209 passed)
0m 0.250s (0m 0.104s executing your code)
```

O Cucumber gerou um relatório HTML navegável com o resultado de cada cenário e de seus passos. Abra o arquivo no navegador para consultar a execução. [Relatório de testes](https://gogotasz.github.io/NewsFlow_EngSoft/relatorios/cucumber-report.html).

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
