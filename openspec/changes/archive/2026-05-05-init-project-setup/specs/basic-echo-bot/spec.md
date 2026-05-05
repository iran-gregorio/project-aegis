## ADDED Requirements

### Requirement: Servidor Web e Grafo de Conversação Mínimo
A aplicação SHALL subir um servidor HTTP (ex: Express) escutando requisições, que por sua vez instanciará e executará um grafo inicial de "echo" em resposta aos webhooks.

#### Scenario: Bot recebe Webhook e processa
- **GIVEN** que o serviço Node.js está em execução, escutando em uma porta HTTP
- **WHEN** uma requisição POST contendo uma mensagem chegar na rota de webhook
- **THEN** a rota deve invocar o grafo, processar a entrada e retornar uma saída contendo a mesma mensagem recebida.
