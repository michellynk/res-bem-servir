# Estudo de Negócio — Restaurante Bem Servir

> Documento vivo. Toda regra nova ou alterada deve ser registrada aqui **e** resumida no [README](../README.md#regras-de-negócio-definidas).
> Convenção: cada regra recebe um código `RN-XX`, cada dúvida em aberto um código `Q-XX`.
> Status possíveis: ✅ Definida · 🟡 Proposta (aguardando validação) · ❓ Em aberto.

---

## 1. Contexto

O restaurante funciona de **segunda a sexta-feira**, exceto feriados que caem nesses dias. Toda semana a proprietária (administradora) monta um **cardápio novo** e o envia **manualmente pelo WhatsApp** a clientes frequentes:

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

**Fluxo:**
```
Administradora abre "Nova semana"
   → sistema cria a semana a partir do MODELO (formato prévio) ou copia a semana anterior
   → dias fechados (feriados) já vêm marcados
   → ela edita só o que muda (pratos do dia)
   → salva como RASCUNHO
   → PUBLICA → cardápio passa a valer no site e no chatbot
   → (opcional) imprime
```

| Código | Regra | Status |
|--------|-------|--------|
| RN-10 | O cardápio é **semanal** (segunda a sexta) e organizado **por dia**. | ✅ |
| RN-11 | Existe um **formato prévio (modelo)** com as seções fixas (ex.: prato principal, guarnições, salada, sobremesa). A administradora só altera o necessário. | ✅ |
| RN-12 | O cardápio tem status `RASCUNHO` → `PUBLICADO`. Só o publicado aparece no site e no chatbot. | 🟡 |
| RN-13 | Ao publicar/alterar o cardápio, o chatbot passa a usar os novos dados **imediatamente** (fonte única de verdade: o banco). | ✅ |
| RN-14 | O cardápio deve poder ser **impresso**, seguindo um layout de referência. | ✅ |
| RN-15 | O site público mostra **apenas o cardápio do dia**, nunca a semana inteira (proteção contra cópia). | ✅ |
| RN-16 | O chatbot pode mostrar o cardápio do dia e, a definir, o da semana (ver Q-03). | ❓ |
| RN-17 | Opção "copiar semana anterior" para reaproveitar pratos recorrentes. | 🟡 |

> ⚠️ **Pendente:** ao chegar na etapa de impressão, **solicitar o exemplo de cardápio impresso** usado hoje, para reproduzir o layout.

### 3.3 Chatbot (WhatsApp)

**Fluxo de conversa (MVP):**
```
Cliente manda qualquer mensagem
  → Bot: mensagem de boas-vindas (configurável)
  → Menu principal:
      1. Ver cardápio
      2. Pedir marmita
      3. Solicitações, elogios ou reclamações
      (0. Falar com atendente — proposta, ver Q-06)

1 → mostra o cardápio do dia (ou da semana, ver Q-03) → volta ao menu
2 → fluxo de pedido:
      escolher dia (hoje/amanhã, conforme horário limite)
      → escolher opção/tamanho da marmita
      → quantidade
      → observações (ex.: sem feijão)
      → retirada ou entrega (+ endereço, se entrega)
      → resumo → cliente CONFIRMA
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
| RN-27 | Os clientes que aceitarem (opt-in) recebem o cardápio da semana por WhatsApp, enviado em lote pelo painel. | 🟡 (ver Q-01) |

### 3.4 Pedidos de marmita

| Código | Regra | Status |
|--------|-------|--------|
| RN-30 | Pedidos ficam num **kanban** com 3 colunas: **Para fazer → Em preparação → Finalizado**. | ✅ |
| RN-31 | A administradora move os pedidos entre as colunas (arrastar ou botão). | ✅ |
| RN-32 | Pedidos podem ser **impressos** (individual e/ou lista do dia, ver Q-08). | ✅ |
| RN-33 | Cada pedido guarda o **canal de origem** (`WHATSAPP`, `SITE`, `BALCAO`), já pensando no pedido pelo site. | ✅ |
| RN-34 | Pedido também pode ser **cancelado** (fora do kanban, registra o motivo). | 🟡 |
| RN-35 | Existe um **horário limite** para pedir marmita do dia. | ❓ (Q-04) |
| RN-36 | O pedido guarda um "retrato" do item e do preço no momento do pedido (mudar o cardápio depois não altera pedidos antigos). | ✅ (boa prática) |
| RN-37 | O kanban mostra por padrão os pedidos **do dia**, com filtro por data. | 🟡 |
| RN-38 | Opcional: avisar o cliente pelo WhatsApp quando o pedido for "Finalizado". | ❓ (Q-09) |

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

### 4.1 WhatsApp: API oficial vs. não oficial
- **API oficial (WhatsApp Cloud API / Meta)**: estável, sem risco de banimento, exige conta Business verificada e número dedicado. **Mensagens iniciadas pela empresa** (como mandar o cardápio da semana para todos) exigem **templates aprovados pela Meta**, **opt-in** do cliente e são **cobradas por mensagem** (categoria *marketing*). Respostas dentro da janela de 24h após o cliente escrever são de *serviço* e baratas ou gratuitas.
- **Bibliotecas não oficiais** (whatsapp-web.js, Baileys): grátis, mas violam os termos do WhatsApp e há **risco real de banimento do número** do restaurante.
- **Recomendação:** API oficial, com um número dedicado ao bot (ver [DECISOES.md](./DECISOES.md) — ADR-003).

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
| Q-01 | O envio do cardápio semanal deve ser **ativo** (o restaurante dispara para a lista, com custo por mensagem na API oficial) ou **passivo** (cliente pergunta e o bot responde)? Ou os dois? | RN-27, custos |
| Q-02 | Quais são as **seções fixas** do cardápio (prato principal, guarnição, salada, sobremesa, suco...)? Há várias opções de prato por dia? | RN-11, modelo de dados |
| Q-03 | O bot deve mostrar o cardápio **da semana** ou só **do dia**? | RN-16 |
| Q-04 | Qual o **horário limite** para pedir marmita? Pode pedir para dias futuros? | RN-35 |
| Q-05 | **Tamanhos e preços** das marmitas (P/M/G?). Preço varia por prato? | Pedido, modelo de dados |
| Q-06 | Precisa de opção "falar com atendente humano" (o bot pausa e ela responde manualmente)? | Chatbot |
| Q-07 | Tem **entrega**? Taxa? Área de entrega? Ou só retirada? | Pedido |
| Q-08 | Impressão de pedidos: **um por folha/etiqueta**, **lista do dia** ou os dois? Tem impressora térmica? | RN-32 |
| Q-09 | Avisar o cliente quando a marmita ficar pronta? | RN-38 |
| Q-10 | **Pagamento**: só na retirada/entrega, ou Pix antecipado? | Pedido, futuro |
| Q-11 | O restaurante tem horário de funcionamento fixo (ex.: 11h–14h)? O bot responde fora desse horário? | Chatbot, site |
| Q-12 | Ela usa hoje o WhatsApp Business no **celular pessoal**? Pode usar um **número novo** para o bot? (A API oficial não pode ser usada ao mesmo tempo que o app no mesmo número.) | Infra WhatsApp |
| Q-13 | Haverá funcionários usando o sistema (ex.: cozinha vendo o kanban)? | Papel STAFF |

---

## 6. Histórico de alterações

| Data | Alteração |
|------|-----------|
| 2026-11-19 | Versão inicial do estudo de negócio a partir do briefing. |
