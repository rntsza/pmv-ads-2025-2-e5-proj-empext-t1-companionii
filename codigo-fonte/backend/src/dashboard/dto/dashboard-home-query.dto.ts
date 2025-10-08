import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class DashboardHomeQueryDto {
  @ApiPropertyOptional({ enum: ['all', 'project'], default: 'all' })
  @IsEnum(['all', 'project'] as const)
  @IsOptional()
  scope?: 'all' | 'project' = 'all';

  @ApiPropertyOptional({ description: 'UUID do projeto' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
