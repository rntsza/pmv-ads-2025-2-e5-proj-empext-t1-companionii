import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateInviteDto {
  @ApiProperty({
    description: 'E-mail do usuário a ser convidado',
    example: 'usuario@exemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Papel do usuário convidado',
    enum: Role,
    example: Role.COLLABORATOR,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'ID da empresa associada ao convite',
    example: '64b7f2c9e4b0c8a1d2e4f123',
  })
  @IsOptional()
  @IsString()
  companyId?: string;
}
