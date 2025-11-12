import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindallTaskActivitiesQueryDto {
  @ApiPropertyOptional({
    description: 'Cursor para paginação',
    example: 'act_456',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Número máximo de atividades a serem retornadas',
    example: '10',
  })
  @IsOptional()
  @IsString()
  take?: string;
}
