import { StateGraph, START, END } from '@langchain/langgraph';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { pool } from '../infra/db.js';
import { llm } from '../infra/llm.js';
import { EvolutionAPI } from '../services/evolutionApi.js';
import { SystemMessage, BaseMessage } from '@langchain/core/messages';

export interface AgentState {
  messages: BaseMessage[];
  messageId: string; 
  intent: 'aggressive' | 'neutral' | 'unknown';
  response_text?: string;
  remoteJid: string; 
}

const graphState = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  messageId: {
    value: (x: string, y: string) => y ?? x,
    default: () => '',
  },
  intent: {
    value: (x: string, y: string) => y ?? x,
    default: () => 'unknown',
  },
  response_text: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  remoteJid: {
    value: (x: string, y: string) => y ?? x,
    default: () => '',
  }
};

const trimMessages = (messages: BaseMessage[], limit: number = 10): BaseMessage[] => {
    if (messages.length > limit) {
        return messages.slice(messages.length - limit);
    }
    return messages;
}

const analyzeSentimentNode = async (state: AgentState) => {
  const recentMessages = trimMessages(state.messages, 10);
  
  const systemPrompt = new SystemMessage(`Você é um assistente analisador de sentimentos. 
  Sua única tarefa é analisar as últimas mensagens do usuário e responder EXATAMENTE com uma única palavra:
  - "aggressive" se o usuário usar palavras de baixo calão, xingamentos, ameaças ou demonstrar raiva clara.
  - "neutral" caso contrário (dúvidas, saudações, neutro).`);
  
  const response = await llm.invoke([systemPrompt, ...recentMessages]);
  const content = response.content.toString().toLowerCase().trim();
  
  const intent = content.includes('aggressive') ? 'aggressive' : 'neutral';
  console.log(`Intent analisado: ${intent}`);
  return { intent };
};

const generateResponseNode = async (state: AgentState) => {
  const recentMessages = trimMessages(state.messages, 10);

  const systemPrompt = new SystemMessage(`Você é um assistente extremamente amoroso, empático e pacificador.
  O usuário está muito bravo ou foi agressivo. 
  Sua tarefa é responder de forma curta, muito calma, amorosa e demonstrando muita paciência.
  Tente acalmar a pessoa com compaixão e sem retrucar a ofensa.`);

  const response = await llm.invoke([systemPrompt, ...recentMessages]);
  
  return { 
    response_text: response.content.toString(),
    messages: [response]
  };
};

const sendWhatsappNode = async (state: AgentState) => {
  if (state.response_text && state.remoteJid) {
    console.log(`Enviando resposta para ${state.remoteJid}: ${state.response_text}`);
    await EvolutionAPI.sendMessage(state.remoteJid, state.response_text, state.messageId);
  }
  return {};
};

const routeIntent = (state: AgentState) => {
  if (state.intent === 'aggressive') {
    return 'generateResponse';
  }
  console.log("Intenção neutra, não iremos responder nada.");
  return END;
};

const builder = new StateGraph<AgentState>({ channels: graphState as any })
  .addNode("analyzeSentiment", analyzeSentimentNode)
  .addNode("generateResponse", generateResponseNode)
  .addNode("sendWhatsapp", sendWhatsappNode)
  .addEdge(START, "analyzeSentiment")
  .addConditionalEdges("analyzeSentiment", routeIntent, {
    "generateResponse": "generateResponse",
    [END]: END
  })
  .addEdge("generateResponse", "sendWhatsapp")
  .addEdge("sendWhatsapp", END);

export const checkpointer = new PostgresSaver(pool);

export async function setupCheckpointer() {
  await checkpointer.setup();
}

export const intentGraph = builder.compile({ checkpointer });
