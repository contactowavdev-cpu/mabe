import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { OrdersModule } from '../orders/orders.module'
import { StorageModule } from '../storage/storage.module'
import { PdfImportsController } from './pdf-imports.controller'
import { PdfImportsService } from './pdf-imports.service'

@Module({
  imports: [AuthModule, OrdersModule, StorageModule],
  controllers: [PdfImportsController],
  providers: [PdfImportsService],
})
export class PdfImportsModule {}
