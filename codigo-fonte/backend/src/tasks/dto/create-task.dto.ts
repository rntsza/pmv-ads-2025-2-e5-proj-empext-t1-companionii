import { BoardStatus, TaskPriority } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'ID do projeto ao qual a tarefa pertence',
    example: 'b3e1a7c2-8f1e-4e2a-9c2b-123456789abc',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar autenticação de usuário',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Desenvolver o fluxo de login e registro de usuários.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    enum: BoardStatus,
    example: BoardStatus.TODO,
  })
  @IsOptional()
  @IsEnum(BoardStatus)
  status?: BoardStatus;

  @ApiPropertyOptional({
    description: 'Prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Data de vencimento da tarefa (ISO 8601)',
    example: '2024-07-01T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Tempo estimado para conclusão em minutos',
    example: 120,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedMin?: number;

  @ApiPropertyOptional({
    description: 'Lista de tags associadas à tarefa',
    example: ['backend', 'urgente'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
