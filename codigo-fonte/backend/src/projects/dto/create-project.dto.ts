import { IsHexColor, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Nome do projeto',
    example: 'Projeto Companion II',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'ID da empresa associada ao projeto',
    example: 'b3b8e2c4-5f6a-4c3a-9e2d-1a2b3c4d5e6f',
  })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Nome do cliente/empresa (caso não tenha o companyId)',
    example: 'PUC Minas',
  })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({
    description: 'Descrição do projeto',
    example: 'Projeto de extensão universitária para acompanhamento de alunos.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Cor do projeto em formato hexadecimal',
    example: '#FF5733',
  })
  @IsOptional()
  @IsHexColor()
  colorHex?: string;
}
