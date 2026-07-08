import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { UpdateOrderStatusDto, UpsertOrderStatusDto } from './dto'
import { OrderStatusesService } from './order-statuses.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-statuses')
export class OrderStatusesController {
  constructor(private readonly statuses: OrderStatusesService) {}

  @Get()
  list() {
    return this.statuses.list()
  }

  @Roles(UserRole.superadmin, UserRole.admin)
  @Post()
  create(@Body() dto: UpsertOrderStatusDto) {
    return this.statuses.create(dto)
  }

  @Roles(UserRole.superadmin, UserRole.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.statuses.update(id, dto)
  }
}
