## ADDED Requirements

### Requirement: Envio de mensagens via Evolution API
O sistema MUST ser capaz de enviar a resposta gerada pela IA de volta para o remetente usando a Evolution API.

#### Scenario: Resposta gerada com sucesso
- **WHEN** a IA gera uma resposta amorosa para uma mensagem
- **THEN** o sistema envia a mensagem para o WhatsApp do remetente através de uma requisição HTTP para a Evolution API, incluindo o ID da mensagem original (ex: `stanzaId`) para respondê-la de forma citada (reply).
