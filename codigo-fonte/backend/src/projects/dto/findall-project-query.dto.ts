import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ProjectFindAllQueryDto {
  @ApiPropertyOptional({ description: 'Filtra por ID da empresa' })
  @IsUUID()
  @IsOptional()
  companyId?: string;
}
