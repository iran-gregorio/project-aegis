## REMOVED Requirements

### Requirement: Servidor Web e Grafo de Conversação Mínimo
**Reason**: O comportamento de echo foi substituído pelo fluxo de análise de intenção e sentimento.
**Migration**: O fluxo agora é orquestrado através do `intentGraph` e não responde com "echo". Apenas responde se houver agressividade na intenção da mensagem.
