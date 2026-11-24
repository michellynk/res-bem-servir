# Estudo de Negócio — RBS Refeições Bem Servir

> Documento vivo. Toda regra nova ou alterada deve ser registrada aqui **e** resumida no [README](../README.md#regras-de-negócio-definidas).
> Convenção: cada regra recebe um código `RN-XX`, cada dúvida em aberto um código `Q-XX`.
> Status possíveis: ✅ Definida · 🟡 Proposta (aguardando validação) · ❓ Em aberto.

---

## 1. Contexto

O restaurante **RBS – Refeições Bem Servir** funciona de **segunda a sexta-feira**, exceto feriados que caem nesses dias. Toda semana a proprietária (administradora) monta um **cardápio novo** e o envia **manualmente pelo WhatsApp Business** a clientes frequentes:

- clientes que pedem **marmita**;
- clientes que só querem **saber o cardápio** para se programar.

Ela **não quer publicar o cardápio inteiro nas redes sociais**, por receio de que concorrentes copiem.

### Dores atuais

| # | Dor | Impacto |
|---|-----|---------|
| D1 | Envio manual do cardápio para cada cliente | Tempo gasto toda semana, risco de esquecer alguém |
| D2 | Pedidos de marmita chegam soltos pelo WhatsApp | Difícil acompanhar e organizar a produção, risco de perder pedidos |
| D3 | Elogios, reclamações e solicitações misturados nas conversas | Nada fica registrado nem tratado de forma organizada |
| D4 | Cardápio refeito do zero toda semana | Retrabalho com formato e impressão |

### Objetivos do sistema

1. **Automatizar o atendimento** pelo WhatsApp com um chatbot.
2. **Centralizar** cardápio, pedidos e feedbacks em um painel da administradora.
3. **Proteger o cardápio**: mostrar só o necessário ao público.
4. **Preparar para o futuro**: pedidos feitos pelo site por clientes com login.

---

## 2. Atores (perfis de usuário)

| Ator | Descrição | Fase |
|------|-----------|------|
| **Visitante** (deslogado) | Qualquer pessoa no site público. Vê o cardápio **do dia**. | MVP |
| **Cliente WhatsApp** | Conversa com o chatbot. Identificado pelo número de telefone, sem login. | MVP |
| **Administradora** (`ADMIN`) | A proprietária. Gerencia cardápio, chatbot, pedidos e feedbacks. | MVP |
| **Cliente cadastrado** (`CUSTOMER`) | Cliente com login no site, que faz pedidos pelo site. | Futuro |
| **Funcionário** (`STAFF`) | Opcional: acesso restrito, por exemplo só ao kanban da cozinha. | Futuro (a validar) |

> **Decisão de modelagem:** o *usuário* (quem faz login) fica separado do *cliente* (quem compra). Um cliente de WhatsApp existe sem login; quando ele criar uma conta no futuro, os dois são **vinculados pelo telefone**, e o histórico de pedidos é preservado. Ver [MODELAGEM_DADOS.md](./MODELAGEM_DADOS.md).

---

## 3. Módulos e fluxos

### 3.1 Calendário de funcionamento

| Código | Regra | Status |
|--------|-------|--------|
| RN-01 | O restaurante funciona de segunda a sexta. | ✅ |
| RN-02 | Feriados que caem de segunda a sexta são dias **fechados**: sem cardápio e sem pedidos. | ✅ |
| RN-03 | Feriados nacionais são importados automaticamente (BrasilAPI). Feriados estaduais/municipais e folgas pontuais são cadastrados manualmente pela administradora. | 🟡 |
| RN-04 | A administradora pode marcar qualquer dia útil como fechado (ex.: emenda, imprevisto). | 🟡 |

### 3.2 Cardápio

**Formato atual (referência):** [`referencias/cardapio-exemplo.jpg`](./referencias/cardapio-exemplo.jpg)

![Exemplo de cardápio](./referencias/cardapio-exemplo.jpg)

Estrutura observada no exemplo:

| Elemento | Exemplo | Comportamento no sistema |
|----------|---------|--------------------------|
| Cabeçalho | "RBS – REFEIÇÕES BEM SERVIR" | Texto configurável |
| Período | "CARDÁPIO DA SEMANA – 28 A 02/10/2026" | Gerado automaticamente a partir das datas da semana cadastrada (muda a cada semana) |
| Colunas (seções) | CARNES · COMPLEMENTOS · SALADAS | **Personalizáveis**: criar, renomear, reordenar, remover |
| Linhas por dia | 4 linhas por dia | Quantidade livre por seção |
| Itens fixos | "BIFE ou FILÉ de FRANGO" (Carnes), "ARROZ – FEIJÃO" (Complementos), "SALADAS VARIADAS" (Saladas) | Vêm **pré-preenchidos** todos os dias pelo modelo, mas **podem ser editados ou removidos** em qualquer dia |
| Itens variáveis | Strogonoff, Frango à parmegiana, Batata soutê... | Preenchidos pela administradora a cada semana |
| Rodapé | "OBS.: Na falta de produtos no mercado, o cardápio poderá sofrer alterações." | Texto configurável |

**Fluxo:**
```
Administradora abre "Nova semana"
   → sistema sugere a PRÓXIMA semana (segunda a sexta seguinte)
     e calcula o período do cabeçalho (ex.: "28 A 02/10/2026")
   → cria seg–sex a partir do MODELO (seções + itens fixos)
     ou copia a semana anterior
   → dias fechados (feriados) já vêm marcados
   → ela preenche os itens variáveis e ajusta os fixos, se quiser
   → salva como RASCUNHO
   → PUBLICA → cardápio passa a valer no site e no chatbot
   → imprime (layout igual ao exemplo, 1 página A4)
```

| Código | Regra | Status |
|--------|-------|--------|
| RN-10 | O cardápio é **semanal** (segunda a sexta) e organizado **por dia**. | ✅ |
| RN-11 | O cardápio segue um **modelo totalmente personalizável**: seções (colunas), ordem, itens fixos pré-preenchidos, cabeçalho e rodapé. O modelo padrão reproduz o cardápio atual (Carnes, Complementos, Saladas). **Itens pré-preenchidos também podem ser editados ou removidos** em cada dia, sem alterar o modelo. | ✅ |
| RN-12 | O cardápio tem status `RASCUNHO` → `PUBLICADO`. Só o publicado aparece no site e no chatbot. | 🟡 |
| RN-13 | Ao publicar/alterar o cardápio, o chatbot passa a usar os novos dados **imediatamente** (fonte única de verdade: o banco). | ✅ |
| RN-14 | O cardápio pode ser **impresso** seguindo o layout do [exemplo](./referencias/cardapio-exemplo.jpg): título, período, cabeçalho das seções, um bloco por dia em tabela, rodapé de observação, tudo em **1 página A4 retrato**. | ✅ |
| RN-15 | O site público mostra **apenas o cardápio do dia**, nunca a semana inteira (proteção contra cópia). | ✅ |
| RN-16 | O cliente pode **pedir o cardápio pelo chat a qualquer momento** (opção 1): o bot mostra o cardápio do dia e oferece o da semana. | ✅ |
| RN-17 | Opção "copiar semana anterior" para reaproveitar pratos recorrentes. | 🟡 |
| RN-18 | O **período** do cabeçalho é calculado a partir das datas da semana cadastrada, no formato do exemplo: `DD A DD/MM/AAAA` (ex.: "28 A 02/10/2026"). | ✅ |
| RN-19 | O cardápio é cadastrado **para a próxima semana**: "Nova semana" sugere a segunda-feira seguinte. A administradora pode escolher outra semana, se precisar. | ✅ |

### 3.3 Chatbot (WhatsApp Business)

O bot atende **no mesmo número de WhatsApp Business que o restaurante já usa** (ver §4.1). A administradora continua respondendo pelo celular quando quiser.

**Fluxo de conversa (MVP):**
```
Cliente manda qualquer mensagem
  → Bot: mensagem de boas-vindas (configurável)
  → Menu principal:
      1. Ver cardápio
      2. Pedir marmita
      3. Solicitações, elogios ou reclamações
      (0. Falar com atendente — proposta, ver Q-06)

1 → cardápio do dia (e opção de ver a semana) → volta ao menu
2 → fluxo de pedido:
      escolher o dia: qualquer dia útil da semana com cardápio publicado (RN-74)
      → tamanho: Pequena ou Grande (com preço atual)
      → escolher até 2 carnes do cardápio daquele dia (RN-70)
      → complementos vão todos por padrão (RN-71)
      → quantidade
      → observação livre (ex.: "sem feijão", "trocar farofa por batata") (RN-73)
      → retirada ou entrega (entrega só na região atendida e até 11h30, RN-75)
      → resumo com valor → cliente CONFIRMA
      → pedido criado com status "Para fazer" e aparece no kanban
3 → escolher tipo: Solicitação | Elogio | Reclamação
      → cliente escreve a mensagem
      → registro criado e aparece na aba correspondente do painel
```

| Código | Regra | Status |
|--------|-------|--------|
| RN-20 | O bot faz uma **introdução** (saudação) e apresenta as opções 1, 2 e 3. | ✅ |
| RN-21 | Os **textos do bot** (saudação, títulos das opções, mensagens de confirmação, despedida) são **editáveis** no painel. | ✅ |
| RN-22 | O cardápio exibido pelo bot vem do cardápio **publicado** no banco. | ✅ |
| RN-23 | Em dias fechados/feriados o bot informa que o restaurante não abre e mostra o próximo dia de funcionamento. | 🟡 |
| RN-24 | O cliente é identificado pelo número de WhatsApp. No primeiro contato, o bot pede o nome. | 🟡 |
| RN-25 | A conversa expira após X minutos de inatividade e volta ao menu inicial. | 🟡 |
| RN-26 | Mensagens fora do fluxo esperado → bot repete as opções válidas. | 🟡 |
| RN-27 | **Envio ativo do cardápio da semana**: **um envio por semana**, num dia útil, para os clientes com opt-in (padrão: segunda-feira de manhã; dia e horário configuráveis), agendado ou disparado pelo painel. | ✅ |
| RN-28 | ~~Envio diário do cardápio do dia.~~ Descartada: o envio ativo é só semanal (RN-27); no resto da semana o cliente pede o cardápio pelo chat (RN-16). | ❌ |
| RN-29 | Quando a administradora responde manualmente uma conversa pelo celular, o bot **pausa** naquela conversa por um tempo configurável, para não responder por cima dela. | 🟡 |

### 3.4 Pedidos de marmita

| Código | Regra | Status |
|--------|-------|--------|
| RN-30 | Pedidos ficam num **kanban** com 3 colunas: **Para fazer → Em preparação → Finalizado**. | ✅ |
| RN-31 | A administradora move os pedidos entre as colunas (arrastar ou botão). | ✅ |
| RN-32 | Pedidos podem ser **impressos** (individual e/ou lista do dia, ver Q-08). | ✅ |
| RN-33 | Cada pedido guarda o **canal de origem** (`WHATSAPP`, `SITE`, `BALCAO`), já pensando no pedido pelo site. | ✅ |
| RN-34 | Pedido também pode ser **cancelado** (fora do kanban, registra o motivo). | 🟡 |
| RN-35 | **Horário limite** geral para pedidos do mesmo dia: **desligado por padrão**. Pode ser ativado no painel; quando ativo, o valor sugerido é **13:00**. Depois do limite, o bot oferece outro dia útil. Para **entrega** vale o limite próprio de 11h30 (RN-75). Ver [Onde alterar configurações](#6-onde-alterar-configurações). | ✅ |
| RN-36 | O pedido guarda um "retrato" do item e do preço no momento do pedido (mudar o cardápio depois não altera pedidos antigos). | ✅ (boa prática) |
| RN-37 | O kanban mostra por padrão os pedidos **do dia**, com filtro por data. | 🟡 |
| RN-38 | Opcional: avisar o cliente pelo WhatsApp quando o pedido for "Finalizado". | ❓ (Q-09) |
| RN-39 | Existem dois **tamanhos de marmita: Pequena e Grande**. O **preço é por tamanho** e pode ser **editado a qualquer momento** no painel, pois muda com frequência. Pedidos já feitos mantêm o preço da hora do pedido (RN-36). | ✅ |

#### Composição da marmita

| Código | Regra | Status |
|--------|-------|--------|
| RN-70 | O cliente monta a marmita com o que quiser do cardápio **do dia escolhido**, podendo escolher **até 2 opções de carne**. O limite fica em configuração. | ✅ |
| RN-71 | Os **complementos vão todos por padrão** (ex.: arroz, feijão e os acompanhamentos do dia). O cliente não precisa escolher. | ✅ |
| RN-72 | A **salada vai separada** da marmita, em embalagem própria. | ✅ |
| RN-73 | O pedido tem um **campo de observação livre** (ex.: "sem feijão", "sem salada", "trocar farofa por batata"), que aparece **em destaque na impressão do pedido** e no cartão do kanban. | ✅ |

#### Dia do pedido e entrega

| Código | Regra | Status |
|--------|-------|--------|
| RN-74 | O cliente pode pedir marmita para **qualquer dia útil da semana** (segunda a sexta), desde que o dia tenha cardápio publicado, não seja feriado/dia fechado e não tenha passado. | ✅ |
| RN-75 | **Entrega** só para a **região próxima a Pinhais** e só para pedidos feitos **até 11h30** do dia da entrega. Depois disso, o bot oferece **retirada** ou entrega em outro dia. A definição exata da região ainda será revista (Q-16). | 🟡 |
| RN-76 | Pedido com entrega exige endereço. O sistema confere se o endereço está na região atendida antes de confirmar. | 🟡 |

### 3.5 Solicitações, elogios e reclamações

| Código | Regra | Status |
|--------|-------|--------|
| RN-40 | Três tipos **separados**: Solicitação, Elogio, Reclamação (abas ou filtros distintos no painel). | ✅ |
| RN-41 | Cada registro tem status: `NOVO` → `LIDO` → `RESOLVIDO`. | 🟡 |
| RN-42 | A administradora pode adicionar uma anotação interna/resposta. | 🟡 |

### 3.6 Site público (deslogado)

| Código | Regra | Status |
|--------|-------|--------|
| RN-50 | Mostra o **cardápio do dia** e informações básicas (horário, endereço, link do WhatsApp). | ✅ |
| RN-51 | Em dia fechado, mostra aviso e o próximo dia de funcionamento. | 🟡 |
| RN-52 | Futuro: botão "Fazer pedido" (exige login de cliente). | Futuro |

### 3.7 Autenticação e permissões

| Código | Regra | Status |
|--------|-------|--------|
| RN-60 | Só usuários `ADMIN` acessam o painel `/admin`. | ✅ |
| RN-61 | A modelagem já prevê os papéis `CUSTOMER` e `STAFF` para as próximas fases. | ✅ |

---

## 4. Restrições e riscos

### 4.1 WhatsApp Business + API (coexistência)

O restaurante **não terá um número exclusivo** para o bot e quer continuar usando o **app WhatsApp Business** (Q-12). A solução é a **coexistência** da Meta: o mesmo número fica ao mesmo tempo no app WhatsApp Business (celular) e na WhatsApp Cloud API (bot).

| Aspecto | Como fica |
|---------|-----------|
| Número | O mesmo que os clientes já conhecem. Não precisa trocar nem avisar ninguém. |
| Celular | Continua com o app WhatsApp Business. As conversas do bot aparecem lá também. |
| Mensagens enviadas pelo app (manualmente) | Continuam **gratuitas**. |
| Mensagens enviadas pela API (bot) | Seguem a tabela de preços da Meta: respostas dentro de 24h após o cliente escrever são de *serviço* (gratuitas ou baratas); o **envio ativo do cardápio** (RN-27) é um **template de marketing**, cobrado por mensagem. |
| Requisitos | Número já ativo no app WhatsApp Business (versão recente), conta Meta Business, conexão feita pelo *Embedded Signup* (direto pela Meta ou por um provedor/BSP). |
| Limitações conhecidas | Aparelhos vinculados (WhatsApp Web/Desktop) são desconectados na ativação. Algumas funções do app podem ficar limitadas. Desconexão é feita pelo próprio app. **Confirmar a lista atual de limitações no momento da ativação.** |
| Risco | Bot e administradora respondendo ao mesmo tempo → resolvido pela pausa automática do bot (RN-29). |

**Alternativas descartadas:**
- **Bibliotecas não oficiais** (whatsapp-web.js, Baileys): violam os termos e há **risco real de banimento do número** do restaurante, que é o principal canal de vendas.
- **Só recursos nativos do app** (mensagem de saudação, respostas rápidas, listas de transmissão): grátis, mas não anotam pedidos nem integram com o painel. Podem ser usados como **plano provisório** até o bot ficar pronto.

### 4.2 LGPD
O sistema guarda nome, telefone e, possivelmente, endereço de clientes. É necessário:
- registrar o **consentimento** (opt-in) para receber o cardápio;
- permitir que o cliente peça para **sair da lista** (ex.: responder "SAIR");
- guardar apenas os dados necessários.

### 4.3 Proteção do cardápio
Nenhuma solução impede totalmente a cópia (alguém pode tirar print). As medidas são: expor só o dia atual no site, não ter API pública da semana e mandar a semana só para quem deu opt-in.

---

## 5. Questões em aberto

| Código | Pergunta | Impacta |
|--------|----------|---------|
| Q-06 | Precisa de opção "falar com atendente" no menu do bot? | Chatbot |
| Q-08 | Impressão de pedidos: **um por folha/etiqueta**, **lista do dia** ou os dois? Tem impressora térmica? | RN-32 |
| Q-09 | Avisar o cliente quando a marmita ficar pronta? | RN-38 |
| Q-10 | **Pagamento**: só na retirada/entrega, ou Pix antecipado? | Pedido, futuro |
| Q-11 | Qual o horário de funcionamento (ex.: 11h–14h)? O bot responde fora desse horário? | Chatbot, site |
| Q-13 | Haverá funcionários usando o sistema (ex.: cozinha vendo o kanban)? | Papel STAFF |
| Q-16 | **Região de entrega**: como definir "perto de Pinhais"? Lista de bairros, CEPs ou distância em km? Tem **taxa de entrega**? É igual para todos os bairros? | RN-75, RN-76 |
| Q-17 | O limite de **2 carnes** vale para os dois tamanhos? A Pequena e a Grande mudam só a quantidade de comida? | RN-70 |
| Q-18 | Na sexta, o cliente pode pedir para a **semana seguinte**, se o cardápio já estiver publicado? | RN-74 |

### Questões respondidas

| Código | Resposta | Virou |
|--------|----------|-------|
| Q-01 | **Um envio por semana**, num dia útil. Fora isso, o cliente pede o cardápio pelo chat quando quiser. Usar o WhatsApp Business. | RN-16, RN-27, RN-28 (descartada), §4.1 |
| Q-02 | Cardápio **personalizável** (exemplo enviado). O período muda conforme a semana cadastrada (a próxima). Itens pré-preenchidos também são editáveis. | RN-11, RN-14, RN-18, RN-19 |
| Q-03 | Coberta por RN-16 e RN-27. | RN-16 |
| Q-04 | Sem horário limite por padrão; se houver, 13h. Precisa ser fácil de alterar. | RN-35, §6 |
| Q-05 | Marmitas **Pequena e Grande**. Preços mudam sempre, então precisam ser editáveis no painel. | RN-39 |
| Q-07 (parcial) | Entrega só na região perto de Pinhais, para pedidos até 11h30. A região ainda será revista. | RN-75, RN-76, Q-16 |
| Q-12 | Não haverá número exclusivo; usar o **WhatsApp Business** atual. | §4.1, RN-29 |
| Q-14 | O cliente escolhe o que quiser do cardápio, com **até 2 carnes**. Complementos vão normalmente. Salada vai separada. Observação livre, impressa no pedido. | RN-70 a RN-73 |
| Q-15 | Pode pedir para **qualquer dia útil** da semana (segunda a sexta). | RN-74 |

---

## 6. Onde alterar configurações

Regras que podem mudar com frequência **não ficam fixas no código**: ficam em configurações editáveis no painel, com um valor padrão no código.

| Configuração | No painel (planejado) | Chave no banco | Valor padrão (código) |
|--------------|----------------------|----------------|----------------------|
| Horário limite de pedidos (RN-35) | Configurações → Pedidos → "Horário limite" (liga/desliga + hora) | `orders.cutoff.enabled` / `orders.cutoff.time` | `false` / `"13:00"` em `src/server/settings/defaults.ts` |
| Dia/hora do envio semanal (RN-27) | Configurações → Chatbot → "Envio do cardápio" | `broadcast.weekly.weekday` / `broadcast.weekly.time` | segunda / `"08:00"` |
| Máximo de carnes por marmita (RN-70) | Configurações → Pedidos | `orders.maxMeatChoices` | `2` |
| Entrega ligada/desligada (RN-75) | Configurações → Entrega | `delivery.enabled` | `true` |
| Horário limite para entrega (RN-75) | Configurações → Entrega | `delivery.cutoff.time` | `"11:30"` |
| Região de entrega (RN-75, Q-16) | Configurações → Entrega → Regiões | tabela `DeliveryArea` | a definir |
| Pausa do bot após resposta manual (RN-29) | Configurações → Chatbot | `bot.pauseAfterHumanMinutes` | `60` |
| Tamanhos e preços (RN-39) | Cardápio → Tamanhos e preços | tabela `MarmitaSize` | Pequena, Grande (seed, preço a cadastrar) |
| Seções, itens fixos, cabeçalho e rodapé (RN-11) | Cardápio → Modelo | tabelas `MenuTemplate*` | modelo do exemplo (seed) |

> As regras de horário limite (geral e de entrega) ficam em `src/server/orders/cutoff.ts` (planejado). Quando o código existir, esta tabela será conferida e mantida atualizada.

---

## 7. Histórico de alterações

| Data | Alteração |
|------|-----------|
| 2026-11-19 | Versão inicial do estudo de negócio a partir do briefing. |
| 2026-11-23 | Respondidas Q-01, Q-02, Q-03, Q-04, Q-12 e parte da Q-05. Exemplo de cardápio adicionado. Nova estratégia de WhatsApp Business com coexistência. Novas regras RN-18, RN-28, RN-29, RN-39. Novas questões Q-14 e Q-15. Seção "Onde alterar configurações". |
| 2026-11-24 | Respondidas Q-01 (envio só semanal), Q-02 (período por semana, cadastro para a próxima semana, fixos editáveis), Q-05, Q-14, Q-15 e parte da Q-07. Novas regras RN-19, RN-70 a RN-76. RN-28 descartada. Novas questões Q-16, Q-17 e Q-18. |
