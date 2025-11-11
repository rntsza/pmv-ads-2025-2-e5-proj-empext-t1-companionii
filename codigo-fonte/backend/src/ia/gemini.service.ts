import { Inject, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIReportData } from './types/ia-report.types';
import { AiReportSchema } from './types/ia-report.schema';

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

  async jsonFromFacts(
    systemPrompt: string,
    facts: string,
  ): Promise<AIReportData> {
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
          role: 'user',
          parts: [
            {
              text: `Gere SOMENTE JSON válido seguindo o schema. Fatos:\n${facts}`,
            },
          ],
        },
      ],
    });

    const raw = res.response.text().trim();

    const sanitized = raw.replace(/^```json\s*|\s*```$/g, '');

    let parsed: unknown;
    try {
      parsed = JSON.parse(sanitized);
    } catch (err) {
      throw new Error(`IA retornou JSON inválido: ${err.message}`);
    }

    const validated = AiReportSchema.parse(parsed);
    return {
      ...validated,
      generatedAt: new Date().toISOString(),
    };
  }
}
