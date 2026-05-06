## ADDED Requirements

### Requirement: Analisar sentimento e intenção da mensagem
A IA SHALL analisar as mensagens recebidas para identificar palavras-chave agressivas e a intenção de agressividade.

#### Scenario: Intenção agressiva detectada
- **WHEN** a mensagem contiver palavras-chave agressivas ou tom agressivo
- **THEN** a IA deve classificar a intenção como agressiva e gerar uma resposta com tom amoroso.

#### Scenario: Intenção não agressiva detectada
- **WHEN** a mensagem for neutra, amigável ou não contiver agressividade
- **THEN** a IA deve classificar a intenção como não agressiva e decidir não responder com nenhuma mensagem.
