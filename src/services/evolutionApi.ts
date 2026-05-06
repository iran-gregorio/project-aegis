import dotenv from 'dotenv';

dotenv.config();

export class EvolutionAPI {
  private static baseUrl = process.env.EVOLUTION_API_URL || '';
  private static apiKey = process.env.EVOLUTION_API_KEY || '';
  private static instanceName = process.env.EVOLUTION_INSTANCE_NAME || '';

  static async sendMessage(remoteJid: string, text: string, quotedMessageId?: string) {
    if (!this.baseUrl || !this.apiKey || !this.instanceName) {
      console.warn("Evolution API credentials missing.");
      return;
    }

    const endpoint = `${this.baseUrl}/message/sendText/${this.instanceName}`;
    const payload: any = {
      number: remoteJid,
      text: text,
    };

    if (quotedMessageId) {
      payload.quoted = {
        key: {
          id: quotedMessageId
        }
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.log(response)
        throw new Error(`Evolution API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao enviar mensagem pela Evolution API:", error);
      throw error;
    }
  }
}
