import { Transform } from 'class-transformer';
import { IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de redefinição de senha enviado por e-mail.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description:
      'Nova senha do usuário. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.',
    example: 'NovaSenha@2024',
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
