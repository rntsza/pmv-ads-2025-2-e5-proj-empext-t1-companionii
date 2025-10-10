import { Inject, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiOptions = {
  model: string;
  temperature: number;
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
        candidateCount: 1,
        responseMimeType: 'text/plain',
      },
      systemInstruction: systemPrompt,
    });
    const res = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: `Gere um relatório em HTML com base no JSON de fatos a seguir:
${facts}

Requisitos do HTML:
- Não inclua <html> ou <head>; apenas o conteúdo que vai dentro do <body>.
- Seções: <h2>Resumo Executivo</h2>, <h2>Detalhado</h2>, <h2>Métricas</h2>, <h2>Próximas Ações</h2>.
- Não inclua Markdown como marcadores de linguagem ou crases, nem comentários.
- Não invente dados; use somente o que está nos fatos.'
- Use classes do Tailwind CSS para formatação (ex: 'text-red-500', 'font-bold', 'mb-4', 'p-2', 'border', 'rounded').
- Quando aplicável, agrupe por empresa e projeto.`,
            },
          ],
          role: 'user',
        },
      ],
    });
    return res.response.text();
  }
}
