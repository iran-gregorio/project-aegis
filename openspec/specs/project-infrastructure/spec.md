## ADDED Requirements

### Requirement: Repositório com configuração básica do Node.js
O repositório SHALL conter os arquivos essenciais para um projeto Node.js moderno, incluindo as exclusões de arquivos temporários e dependências como Express e LangChain.

#### Scenario: Instalação do projeto
- **GIVEN** que o repositório é clonado
- **WHEN** o comando `npm install` for executado
- **THEN** as dependências essenciais serão instaladas, sem rastrear a pasta `node_modules` devido ao `.gitignore`.

### Requirement: Variáveis de Ambiente Configuradas
O repositório SHALL possuir um arquivo `.env.example` (ou um `.env` com valores fictícios/padrões para testes locais) contendo as variáveis exigidas para Evolution API, OpenRouter, PostgreSQL e Redis.

#### Scenario: Copiar .env de exemplo
- **GIVEN** um ambiente de desenvolvimento novo
- **WHEN** o desenvolvedor copiar o `.env.example` para `.env`
- **THEN** as chaves essenciais estarão preparadas para o preenchimento.

### Requirement: Orquestração Local com Docker
O projeto SHALL prover `Dockerfile` e `docker-compose.yml` para criar o ambiente completo contendo o banco de dados (PostgreSQL), o cache/fila (Redis), o sistema de mensageria (Evolution API) e a própria aplicação (Web Server).

#### Scenario: Subir a aplicação via Docker Compose
- **GIVEN** o arquivo `docker-compose.yml` corretamente configurado
- **WHEN** o desenvolvedor rodar `docker compose up -d`
- **THEN** os containers do PostgreSQL, Redis, Evolution API e aplicação Node subirão com sucesso, e estarão na mesma rede Docker.
