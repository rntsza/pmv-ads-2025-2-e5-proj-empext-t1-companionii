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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindAllTasksQueryDto } from './dto/findall-task-query.dto';
import { FindallTaskActivitiesQueryDto } from './dto/findall-task-activities-query.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return await this.tasks.create(dto, req.user.userId);
  }

  @Get()
  async findAll(@Query() q: FindAllTasksQueryDto) {
    const { projectId, status } = q;
    return await this.tasks.list({ projectId, status });
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tasks.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return await this.tasks.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasks.remove(id);
  }

  @Post(':id/tags')
  async setTags(@Param('id') id: string, @Body('tags') tags: string[]) {
    return await this.tasks.setTags(id, tags);
  }

  @Post(':id/timer/start')
  async start(@Param('id') id: string) {
    return await this.tasks.startTimer(id);
  }

  @Post(':id/timer/stop')
  async stop(@Param('id') id: string) {
    return await this.tasks.stopTimer(id);
  }

  @Get(':id/activities')
  async findAllTaskActivities(
    @Param('id') id: string,
    @Query() q: FindallTaskActivitiesQueryDto,
  ) {
    const { take, cursor } = q;
    const t = take ? Number(take) : undefined;
    return await this.tasks.listActivitiesByTask(id, { cursor, take: t });
  }
}
