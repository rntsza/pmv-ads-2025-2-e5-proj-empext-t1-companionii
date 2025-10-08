import { IsEnum, IsOptional, IsUUID, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({
    enum: Scope,
    description:
      'Escopo do relatório: "all" para todos os projetos ou "project" para um projeto específico.',
    example: Scope.ALL,
  })
  @IsEnum(Scope)
  scope: Scope;

  @ApiPropertyOptional({
    description: 'ID do projeto (UUID). Obrigatório se o escopo for "project".',
    example: 'b3b1c2d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({
    enum: Period,
    description: 'Período do relatório: "daily", "weekly" ou "custom".',
    example: Period.DAILY,
  })
  @IsEnum(Period)
  period: Period;

  @ApiPropertyOptional({
    description:
      'Data de início no formato ISO8601. Obrigatório se o período for "custom".',
    example: '2024-06-01',
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'Data de término no formato ISO8601. Obrigatório se o período for "custom".',
    example: '2024-06-30',
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;
}
