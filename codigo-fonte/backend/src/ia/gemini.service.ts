import { Inject, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiOptions = {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  timeoutMs: number;
};

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(@Inject('GEMINI_OPTS') private readonly opts: GeminiOptions) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async htmlFromFacts(systemPrompt: string, facts: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.opts.model,
      generationConfig: {
        temperature: this.opts.temperature,
        maxOutputTokens: this.opts.maxOutputTokens,
        candidateCount: 1,
        responseMimeType: 'text/html',
      },
      systemInstruction: systemPrompt,
    });

    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), this.opts.timeoutMs);

    try {
      const res = await model.generateContent(
        {
          contents: [
            {
              parts: [
                {
                  text: `Gere um relatório em HTML. Dados a seguir em JSON:
${facts}

Requisitos:
- Retorne APENAS HTML (sem <html>, <head>).
- Seções: <h2>Resumo Executivo</h2>, <h2>Detalhado</h2>, <h2>Métricas</h2>, <h2>Próximas Ações</h2>.
- Não inclua dados fora do JSON.
- Quando aplicável, agrupe por empresa e projeto.`,
                },
              ],
              role: 'user',
            },
          ],
        },
        { signal: controller.signal as any },
      );

      return res.response.text();
    } finally {
      clearTimeout(to);
    }
  }
}
