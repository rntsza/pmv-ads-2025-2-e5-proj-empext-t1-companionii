import { Transform } from 'class-transformer';
import { IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
  @ApiProperty({
    example: 'invite-token-123',
    description: 'Token de convite recebido por e-mail.',
  })
  @IsString()
  token: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário.' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'SenhaForte@123',
    description:
      'Senha forte contendo pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.',
    minLength: 8,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
