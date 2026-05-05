import express from 'express';
import dotenv from 'dotenv';
import { StateGraph, START, END } from '@langchain/langgraph';

dotenv.config();

const app = express();
app.use(express.json());

// Definindo o estado do grafo
const graphState = {
  message: {
    value: (oldValue, newValue) => newValue,
    default: () => ""
  }
};

const builder = new StateGraph({
  channels: graphState
});

// Nó simples de echo
builder.addNode("echo", (state) => {
  console.log("Graph processando a mensagem:", state.message);
  return { message: state.message };
});

// Fluxo: INICIO -> echo -> FIM
builder.addEdge(START, "echo");
builder.addEdge("echo", END);

const graph = builder.compile();

// Rota de webhook para a Evolution API
app.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    console.log("Webhook recebido:", JSON.stringify(payload, null, 2));

    // A Evolution API envia uma estrutura específica, vamos pegar a mensagem bruta ou toda a payload por enquanto
    const inputMessage = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    
    // Invocando o grafo de conversação
    const result = await graph.invoke({ message: inputMessage });

    // Respondendo ao webhook
    res.status(200).json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error("Erro ao processar o webhook:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot Server rodando na porta ${PORT}`);
});
