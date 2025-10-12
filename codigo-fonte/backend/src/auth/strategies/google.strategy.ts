// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ConfigService } from '@nestjs/config';
// import { OAuthProvider } from '@prisma/client';
// import { Profile, Strategy } from 'passport-google-oauth20';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     cfg: ConfigService,
//     private prisma: PrismaService,
//   ) {
//     super({
//       clientID: cfg.get<string>('GOOGLE_CLIENT_ID') as string,
//       clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET') as string,
//       callbackURL: cfg.get<string>('GOOGLE_CALLBACK_URL') as string,
//       scope: ['profile', 'email'],
//     });
//   }

//   async validate(
//     _accessToken: string,
//     _refreshToken: string,
//     profile: Profile,
//   ) {
//     const email = profile.emails?.[0]?.value;
//     if (!email) throw new Error('Google profile without email verified');

//     const provider = OAuthProvider.GOOGLE;
//     const providerAccountId = profile.id;

//     const account = await this.prisma.account.findUnique({
//       where: { provider_providerAccountId: { provider, providerAccountId } },
//       include: { user: true },
//     });

//     if (account) return account.user;

//     const user = await this.prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     return user;
//   }
// }
