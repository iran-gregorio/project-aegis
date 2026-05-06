import express from 'express';
import dotenv from 'dotenv';
import { webhookController } from './api/webhook.js';
import { setupCheckpointer } from './graphs/intentGraph.js';

dotenv.config();

const app = express();
app.use(express.json());

// Rota de webhook apontando para o controlador isolado
app.post('/webhook', webhookController);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Inicializa o banco de dados do LangGraph Checkpointer
    await setupCheckpointer();
    console.log("Checkpointer (PostgreSQL) inicializado com sucesso.");

    app.listen(PORT, () => {
      console.log(`Bot Server rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();
