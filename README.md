# Project Aegis

Um chatbot inteligente projetado para analisar sentimentos e lidar com agressividade no WhatsApp. Construído com uma arquitetura moderna e orientada a grafos, ele atua analisando mensagens através de LLMs e respondendo com calma e empatia quando uma ofensa ou estresse é detectado.

## 🚀 Tecnologias Envolvidas

- **[Node.js (v22 LTS)](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)**: Base da aplicação.
- **[LangChain](https://js.langchain.com/) & [LangGraph](https://langchain-ai.github.io/langgraphjs/)**: Orquestração do fluxo conversacional e memória baseada em estado.
- **[OpenRouter](https://openrouter.ai/)**: Integração unificada para modelos avançados de IA (LLMs).
- **[Evolution API](https://github.com/EvolutionAPI/evolution-api)**: Integração com o WhatsApp de forma simples e robusta (via Baileys).
- **[PostgreSQL](https://www.postgresql.org/)**: Checkpointer e persistência de memória conversacional do LangGraph.
- **[Redis](https://redis.io/)**: Cache em memória (utilizado pela Evolution API).
- **[Docker & Docker Compose](https://www.docker.com/)**: Containerização total do ambiente.

## 🧠 Como Funciona

1. O usuário envia uma mensagem para o WhatsApp conectado à **Evolution API**.
2. A Evolution API dispara um *Webhook* recebido pela nossa API em Node.js.
3. A rota aceita a requisição IMEDIATAMENTE (HTTP 200 OK) para evitar timeouts da Evolution e despacha o processamento em background (Assíncrono).
4. O nó de **Análise de Sentimento** do **LangGraph** avalia o histórico recente de mensagens e a nova interação.
5. Se o sentimento for classificado como "Agressivo" (`aggressive`), o nó gerador de resposta entra em ação para fornecer uma resposta curta, empática e acalmadora.
6. A resposta é despachada via requisição HTTP (REST) de volta para a Evolution API.
7. Se for uma mensagem neutra ou amigável, o bot ignora silenciosamente sem consumir processamento desnecessário.

## 📂 Estrutura do Projeto

```text
├── src/
│   ├── api/          # Webhooks (recepção de dados da Evolution API)
│   ├── graphs/       # Definição dos nós e do grafo de intenção (LangGraph)
│   ├── infra/        # Configurações de conexão (PostgreSQL, LLM via OpenRouter)
│   ├── services/     # Serviços externos (Envio de POST para a Evolution API)
│   └── index.ts      # Ponto de entrada do servidor Express
├── openspec/         # Especificações técnicas e arquitetura detalhada
├── docker-compose.yml# Orquestração dos containers (Bot, Evolution, Postgres, Redis)
├── Dockerfile        # Construção da imagem Docker do Bot
├── tsconfig.json     # Configuração do TypeScript
└── package.json      # Dependências do projeto (tsx, langchain, pg, etc)
```

## ⚙️ Como Executar o Projeto

### 1. Pré-requisitos
- Ter o [Docker](https://docs.docker.com/get-docker/) e o [Docker Compose](https://docs.docker.com/compose/install/) instalados na sua máquina.

### 2. Configurando o Ambiente
Faça uma cópia do arquivo de configuração de exemplo para criar o seu arquivo local de variáveis de ambiente:

```bash
cp .env.example .env
```

Abra o arquivo `.env` gerado e preencha as variáveis de ambiente necessárias:
- `OPENROUTER_API_KEY`: Sua chave de acesso da API do OpenRouter.
- `OPENROUTER_MODEL`: O modelo desejado (ex: `openai/gpt-4o-mini`).
- `EVOLUTION_API_GLOBAL_KEY`: Uma chave segura configurada globalmente para a Evolution.
- `EVOLUTION_API_KEY`: Chave específica que será associada à sua instância do WhatsApp.
- `EVOLUTION_INSTANCE_NAME`: O nome da instância (ex: `Whatsapp`).
- `ALLOWED_PHONE_NUMBER`: Número específico autorizado a usar/testar o Bot (DDI+DDD+Número, ex: `5511999999999`).

### 3. Subindo a Infraestrutura

Abra o terminal na pasta raiz do projeto e execute:

```bash
docker compose up -d --build
```

O comando irá montar a imagem do bot e subir quatro containers de forma autônoma:
- `evolution_postgres` (Banco de Dados do LangGraph e da Evolution)
- `evolution_redis` (Cache da Evolution API)
- `evolution_api` (O serviço que dialoga com o WhatsApp via WebSockets do Baileys)
- `chatbot` (A nossa inteligência artificial feita em TypeScript e Express)

Para acompanhar os logs específicos do bot:
```bash
docker compose logs -f bot
```

### 4. Conectando seu WhatsApp à Evolution API

1. Conecte-se com a Evolution API e crie uma nova instância através de Postman/cURL ou interface utilizando o `EVOLUTION_INSTANCE_NAME` e o token definido no seu `.env`.
2. Configure o Webhook na Evolution API para enviar eventos de mensagens para a URL interna dentro do Docker: `http://bot:3000/webhook`.
3. Escaneie o QR Code retornado com o seu aparelho celular.
4. Envie uma mensagem pelo WhatsApp teste validando tanto interações amigáveis quanto gatilhos de agressividade para acompanhar a IA respondendo em tempo real.

## 📝 Documentação Adicional
Detalhes mais avançados sobre fluxos e comportamentos da IA encontram-se na pasta raiz do framework OpenSpec em `openspec/`.
