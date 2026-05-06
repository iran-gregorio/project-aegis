import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

export const llm = new ChatOpenAI({
  modelName: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost",
      "X-Title": process.env.YOUR_SITE_NAME || "Chatbot Langchain WhatsApp",
    }
  }
});
