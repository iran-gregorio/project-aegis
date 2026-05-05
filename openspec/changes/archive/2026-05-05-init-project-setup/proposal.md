## Why

Este é o primeiro passo para a construção do projeto do chatbot, com o objetivo de estabelecer a infraestrutura inicial e os artefatos essenciais. A criação dessa base estrutural é fundamental para garantir um ambiente executável, orquestrado via Docker e com variáveis de ambiente configuradas, antes de avançarmos para a complexidade real do fluxo conversacional.

## What Changes

- Inicialização do projeto base (ex: package.json com dependências essenciais do LangChain e Express para webhooks).
- Criação do arquivo `.gitignore` padrão para Node.js.
- Criação de um arquivo `.env` (e/ou `.env.example`) com as variáveis de ambiente requeridas para PostgreSQL, Redis, Evolution API e OpenRouter.
- Criação de um `Dockerfile` que define e constrói a imagem do projeto.
- Criação de um arquivo `docker-compose.yml` capaz de subir a imagem do projeto, o banco PostgreSQL, o Redis e a Evolution API.
- Criação de um servidor web mínimo expondo uma rota de webhook.
- Criação de um grafo de conversação (LangGraph) mínimo/simples, do tipo "echo", acionado por essa rota de webhook, cujo único propósito é validar que o projeto roda e consegue receber/enviar mensagens.

## Capabilities

### New Capabilities
- `project-infrastructure`: Configuração inicial do repositório, containerização (Docker) e orquestração de serviços locais via Docker Compose (PostgreSQL, Redis, Evolution API e Web Server).
- `basic-echo-bot`: Fluxo simplificado (echo) servido via rota de webhook para validar a execução do bot, retornando o mesmo texto recebido.

### Modified Capabilities

## Impact

- Criação dos arquivos raiz do projeto (`Dockerfile`, `docker-compose.yml`, `.env`, `.gitignore`).
- Estruturação básica do diretório de código-fonte (`src/`).
- O PostgreSQL será a base única tanto para a Evolution API quanto futuramente para o estado do nosso Bot.

## Non-goals

- Criar fluxos de conversação ou "graphs" avançados e integrados de fato a uma LLM (OpenRouter).
- Implementar as rotinas completas de persistência no PostgreSQL (ex: instalação de ORM) ou de consumo profundo da Evolution API neste momento.
- Configurar domínios e certificados SSL para a Evolution API.
