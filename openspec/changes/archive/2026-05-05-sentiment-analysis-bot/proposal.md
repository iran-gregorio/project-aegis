## Why

O projeto atual precisa evoluir sua arquitetura para suportar fluxos de conversação mais inteligentes e persistentes. Com a introdução da análise de sentimento e memória no LangChain, é necessário organizar melhor a base de código, separando as lógicas de inteligência artificial (graphs) das chamadas de infraestrutura (Evolution API e Banco de Dados), visando melhor escalabilidade e manutenibilidade.

## What Changes

- Evolução da estrutura de diretórios para isolar os "graphs" do LangChain da infraestrutura e comunicação com a Evolution API.
- Adição da integração com OpenRouter para o uso de modelos de IA variados.
- Inclusão da feature de memória no LangChain, utilizando o PostgreSQL para persistir o contexto das conversas.
- Substituição do antigo "echo graph" por um graph focado em identificação de intenções a partir das mensagens.
- Implementação de análise de sentimento: a IA detectará intenções e palavras-chave agressivas e responderá com mensagens amorosas. Se não houver agressividade, a mensagem será ignorada (sem resposta).
- Implementação do recurso de envio de mensagens para o WhatsApp através da Evolution API.
- Atualização do Webhook para aceitar e processar requisições originadas apenas de um número de telefone específico.

## Capabilities

### New Capabilities
- `sentiment-analyzer`: Analisa as mensagens recebidas para detectar intenções agressivas e gera uma resposta amorosa ou decide não responder.
- `whatsapp-responder`: Orquestra o envio de mensagens de resposta utilizando os endpoints da Evolution API.
- `langchain-memory`: Adiciona persistência do histórico da conversa ao LangChain conectando-se ao PostgreSQL.
- `openrouter-integration`: Abstração para envio de prompts e recebimento de predições LLM através do OpenRouter.
- `webhook-handler`: Lida com o recebimento de webhooks para filtrar e aceitar requisições de um número específico autorizado.

### Modified Capabilities
- `basic-echo-bot`: Remover o comportamento de echo.

## Impact

- **Código:** Refatoração ampla na árvore de arquivos, removendo o modelo "echo" antigo e inserindo módulos de IA, infraestrutura e memória.
- **Banco de Dados:** Novas tabelas/estruturas para salvar o checkpoint e memória do LangChain.
- **APIs Externa:** Dependência de chaves de API válidas do OpenRouter e da Evolution API para envio e recebimento, além das atualizações de filtros de webhook.

## Non-goals

- Não é objetivo deste change lidar com outras emoções ou intenções que não sejam o cenário de "agressividade".
- Não será desenvolvida nenhuma interface de usuário ou painel web para configuração do número autorizado ou exibição de métricas.
