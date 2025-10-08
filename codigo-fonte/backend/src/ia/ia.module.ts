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
        model: cfg.get('AI_REPORT_MODEL') ?? 'gemini-1.5-pro',
        temperature: Number(cfg.get('AI_REPORT_TEMPERATURE') ?? 0.2),
        maxOutputTokens: Number(cfg.get('AI_REPORT_MAX_OUTPUT_TOKENS') ?? 2048),
        timeoutMs: Number(cfg.get('AI_REPORT_TIMEOUT_MS') ?? 15000),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [GeminiService],
})
export class IaModule {}
