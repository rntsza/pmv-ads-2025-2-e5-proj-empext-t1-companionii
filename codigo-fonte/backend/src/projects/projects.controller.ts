import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFindAllQueryDto } from './dto/findall-project-query.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto, @Req() req) {
    return await this.projects.create(dto, req.user.userId);
  }

  @Get()
  async findAll(@Query() q: ProjectFindAllQueryDto) {
    const { companyId } = q;
    return await this.projects.findAll({ companyId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projects.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return await this.projects.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projects.remove(id);
  }

  @Get(':id/metrics')
  metrics(@Param('id') id: string) {
    return this.projects.metrics(id);
  }
}
