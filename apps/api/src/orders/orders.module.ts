import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PublicModule } from '../public/public.module'
import { StorageModule } from '../storage/storage.module'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
  imports: [AuthModule, StorageModule, PublicModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
