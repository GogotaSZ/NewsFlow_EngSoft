# Histórias de usuário — NewsFlow

Histórias revisadas e cenários associados automatizados. As histórias seguem o modelo do enunciado: papel, objetivo, benefício, critérios de aceitação, regras cobertas, prioridade e referência aos cenários.

Foram selecionadas as regras RN01, RN02, RN05 e RN07. As histórias são numeradas de US01 a US04; os caminhos dos cenários indicam os arquivos associados a cada história.

## US01 — Salvar rascunho automaticamente

**Como** redatora

**Quero** que meu texto seja salvo enquanto escrevo

**Para** não perder trabalho quando a conexão cair

**Critérios de aceitação**

- Toda edição é criada como rascunho e é salva automaticamente a cada 30 segundos.
- Cada salvamento cria uma versão numerada do conteúdo da edição.
- O sistema mantém as últimas 20 versões disponíveis para restauração.
- Restaurar uma versão recupera o conteúdo que estava salvo nela.
- Restaurar uma versão não apaga as versões posteriores que ainda fazem parte do histórico mantido pelo sistema.

**Regras cobertas:** RN01

**Prioridade:** Alta — preservar o conteúdo evita que a redatora precise refazer o trabalho perdido.

**Cenários:** features/us01-rascunho.feature

## US02 — Revisar edição antes do envio

**Como** revisora

**Quero** aprovar ou reprovar uma edição antes do envio

**Para** impedir que conteúdos sem revisão sejam enviados aos assinantes

**Critérios de aceitação**

- Uma edição só pode ser enviada ou agendada após a aprovação de um revisor.
- O autor não pode aprovar a própria edição, mesmo que também exerça o papel de revisor.
- A reprovação de uma edição exige um comentário do revisor.
- Uma edição reprovada volta ao estado de rascunho com o comentário da reprovação.

**Regras cobertas:** RN02

**Prioridade:** Alta — a revisão protege os assinantes contra o recebimento de conteúdo que ainda não foi aprovado.

**Cenários:** features/us02-aprovacao.feature

## US03 — Limitar o recebimento de newsletters

**Como** assinante

**Quero** receber no máximo duas newsletters por semana

**Para** acompanhar as novidades sem receber um volume excessivo de mensagens

**Critérios de aceitação**

- Um assinante recebe no máximo duas newsletters por semana.
- As newsletters que excedem o limite do assinante entram na fila da semana seguinte.
- E-mails transacionais, como confirmação de cadastro e recibo, não contam para o limite semanal de newsletters.

**Regras cobertas:** RN05

**Prioridade:** Média — limitar a frequência melhora a experiência do assinante, mas tem menor urgência que preservar o conteúdo, exigir revisão e tratar falhas de entrega.

**Cenários:** features/us03-frequencia.feature

## US04 — Tratar falhas de entrega

**Como** responsável pela operação

**Quero** acompanhar as tentativas e o resultado das entregas de newsletters

**Para** identificar os envios que falharam e evitar novas entregas a endereços removidos da base

**Critérios de aceitação**

- Uma entrega que falha pode ter até três tentativas.
- A segunda tentativa ocorre após 5 minutos da primeira falha temporária; a terceira ocorre após mais 15 minutos da segunda falha temporária (decisão da revisão; a inconsistência dos 45 minutos está registrada em docs/revisao.md).
- Após a terceira tentativa sem sucesso, a entrega é marcada como falha definitiva.
- Uma falha permanente de endereço (hard bounce) remove o assinante da base.
- Uma falha temporária de entrega (soft bounce) mantém o assinante na base.

**Regras cobertas:** RN07

**Prioridade:** Alta — identificar falhas definitivas e remover endereços com falha permanente evita insistir em entregas sem possibilidade de sucesso.

**Cenários:** features/us04-falha-entrega.feature
