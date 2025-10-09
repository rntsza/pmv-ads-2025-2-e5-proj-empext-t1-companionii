import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Scope {
  ALL = 'all',
  PROJECT = 'project',
}

export enum Period {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
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
  @IsString()
  projectId?: string;

  @ApiProperty({
    enum: Period,
    description: 'Período do relatório: "daily", "weekly" ou "monthly".',
    example: Period.DAILY,
  })
  @IsEnum(Period)
  period: Period;
}
