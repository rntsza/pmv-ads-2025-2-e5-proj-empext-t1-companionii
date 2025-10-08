import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@ApiTags('reports')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post('ai')
  async generate(@Body() dto: GenerateReportDto) {
    return await this.service.generate(dto);
  }
}
