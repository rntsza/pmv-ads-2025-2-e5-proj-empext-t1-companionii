import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '../mailer/mailer.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): JwtModuleOptions => {
        const expiresRaw = cfg.get<string>('JWT_EXPIRES_IN');
        const expiresIn = expiresRaw ? Number(expiresRaw) : undefined;

        return {
          secret: cfg.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
