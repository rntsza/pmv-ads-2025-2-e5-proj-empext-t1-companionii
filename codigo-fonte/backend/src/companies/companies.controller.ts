import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Post()
  async create(@Body() dto: CreateCompanyDto, @Req() req) {
    return this.companies.create(dto, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.companies.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.companies.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companies.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.companies.remove(id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role: Role },
  ) {
    return this.companies.addMember(id, body.userId, body.role);
  }

  @Get(':id/members')
  async listMembers(@Param('id') id: string) {
    return this.companies.listMembers(id);
  }
}
