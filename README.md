# NewsFlow — Prática de BDD com Cucumber.js

Exercício de histórias de usuário, cenários Gherkin e automação de testes para o NewsFlow, plataforma de newsletters e notificações da Vértice.

## Etapa atual

As quatro histórias foram revisadas, com prioridade média para a RN05. A primeira versão dos cenários Gherkin está pronta para revisão. A automação ainda será desenvolvida.

## Organização do repositório

```text
NewsFlow_EngSoft/
├── README.md
├── docs/
│   ├── historias.md            # Histórias e critérios de aceitação
│   └── revisao.md              # Dúvidas do enunciado para revisão
├── features/                  # Um arquivo .feature por história
│   ├── us01-rascunho.feature
│   ├── us02-aprovacao.feature
│   ├── us03-frequencia.feature
│   ├── us04-falha-entrega.feature
│   ├── step_definitions/      # Implementações dos passos
│   └── support/               # World e suporte aos cenários
└── relatorios/                # Relatório HTML do Cucumber
```

As pastas ainda vazias contêm arquivos `.gitkeep` para serem preservadas no Git.

## Histórias selecionadas

Os números das regras de negócio são preservados. As histórias recebem IDs de US01 a US04, conforme o formato do exercício.

| História | Título | Regra coberta |
| --- | --- | --- |
| US01 | Salvar rascunho automaticamente | RN01 — Rascunho |
| US02 | Revisar edição antes do envio | RN02 — Aprovação |
| US03 | Limitar o recebimento de newsletters | RN05 — Frequência |
| US04 | Tratar falhas de entrega | RN07 — Falha de entrega |

Leia as histórias em [docs/historias.md](docs/historias.md) e os pontos que precisam de definição em [docs/revisao.md](docs/revisao.md).

## Ordem de trabalho

- [x] Selecionar as quatro regras e organizar o repositório.
- [x] Escrever a primeira versão das histórias e dos critérios de aceitação.
- [x] Revisar as histórias e ajustar a prioridade da RN05 para média.
- [x] Escrever um arquivo `.feature` por história, com sucesso e exceção.
- [x] Incluir pelo menos um Esquema do Cenário com três ou mais exemplos de fronteira.
- [ ] Revisar os cenários e esclarecer as dúvidas restantes do enunciado.
- [ ] Configurar Cucumber.js, World e scripts de execução.
- [ ] Implementar o domínio em memória e os steps de cada história.
- [ ] Validar o dry-run e executar a suíte sem passos pendentes.
- [ ] Gerar e versionar o relatório HTML.
- [ ] Documentar os comandos de execução e a saída de `npm test`.

## Fora de escopo

- **RN03 — Agendamento:** antecedência mínima, fuso horário, reagendamento e cancelamento ficam para outra etapa, para concentrar o trabalho nas quatro regras selecionadas.
- **RN04 — Segmentação:** seleção de segmentos e eliminação de destinatários duplicados ficam fora para manter o recorte nas regras de conteúdo, aprovação e entrega.
- **RN06 — Descadastro:** saída da lista e retorno por duplo opt-in formam um fluxo próprio de consentimento, que não será desenvolvido neste exercício.
- **RN08 — Notificação:** janela de silêncio e limite diário de push ficam fora porque o recorte de entrega adotado trata de newsletters por e-mail.

## Execução

A configuração do Cucumber.js será adicionada após a revisão dos cenários. Ainda não há comandos de teste disponíveis, e os arquivos `.feature` ainda não foram validados por um dry-run do Cucumber.
