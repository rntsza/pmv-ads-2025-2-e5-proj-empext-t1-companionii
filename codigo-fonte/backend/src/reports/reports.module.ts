import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { GeminiService } from 'src/ia/gemini.service';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    GeminiService,
    {
      provide: 'GEMINI_OPTS',
      useFactory: () => ({
        model: process.env.AI_REPORT_MODEL || 'gemini-1.5-pro',
        temperature: Number(process.env.AI_REPORT_TEMPERATURE || 0.2),
        maxOutputTokens: Number(
          process.env.AI_REPORT_MAX_OUTPUT_TOKENS || 2048,
        ),
        timeoutMs: Number(process.env.AI_REPORT_TIMEOUT_MS || 15000),
      }),
    },
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
