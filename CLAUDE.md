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
- Na etapa de **impressão do cardápio**, peça à usuária o exemplo de cardápio impresso antes de implementar.
- Regras de negócio ficam em `src/server/` (testáveis), não em componentes React.
