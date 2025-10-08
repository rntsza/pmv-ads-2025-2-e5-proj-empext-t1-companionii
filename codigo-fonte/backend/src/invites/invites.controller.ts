import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('invites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  async create(@Req() req: any, @Body() createInviteDto: CreateInviteDto) {
    return await this.invitesService.create(
      req.user.userId,
      createInviteDto.email,
      createInviteDto.role,
      createInviteDto.companyId,
    );
  }

  @Get()
  async findAll() {
    return await this.invitesService.findAll();
  }

  @Delete(':id')
  async revoke(@Param('id') id: string) {
    return await this.invitesService.revoke(id);
  }
}
