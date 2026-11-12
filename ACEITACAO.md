# Parte 2 — Aceitação com Playwright

O recorte de interface do NewsFlow cobre criação, edição e revisão de newsletters. A suíte executa três cenários independentes em Chromium, com contexto de navegador novo por teste, seletores acessíveis e asserções de comportamento. Não há esperas fixas ou acesso ao estado interno do aplicativo nos testes.

## Critério → teste → evidência

**Resultado final em 11/11/2026: 3 testes aprovados em 4,4 segundos.** C1, C2 e C3 também passaram em execuções individuais. O [relatório HTML salvo](relatorios/playwright/index.html) inclui uma captura do estado final de cada teste. Para consultá-lo com o servidor do Playwright, execute `npx playwright show-report relatorios/playwright`.

| Critério de aceite | Teste (arquivo:linha) | O que prova na tela |
| --- | --- | --- |
| C1 — Dado que Ana cria uma edição, quando solicita revisão e Beatriz aprova, então a edição fica aprovada e identifica a revisora. | [tests/newsflow.spec.js:13](tests/newsflow.spec.js#L13) | Título e rascunho inicial visíveis, estado final aprovado, nome de Beatriz e confirmação de liberação para envio. |
| C2 — Dada uma edição de Ana em revisão, quando Ana tenta aprová-la, então o app recusa e mantém a revisão pendente (RN02). | [tests/newsflow.spec.js:25](tests/newsflow.spec.js#L25) | Alerta de autoaprovação, estado em revisão e ausência de aprovação por Ana. |
| C3 — Dado um rascunho, quando seu conteúdo é alterado e salvo, então o texto atualizado, o título e o estado sobrevivem ao recarregar. | [tests/newsflow.spec.js:34](tests/newsflow.spec.js#L34) | Confirmação de salvamento antes do reload; conteúdo atualizado, estado rascunho e uma única edição após o reload. |

## Executar do zero

Pré-requisito: Node.js 24 ou superior. Na raiz do repositório:

```sh
npm ci
npx playwright install chromium
npx playwright test
npx playwright show-report
```

No Windows/PowerShell, use `npm.cmd` e `npx.cmd` caso os scripts `.ps1` estejam bloqueados. No Linux, caso faltem bibliotecas do navegador, use `npx playwright install --with-deps chromium`.

O `webServer` inicia `node server.js`, aguarda `http://127.0.0.1:5173` e encerra o processo após os testes. A porta deve estar livre. Não é necessário iniciar o app manualmente. Configuração baseada na [documentação oficial do Playwright](https://playwright.dev/docs/test-webserver).

Para executar cada cenário isoladamente:

```sh
npx playwright test -g "C1"
npx playwright test -g "C2"
npx playwright test -g "C3"
```

## Escopo e decisões

- A seleção de Ana/Beatriz simula duas revisoras para demonstrar RN02; não representa autenticação ou controle de acesso de produção.
- Os dados ficam no `localStorage` deste navegador. O botão **Salvar alterações** persiste o rascunho; este teste não comprova o salvamento automático de 30 segundos da RN01, que permanece coberto pelo Cucumber no domínio.
- A interface permite solicitar revisão, aprovar e reprovar com comentário. Aprovar libera a edição; não envia e-mails reais.
- RN05/RN07 continuam na suíte Cucumber. Segmentação, agendamento real, autenticação, servidor de dados e transporte de e-mails não fazem parte desta entrega de aceitação.
- O relatório padrão é gerado em `playwright-report/index.html`. Falhas geram captura e trace em `test-results/`. Essas pastas são locais; a evidência final pode ser copiada para `relatorios/`.

## Demonstrar que o teste detecta um defeito

**Verificado em 11/11/2026:** a primeira execução completa passou com **3 testes em 4,7 segundos**. O antiteste removeu o bloqueio e C2 falhou na asserção do alerta de autoaprovação, como esperado. A regra foi restaurada automaticamente. Evidência preservada: [log do antiteste](relatorios/antiteste.txt). As capturas dos três cenários aprovados estão no relatório HTML final.

Remova temporariamente o bloqueio `edicao.autora === revisora.nome` em `src/newsflow.js` e rode apenas C2. O teste deve falhar porque a autoaprovação será aceita. Restaure a regra e rode a suíte completa. Não entregue o domínio com a regra removida.

O comando `npm run test:antiteste` automatiza essa demonstração, restaura o arquivo original em `finally` e salva a saída em `relatorios/antiteste.txt`. Execute sem outro servidor ou teste aberto e aguarde o término, pois o código do domínio fica temporariamente alterado durante a verificação. Depois, execute `npx playwright test` para gerar a evidência final com a regra correta.
