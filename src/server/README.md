# `src/server` — regras de negócio

Toda regra de negócio fica aqui, em funções TypeScript **testáveis e independentes do React**.
Componentes, páginas e rotas de API só chamam estas funções.

| Pasta       | Responsabilidade                                    | Regras                       |
| ----------- | --------------------------------------------------- | ---------------------------- |
| `menu/`     | Cardápio semanal, modelo, publicação, período       | RN-10 a RN-19                |
| `orders/`   | Pedidos, kanban, horário limite, entrega, pagamento | RN-30 a RN-39, RN-70 a RN-79 |
| `feedback/` | Solicitações, elogios e reclamações                 | RN-40 a RN-42                |
| `calendar/` | Dias úteis, feriados, horário de funcionamento      | RN-01 a RN-06                |
| `chatbot/`  | Máquina de estados do bot e cliente do WhatsApp     | RN-20 a RN-29, RN-80 a RN-82 |
| `settings/` | Configurações editáveis e valores padrão            | §6 do estudo de negócio      |

Convenções:

- cada arquivo de regra tem um `*.test.ts` ao lado;
- comentários citam o código da regra (`RN-XX`) de `docs/ESTUDO_DE_NEGOCIO.md`;
- datas de cardápio são strings `AAAA-MM-DD` no fuso `America/Sao_Paulo`.
