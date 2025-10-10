import { randomBytes, createHash } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private prisma: PrismaService,
    private mailer: MailerService,
    private cfg: ConfigService,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  sign(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }

  async requestPasswordReset(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user)
      return { message: 'If exists, we will send an email with instructions' };

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const minutes = Number(this.cfg.get<string>('RESET_EXP_MINUTES'));
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000); // 30min

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const base = this.cfg.get<string>('WEBAPP_RESET_URL');
    const url = `${base}?token=${token}`;
    await this.mailer.sendPasswordReset(user.email, url);

    return { message: 'If exists, we will send an email with instructions' };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const entry = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!entry || entry.consumedAt || entry.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: entry.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { tokenHash },
        data: { consumedAt: new Date() },
      }),
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: entry.userId, consumedAt: null, NOT: { tokenHash } },
      }),
    ]);

    return { message: 'Password reseted successfully' };
  }

  async createInvite(
    invitedById: string,
    email: string,
    role?: Role,
    companyId?: string,
  ) {
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) throw new BadRequestException('User already exists');

    // Invalidate previous invites
    await this.prisma.invite.deleteMany({
      where: { email, acceptedAt: null, revokedAt: null },
    });

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const hours = Number(this.cfg.get<string>('INVITE_EXP_HOURS'));
    const expiresAt = new Date(Date.now() + hours * 3600 * 1000);

    const invite = await this.prisma.invite.create({
      data: {
        email,
        role: role,
        companyId: companyId || null,
        invitedById,
        tokenHash,
        expiresAt,
      },
    });

    const base = this.cfg.get<string>('WEBAPP_ACCEPT_INVITE_URL');
    const url = `${base}?token=${token}`;
    await this.mailer.sendInvite(email, url);

    return invite;
  }

  async acceptInvite(token: string, name: string, password: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const invite = await this.prisma.invite.findUnique({
      where: { tokenHash },
    });

    if (
      !invite ||
      invite.revokedAt ||
      invite.acceptedAt ||
      invite.expiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired invite');
    }

    const exists = await this.users.findByEmail(invite.email);
    if (exists)
      throw new BadRequestException('User with this email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const requireApproval =
      this.cfg.get<string>('REQUIRE_ADMIN_APPROVAL') === 'true';

    const user = await this.prisma.user.create({
      data: {
        name,
        email: invite.email,
        passwordHash,
        role: invite.role,
        status: requireApproval
          ? UserStatus.PENDING_APPROVAL
          : UserStatus.ACTIVE,
      },
    });

    await this.prisma.invite.update({
      where: { tokenHash },
      data: { acceptedAt: new Date() },
    });

    return this.sign({ id: user.id, email: user.email, role: user.role });
  }

  async getProfile(userId: string) {
    const user = await this.users.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
