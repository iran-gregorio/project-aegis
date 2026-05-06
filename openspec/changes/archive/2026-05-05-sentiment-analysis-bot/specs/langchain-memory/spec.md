## ADDED Requirements

### Requirement: Persistência de memória da conversa
O LangChain MUST utilizar um checkpointer conectado ao PostgreSQL para salvar o estado (memória) de cada thread de conversa.

#### Scenario: Nova mensagem em uma conversa existente
- **WHEN** uma mensagem é recebida de um remetente
- **THEN** o sistema recupera o histórico da conversa do PostgreSQL, aplica a técnica de "trimming" ou "windowing" para manter apenas as N mensagens mais recentes (ex: últimas 10) e fornece ao LangChain, evitando estouro do limite de tokens antes de processar a nova mensagem.
