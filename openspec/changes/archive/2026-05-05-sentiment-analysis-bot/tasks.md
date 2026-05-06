## 1. Setup e Infraestrutura

- [x] 1.1 Criar a nova estrutura de pastas (`src/graphs`, `src/infra`, `src/services`, `src/api`).
- [x] 1.2 Adicionar e configurar dependências necessárias no `package.json` e inicializar o TS (ex: `@langchain/langgraph-checkpoint-postgres`, `pg`, `@langchain/openai`, e dependências de dev `typescript`, `@types/node`, `@types/express`, `ts-node`). Adicionar `tsconfig.json`.
- [x] 1.3 Implementar módulo de conexão com o PostgreSQL (`src/infra/db.ts`).
- [x] 1.4 Configurar a integração da LLM usando OpenRouter (`src/infra/llm.ts`).
- [x] 1.5 Criar o serviço de cliente para a Evolution API (`src/services/evolutionApi.ts`).

## 2. Refatoração do Webhook

- [x] 2.1 Extrair a rota de webhook para um controlador isolado (`src/api/webhook.ts`) com tipagens adequadas para o payload da Evolution API.
- [x] 2.2 Implementar filtro na entrada do webhook: aceitar apenas do `ALLOWED_PHONE_NUMBER` e descartar mensagens que não sejam texto (ex: imagens, áudios).
- [x] 2.3 Ajustar a rota para retornar HTTP 200 OK imediatamente e enfileirar processamento de forma assíncrona com `try/catch` robusto.

## 3. Implementação do LangGraph

- [x] 3.1 Definir a interface `GraphState` (incluindo o `messageId` para respostas citadas) e montar o esqueleto do LangGraph em `src/graphs/intentGraph.ts`.
- [x] 3.2 Configurar e integrar o nó de memória conectando o graph ao PostgreSQL usando o Checkpointer, com lógica de "trimming/windowing" para poupar tokens.
- [x] 3.3 Implementar o nó `analyze_sentiment` para interagir com o OpenRouter e classificar a agressividade.
- [x] 3.4 Implementar a rota condicional: responder amorosamente se agressivo, ou ignorar se não agressivo.
- [x] 3.5 Ligar o fluxo gerado para disparar envio usando a Evolution API caso a IA gere resposta.

## 4. Limpeza

- [x] 4.1 Modificar o arquivo principal (`src/index.ts`) para carregar a nova estrutura e o novo webhook e ajustar os scripts do `package.json` (ex: usar `ts-node` no `start`).
- [x] 4.2 Remover todo código legado e referências ao antigo "echo graph".
