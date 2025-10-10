import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from '../common/guards/google.guard';
import { ForgotPasswordDto } from './dto/forgot-password';
import { ResetPasswordDto } from './dto/reset-password';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private cfg: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const validatedUser = await this.auth.validate(dto.email, dto.password);
    const token = this.auth.sign({
      id: validatedUser.id,
      email: validatedUser.email,
      role: validatedUser.role,
    });
    const user = {
      id: validatedUser.id,
      name: validatedUser.name,
      imageUrl: validatedUser.imageUrl,
    };
    return { user, token: token.access_token };
  }

  @Post('forgot-password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  async forgot(@Body() dto: ForgotPasswordDto) {
    return await this.auth.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  async reset(@Body() dto: ResetPasswordDto) {
    return await this.auth.resetPassword(dto.token, dto.password);
  }

  @Post('accept-invite')
  @UseGuards(ThrottlerGuard)
  async acceptInvite(@Body() dto: AcceptInviteDto, @Res() res: Response) {
    const token = await this.auth.acceptInvite(
      dto.token,
      dto.name,
      dto.password,
    );
    const redirect = this.cfg.get<string>('INVITE_SUCCESS_REDIRECT');
    if (redirect) {
      return res.redirect(`${redirect}?token=${token.access_token}`);
    }
    return res.json(token);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  googleLogin() {
    // redirect to Google OAuth2 login page
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  googleCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user; // came from GoogleStrategy.validate() and attached to req by Passport
    const token = this.auth.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const url = this.cfg.get<string>('OAUTH_SUCCESS_REDIRECT');
    if (url) {
      const redirect = `${url}?token=${token.access_token}`;
      return res.redirect(redirect);
    }
    return res.json(token);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.auth.getProfile(userId);
    const finalUser = {
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
    };
    return finalUser;
  }
}
