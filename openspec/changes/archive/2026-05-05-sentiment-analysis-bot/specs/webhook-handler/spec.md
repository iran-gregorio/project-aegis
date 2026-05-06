## ADDED Requirements

### Requirement: Filtrar requisições por número autorizado
O webhook MUST processar apenas mensagens originadas de um número de WhatsApp específico configurado no sistema.

#### Scenario: Recebimento de mensagem de número autorizado
- **WHEN** um webhook traz uma mensagem do número autorizado
- **THEN** o sistema aceita a requisição e encaminha a mensagem para processamento pelo LangGraph.

#### Scenario: Recebimento de mensagem de número não autorizado
- **WHEN** um webhook traz uma mensagem de qualquer outro número não configurado
- **THEN** o sistema ignora a mensagem e retorna uma resposta de sucesso HTTP (200 OK) para não bloquear o serviço, não acionando a IA.

#### Scenario: Recebimento de mensagem sem conteúdo de texto
- **WHEN** um webhook recebe mídia (áudio, imagem, figurinha) ao invés de texto
- **THEN** o sistema ignora o payload silenciosamente e retorna sucesso (200 OK), não enviando a mensagem para a IA analisar.
