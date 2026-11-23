# Instruções para assistentes de IA

- Idioma do projeto e da documentação: **português (Brasil)**.
- Antes de implementar, leia `docs/ESTUDO_DE_NEGOCIO.md` e `docs/PLANO_DO_PROJETO.md`.
- **Sempre que uma regra de negócio for definida ou alterada:**
  1. registre/atualize em `docs/ESTUDO_DE_NEGOCIO.md` (código `RN-XX`, status, e uma linha no histórico de alterações);
  2. resuma no `README.md`, seção "Regras de negócio definidas";
  3. se responder uma questão `Q-XX`, mova-a das questões em aberto para a regra correspondente.
- Decisões técnicas novas vão em `docs/DECISOES.md` como novo ADR.
- Mudanças no banco: atualize `docs/MODELAGEM_DADOS.md` junto com o `schema.prisma`.
- Ao concluir itens do plano, marque o checklist em `docs/PLANO_DO_PROJETO.md`.
- A **impressão do cardápio** segue o exemplo em `docs/referencias/cardapio-exemplo.jpg`.
- Valores que podem mudar (horário limite, envios, preços) ficam em `Setting` com padrão em `src/server/settings/defaults.ts`. Mantenha a tabela "Onde alterar configurações" (estudo §6 e README) em dia.
- Regras de negócio ficam em `src/server/` (testáveis), não em componentes React.
