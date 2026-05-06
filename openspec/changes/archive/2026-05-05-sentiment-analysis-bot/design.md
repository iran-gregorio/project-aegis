## Context

O projeto atual atua como uma interface de webhook passiva, executando um "echo graph" rudimentar. A nova arquitetura exige capacidade de memória de conversação interações assíncronas com uma LLM, regras de negócio baseadas no sentimento das mensagens (responder apenas se for agressivo), além de uma comunicação ativa de volta para o cliente através da Evolution API. Com isso, a estrutura precisa ser compartimentada e novas dependências (PostgreSQL para persistência, OpenRouter para LLM) são introduzidas.

## Goals / Non-Goals

**Goals:**
- Propor uma nova estrutura de pastas que isole lógicas de domínio (graphs), serviços externos (Evolution API, OpenRouter) e infraestrutura (PostgreSQL).
- Implementar LangGraph com "Postgres Saver" para persistência (memória).
- Integrar a camada de chat com OpenRouter para processamento da intenção.
- Modificar o webhook para filtrar tráfego pelo número de remetente configurado.

**Non-Goals:**
- Não iremos construir uma interface gráfica para gerenciar as regras de intenção.
- Não focaremos em escalabilidade extrema (como uso de filas em um broker) neste design inicial, optando pelo processamento assíncrono simples na própria aplicação para o webhook.

## Decisions

**Estrutura de Pastas:**
- **Decisão:** Separar o projeto em domínios específicos.
  - `src/graphs/`: Conterá os fluxos do LangGraph (ex: `intentGraph.ts`).
  - `src/infra/`: Conexões e instâncias globais (`db.ts`, `llm.ts`).
  - `src/services/`: Clientes para APIs externas (`evolutionApi.ts`).
  - `src/api/`: Controladores e roteadores do Express (`webhook.ts`).
- **Alternativa Considerada:** Manter tudo no `index.ts`. Descartada por não escalar e dificultar testes e manutenibilidade.

**LangGraph e Memória:**
- **Decisão:** Utilizar LangGraph para orquestração (nós: `analyze_sentiment`, `generate_loving_response`, `send_whatsapp_message`). Usar o mecanismo de *checkpointer* integrado usando PostgreSQL (ex: `@langchain/langgraph-checkpoint-postgres`) para gravar o estado e a memória da conversa associada ao thread_id (número do usuário). Adicionalmente, implementar um mecanismo de "windowing" ou poda (trimming) para manter o contexto limitado às últimas N mensagens (ex: últimas 10), garantindo que não ultrapasse o limite de tokens da LLM a longo prazo.
- **Justificativa:** Fornece histórico nativo, enquanto a restrição (window) previne falhas de tokens e custos exorbitantes em conversas longas.

**Filtragem de Webhook:**
- **Decisão:** Adicionar um *middleware* na rota de webhook para checar se o `remoteJid` corresponde ao permitido e verificar se o payload corresponde a uma mensagem em formato de texto. Ignorar imagens, áudios, etc. Se for inválido, retornar `200 OK` sem invocar o grafo.

**Integração LLM (OpenRouter):**
- **Decisão:** Instanciar o `ChatOpenAI` da LangChain (que é compatível) apontando para o *basePath* do OpenRouter.

## Risks / Trade-offs

- **[Risk] Exceções Silenciosas no Grafo em Background:** Retornar 200 OK e rodar o `.invoke()` em background pode derrubar a aplicação caso hajam exceções de API sem tratamento adequado.
  - **Mitigation:** Criar uma função "wrapper" robusta com `try/catch` geral para a execução em background do grafo, documentando os erros em log ou Sentry.
- **[Risk] Latência na análise da LLM e Timeouts:** Responder de forma bloqueante no webhook pode causar timeouts.
  - **Mitigation:** Responder `200 OK` ao webhook imediatamente e processar o Graph de forma assíncrona (background).
- **[Risk] Custo e Limite de API no OpenRouter:** Mensagens longas ou abuso da API.
  - **Mitigation:** Implementar limite de tokens ou validação de tamanho de mensagem no payload antes de enviar à LLM.
- **[Risk] Quedas na Conexão com o PostgreSQL:**
  - **Mitigation:** Usar pool de conexões e tratar os erros caso a gravação de estado falhe.
