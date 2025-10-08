import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import { GenerateReportDto } from '../reports/dto/generate-report.dto';
import { DashboardHomeQueryDto } from './dto/dashboard-home-query.dto';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('home')
  async home(@Query() q: DashboardHomeQueryDto) {
    const { scope = 'all', projectId, date } = q;
    return await this.service.getHome({ scope, projectId, date });
  }

  @Post('summary')
  @HttpCode(HttpStatus.OK)
  async summary(@Body() dto: GenerateReportDto) {
    return await this.service.getSummary(dto);
  }
}
