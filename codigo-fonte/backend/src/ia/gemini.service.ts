import { Inject, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { AIReportData, IAReportStatus } from './types/ia-report.types';

export type GeminiOptions = {
  model: string;
  temperature: number;
};

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(@Inject('GEMINI_OPTS') private readonly opts: GeminiOptions) {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ ERRO: GEMINI_API_KEY não definida no .env');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async jsonFromFacts(
    systemPrompt: string,
    facts: string,
    userId: string 
  ): Promise<AIReportData> {
    try {
      const modelName = this.opts.model || 'gemini-2.5-flash';
      console.log(`🤖 Gerando relatório para user: ${userId} com modelo: ${modelName}`);

      const model = this.genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: this.opts.temperature,
          responseMimeType: 'application/json', // Requer modelo 1.5+
        },
      });

      const fullPrompt = `Analise estes dados e retorne APENAS o JSON solicitado:\n${facts}`;

      const res = await model.generateContent(fullPrompt);
      const raw = res.response.text();
      const sanitized = raw.replace(/```json/g, '').replace(/```/g, '').trim();

      let parsed: any;
      try {
        parsed = JSON.parse(sanitized);
      } catch (e) {
        // Fallback de erro JSON: A IA não respondeu com o formato correto
        throw new Error('A IA não retornou um formato JSON válido.');
      }
      
      // Construção do Objeto Completo com Fallbacks Seguros
      const report: AIReportData = {
        id: uuidv4(),
        userId: userId,
        // FALLBACKS: Usamos String() e || para garantir que nunca seja 'undefined'
        title: String(parsed.title || 'Relatório de IA sem título'), 
        prompt: facts,
        result: String(parsed.result || 'Erro: Conteúdo principal ausente.'),
        status: IAReportStatus.COMPLETED,
        generatedAt: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        
        // Campos Ricos (Preenchidos diretamente do JSON, se existirem)
        metrics: parsed.metrics,
        aiInsights: parsed.aiInsights,
        tasks: parsed.tasks,
        priorityDistribution: parsed.priorityDistribution,

        metadata: {
          model: modelName,
        }
      };

      return report;

    } catch (error) {
      console.error('🔥 Erro no GeminiService:', error);
      throw new Error(`Falha na IA: ${error instanceof Error ? error.message : 'Erro interno.'}`);
    }
  }
}
