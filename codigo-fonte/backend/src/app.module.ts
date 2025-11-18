import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';
import { InvitesModule } from './invites/invites.module';
import { ProjectsService } from './projects/projects.service';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IaModule } from './ia/ia.module';
import { ReportsModule } from './reports/reports.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (cfg: ConfigService) => ({
        throttlers: [
          {
            ttl: cfg.get<number>('THROTTLE_TTL', 60),
            limit: cfg.get<number>('THROTTLE_LIMIT', 10),
          },
        ],
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MailerModule,
    InvitesModule,
    ProjectsModule,
    TasksModule,
    DashboardModule,
    IaModule,
    ReportsModule,
    CompaniesModule,
  ],
  providers: [ProjectsService],
})
export class AppModule {}
