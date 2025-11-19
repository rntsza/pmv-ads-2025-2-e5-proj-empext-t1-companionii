import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service';

@Global()
@Module({
  providers: [
    GeminiService,
    {
      provide: 'GEMINI_OPTS',
      useFactory: (cfg: ConfigService) => ({
        // Usando gemini-2.5-flash do .env, com gemini-pro como fallback SEGURO
        model: cfg.get('AI_REPORT_MODEL') ?? 'gemini-pro', 
        temperature: Number(cfg.get('AI_REPORT_TEMPERATURE') ?? 0.2),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [GeminiService],
})
export class IaModule {}
