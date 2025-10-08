import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BoardStatus } from '@prisma/client';

export class ListTasksQueryDto {
  @ApiProperty({
    description: 'ID do projeto',
    example: 'proj_123',
  })
  @IsString()
  projectId!: string;

  @ApiPropertyOptional({
    description: 'Status do quadro',
    enum: BoardStatus,
    example: 'OPEN',
  })
  @IsEnum(BoardStatus)
  @IsOptional()
  status?: BoardStatus;
}
