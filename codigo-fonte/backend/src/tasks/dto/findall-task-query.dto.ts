import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BoardStatus } from '@prisma/client';

export class ListTasksQueryDto {
  @ApiPropertyOptional({
    description: 'ID do projeto',
    example: 'proj_123',
  })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Status do quadro',
    enum: BoardStatus,
    example: 'OPEN',
  })
  @IsEnum(BoardStatus)
  @IsOptional()
  status?: BoardStatus;
}
