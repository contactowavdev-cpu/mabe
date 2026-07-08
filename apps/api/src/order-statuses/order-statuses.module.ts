import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { OrderStatusesController } from './order-statuses.controller'
import { OrderStatusesService } from './order-statuses.service'

@Module({
  imports: [AuthModule],
  controllers: [OrderStatusesController],
  providers: [OrderStatusesService],
})
export class OrderStatusesModule {}
