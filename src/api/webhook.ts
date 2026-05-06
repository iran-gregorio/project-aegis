import { type Request, type Response } from 'express';
import { HumanMessage } from '@langchain/core/messages';
import { intentGraph } from '../graphs/intentGraph.js';
interface EvolutionWebhookPayload {
  data: {
    key: {
      remoteJid: string;
      id: string;
    };
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
    };
  };
}

export const webhookController = (req: Request, res: Response): void => {
  // 1. Responder 200 OK IMEDIATAMENTE para a Evolution API
  res.status(200).json({ status: 'received' });

  const payload = req.body as EvolutionWebhookPayload;

  // 2. Extrair informações de forma segura
  const remoteJid = payload?.data?.key?.remoteJid || '';
  const messageId = payload?.data?.key?.id || '';
  const text = payload?.data?.message?.conversation || payload?.data?.message?.extendedTextMessage?.text;

  // 3. Filtros
  const allowedPhone = process.env.ALLOWED_PHONE_NUMBER;
  if (allowedPhone && !remoteJid.includes(allowedPhone)) {
    console.log(`Mensagem ignorada: não pertence ao número autorizado (${remoteJid}).`);
    return;
  }

  if (!text) {
    console.log(`Mensagem ignorada: não é de texto ou está vazia.`);
    return;
  }

  // 4. Processamento Assíncrono com o Graph
  // O setTimeout garante que a request HTTP feche completamente antes do bot começar a pensar.
  setTimeout(() => {
    processGraphAsync(remoteJid, messageId, text);
  }, 0);
};

// Wrapper assíncrono com try/catch
async function processGraphAsync(remoteJid: string, messageId: string, text: string) {
  try {
    console.log(`Iniciando processamento para ${remoteJid} (MsgID: ${messageId}): ${text}`);

    await intentGraph.invoke(
      {
        messages: [new HumanMessage(text)],
        messageId,
        remoteJid
      },
      { configurable: { thread_id: remoteJid } }
    );
  } catch (error) {
    console.error("Erro crítico no processamento assíncrono do graph:", error);
  }
}
