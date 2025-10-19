import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProjectTagsQueryDto {
  @ApiPropertyOptional({
    description: 'Filtro opcional por nome',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Limite opcional',
  })
  @IsOptional()
  @IsString()
  take?: string;
}
