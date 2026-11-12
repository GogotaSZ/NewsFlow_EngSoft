# NewsFlow

O NewsFlow é um protótipo para criar, editar e revisar newsletters. O projeto tem duas suítes de testes. O **Cucumber** verifica as regras de negócio. O **Playwright** usa o Chromium para testar o fluxo pela interface.

## 1. Preparar o projeto

Instale **Node.js 24 ou superior**, que inclui o npm. Se for baixar o código pelo terminal, instale também o Git.

```sh
git clone --branch codex/parte-2-playwright https://github.com/GogotaSZ/NewsFlow_EngSoft.git
cd NewsFlow_EngSoft
```

Se já tiver o código, abra o terminal na pasta que contém o arquivo `package.json`. Em seguida, instale as dependências e o Chromium usado pelo Playwright:

```sh
npm ci
npx playwright install chromium
```

No PowerShell do Windows, se a execução de scripts `.ps1` estiver bloqueada, troque `npm` por `npm.cmd` e `npx` por `npx.cmd` em todos os comandos.

## 2. Abrir a aplicação

```sh
npm start
```

Com o terminal aberto, acesse [http://127.0.0.1:5173](http://127.0.0.1:5173) no navegador. Para experimentar o fluxo:

1. Selecione o perfil **Ana**, preencha o título e o conteúdo e clique em **Criar rascunho**.
2. Edite o conteúdo, clique em **Salvar alterações** e recarregue a página. O texto editado deve continuar no rascunho.
3. Clique em **Solicitar revisão** e tente aprovar como Ana. A aplicação deve exibir um alerta e manter a edição **em revisão**.
4. Troque o **Perfil ativo** para **Beatriz** e aprove a edição. O estado deve mudar para **aprovada**, com Beatriz identificada como revisora.

Os perfis são simulados e os dados ficam no navegador. A aprovação faz parte do fluxo editorial do protótipo, que funciona sem envio real de e-mails.

Pressione `Ctrl+C` no terminal para parar a aplicação antes de executar o Playwright. A porta 5173 precisa estar livre.

## 3. Executar os testes no navegador (Playwright)

```sh
npm run test:e2e
```

O Playwright inicia e encerra o servidor automaticamente. O Chromium roda em segundo plano e o resultado esperado no terminal é **`3 passed`**.

| Teste | Resultado verificado |
| --- | --- |
| C1 — Aprovação por outra revisora | A edição criada por Ana fica aprovada e identifica Beatriz como revisora. |
| C2 — Bloqueio da autoaprovação | A tentativa de Ana gera um alerta e a edição permanece em revisão. |
| C3 — Persistência do rascunho | O título, o conteúdo salvo manualmente e o estado de rascunho permanecem após recarregar. |

Para abrir o relatório gerado pela última execução:

```sh
npm run test:e2e:report
```

O relatório permite abrir cada teste e consultar seus passos e a captura da tela final. Pressione `Ctrl+C` para encerrar o visualizador. A tabela que relaciona cada critério ao teste correspondente está no [guia de aceitação](ACEITACAO.md).

Para consultar a execução preservada no repositório, use `npx playwright show-report relatorios/playwright`.

### Verificar se o teste detecta um defeito

Com a aplicação parada, execute `npm run test:antiteste`. O script desativa temporariamente o bloqueio de autoaprovação, roda apenas C2 e restaura a regra ao terminar. Aguarde o comando concluir. A falha de C2 é esperada nessa etapa. Em seguida, rode `npm run test:e2e` para confirmar que os três testes passam com a regra restaurada. [Log do antiteste](relatorios/antiteste.txt).

## 4. Executar os testes de regras de negócio (Cucumber)

```sh
npm test
```

Essa suíte verifica as regras de negócio com dados em memória e um relógio controlado. Pode ser executada diretamente após `npm ci`, sem iniciar a aplicação nem instalar o Chromium.

O resultado esperado é **37 cenários e 209 passos aprovados**. Abra o [relatório HTML do Cucumber](relatorios/cucumber-report.html) no navegador para consultar o resultado de cada cenário.

## O que foi testado

| História | Comportamentos verificados | Cenários |
| --- | --- | --- |
| US01 — RN01 | Criação do rascunho, salvamento aos 30 segundos, retenção das últimas 20 versões e restauração sem perda das versões posteriores. | [Rascunho](features/us01-rascunho.feature) |
| US02 — RN02 | Aprovação por outra revisora, bloqueio da autoaprovação, comentário obrigatório na reprovação e exigência de aprovação para enviar ou agendar. | [Aprovação](features/us02-aprovacao.feature) |
| US03 — RN05 | Limite de duas newsletters por semana, fila para o excedente, reinício da contagem na virada da semana e exclusão dos e-mails transacionais. | [Frequência](features/us03-frequencia.feature) |
| US04 — RN07 | Sucesso em nova tentativa, intervalos de 5 e 15 minutos, falha definitiva após três tentativas e tratamento de falhas permanentes e temporárias. | [Falhas de entrega](features/us04-falha-entrega.feature) |

Os testes usam dados em memória e um relógio controlado para verificar prazos e a virada da semana. A decisão de usar três tentativas no total na RN07 e as demais interpretações do enunciado estão documentadas junto aos critérios. [Histórias e critérios](docs/historias.md) · [Decisões da revisão](docs/revisao.md).

## Fora de escopo

- **RN03 — Agendamento.** Prazos, reagendamento e cancelamento ficaram fora do recorte. A suíte cobre a autorização para agendar pela RN02.
- **RN04 — Segmentação.** A seleção de público e a deduplicação ficaram fora para concentrar os cenários no fluxo de edição e entrega.
- **RN06 — Descadastro.** O descadastro e o retorno à lista formam um fluxo separado de consentimento.
- **RN08 — Notificações push.** O recorte de entrega cobre newsletters por e-mail.
