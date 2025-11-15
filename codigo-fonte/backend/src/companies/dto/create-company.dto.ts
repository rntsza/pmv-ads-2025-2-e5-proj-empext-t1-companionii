import { IsOptional, IsString, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'PUC Minas',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da empresa',
    example: 'Universidade de Minas Gerais',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Cor principal da empresa em formato hexadecimal',
    example: '#3498db',
  })
  @IsOptional()
  @IsHexColor()
  colorHex?: string;
}
