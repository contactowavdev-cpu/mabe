import { Body, Controller, Delete, Get, Param, Patch, Post, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AuthUser } from '../common/auth-user'
import { CreateOrderDto, UpdateOrderDto, UpdateStatusDto } from './dto'
import { OrdersService } from './orders.service'

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.orders.list(user)
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(user, dto)
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.orders.findOne(user, id)
  }

  @Get(':id/service-order.pdf')
  async downloadServiceOrder(@CurrentUser() user: AuthUser, @Param('id') id: string, @Res({ passthrough: true }) response: Response) {
    const { fileName, buffer } = await this.orders.generateServiceOrderPdf(user, id)
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': buffer.byteLength,
    })
    return new StreamableFile(buffer)
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orders.update(user, id, dto)
  }

  @Patch(':id/status')
  updateStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.orders.updateStatus(user, id, dto.orderStatusId)
  }

  @Delete(':id')
  delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.orders.delete(user, id)
  }

  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 8 * 1024 * 1024 } }))
  addPhoto(@CurrentUser() user: AuthUser, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.orders.addPhoto(user, id, file)
  }

  @Delete(':id/photos/:photoId')
  deletePhoto(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('photoId') photoId: string) {
    return this.orders.deletePhoto(user, id, photoId)
  }

  @Post(':id/complete')
  complete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.orders.complete(user, id)
  }
}
