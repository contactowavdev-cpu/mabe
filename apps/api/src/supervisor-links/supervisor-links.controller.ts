import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { AuthUser } from '../common/auth-user'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { CreateSupervisorLinkDto } from './dto'
import { SupervisorLinksService } from './supervisor-links.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('supervisor-links')
export class SupervisorLinksController {
  constructor(private readonly links: SupervisorLinksService) {}

  @Roles(UserRole.superadmin, UserRole.admin)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSupervisorLinkDto) {
    return this.links.create(user.sub, dto.days)
  }
}
