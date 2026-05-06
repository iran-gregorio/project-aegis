## ADDED Requirements

### Requirement: Integração de LLM via OpenRouter
O projeto SHALL utilizar a API do OpenRouter para executar os modelos de linguagem necessários no processamento das mensagens.

#### Scenario: Chamada de LLM
- **WHEN** o nó do LangGraph solicita uma inferência ou geração de texto
- **THEN** o sistema faz a requisição autenticada para o endpoint do OpenRouter recebendo a resposta gerada pelo modelo selecionado.
