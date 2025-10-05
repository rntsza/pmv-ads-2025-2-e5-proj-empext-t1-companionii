// src/reports/dto/generate-report.dto.ts
import { IsEnum, IsOptional, IsUUID, IsISO8601 } from 'class-validator';

export enum Scope {
  ALL = 'all',
  PROJECT = 'project',
}
export enum Period {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export class GenerateReportDto {
  @IsEnum(Scope) scope: Scope; // all | project
  @IsOptional() @IsUUID() projectId?: string;

  @IsEnum(Period) period: Period; // daily | weekly | custom
  @IsOptional() @IsISO8601() startDate?: string; // where CUSTOM
  @IsOptional() @IsISO8601() endDate?: string;
}
