## 1. Configuração do Projeto Base

- [x] 1.1 Inicializar o projeto Node.js (`npm init -y`) e configurar `"type": "module"` no `package.json`.
- [x] 1.2 Instalar as dependências essenciais (ex: `@langchain/core`, `@langchain/langgraph`, `express`, `dotenv`).
- [x] 1.3 Criar o arquivo `.gitignore` listando diretórios e arquivos a serem ignorados (ex: `node_modules`, `.env`).
- [x] 1.4 Criar o arquivo `.env.example` prevendo variáveis para o PostgreSQL, Redis, Evolution API e OpenRouter.

## 2. Docker e Orquestração

- [x] 2.1 Criar um `Dockerfile` leve (utilizando `node:22-alpine` ou equivalente) para a aplicação do bot.
- [x] 2.2 Criar um `docker-compose.yml` declarando quatro serviços: `postgres`, `redis`, `evolution-api` e `bot`.
- [x] 2.3 Configurar as redes, volumes, mapeamento de portas e dependências entre os containers no `docker-compose.yml`.

## 3. Implementação do Servidor Web e Echo Bot

- [x] 3.1 Criar a estrutura inicial de pastas de código (ex: `/src`) e um arquivo de entrada (ex: `src/index.js`) configurando o servidor Express.
- [x] 3.2 Criar uma rota (ex: `POST /webhook`) preparada para receber as mensagens enviadas pela Evolution API.
- [x] 3.3 Implementar um *StateGraph* rudimentar utilizando LangGraph que recupere a mensagem e responda a mesma (echo).
- [x] 3.4 Conectar a rota do webhook à invocação do grafo, lidando com a payload e retornando o resultado final.
- [x] 3.5 Adicionar um script em `package.json` (ex: `"start": "node src/index.js"`) para executar o servidor localmente.
