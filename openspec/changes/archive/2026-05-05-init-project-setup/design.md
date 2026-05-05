## Context

Este projeto visa a criação de um ChatBot para WhatsApp, integrando Evolution API, OpenRouter e PostgreSQL. Atualmente, o repositório carece de toda a infraestrutura inicial de código, containerização e configuração de ambiente. Este documento define as decisões técnicas para estabelecer a base executável do projeto, garantindo que o ambiente de desenvolvimento seja facilmente replicável e orquestrado.

## Goals / Non-Goals

**Goals:**
- Configurar o projeto base em Node.js (v22 LTS).
- Estabelecer a gestão de variáveis de ambiente com um modelo (`.env.example`).
- Containerizar o projeto com um `Dockerfile` otimizado.
- Orquestrar o ecossistema local (Evolution API, Redis, PostgreSQL, e o próprio Webhook do Bot) através de um `docker-compose.yml`.
- Criar um servidor HTTP (Express) mínimo contendo uma rota de webhook e um fluxo de teste (echo) usando LangChain/LangGraph.

**Non-Goals:**
- Definir arquitetura avançada de pastas para o projeto final (DDD, Clean Arch, etc.).
- Implementar ORMs (Prisma, Drizzle) ou gerenciar migrações de banco nesta fase.
- Implementar fluxos complexos e integrados de LangGraph com o OpenRouter.

## Decisions

**Node.js v22 e ESM**
O projeto utilizará Node.js na versão 22 (LTS) habilitando o uso de ECMAScript Modules (`type: "module"` no `package.json`). Isso está alinhado com as práticas modernas de JavaScript e melhor suportado por bibliotecas recentes como LangChain.

**Servidor HTTP para Webhooks**
Ao invés de rodar apenas um script em loop no terminal, usaremos `express` para subir um servidor web. Isso é indispensável pois a Evolution API se comunica ativamente via Webhooks (HTTP POST). Nossa aplicação precisa escutar essa porta desde o dia 1.

**Docker Compose como Orquestrador Local**
A stack envolve quatro componentes principais:
1.  **PostgreSQL**: Banco de dados relacional (para Evolution API e futuramente para nosso Bot).
2.  **Redis**: Utilizado pela Evolution API para cache, fila de mensagens e gestão de instâncias.
3.  **Evolution API**: Provedor da API de WhatsApp.
4.  **ChatBot (Nosso projeto)**: Construído a partir do `Dockerfile` local, expondo a porta do servidor HTTP.

**Basic Echo Bot com LangGraph**
Na rota do webhook, instanciaremos um *StateGraph* muito simples que recebe a payload e retorna a mesma mensagem de volta.

## Risks / Trade-offs

- **[Risco] Evolution API Configuration**: A Evolution API pode exigir algumas configurações específicas (como URL da API, Global API Key, etc.) para inicializar corretamente via Docker Compose.
  - **Mitigação**: O `docker-compose.yml` será configurado com os ambientes mínimos necessários no `.env`.
- **[Risco] Pesos de imagem Docker**: Imagens Node podem ficar pesadas.
  - **Mitigação**: O `Dockerfile` usará imagens base Alpine ou slim (`node:22-alpine` ou `node:22-slim`) para otimização de tamanho.
