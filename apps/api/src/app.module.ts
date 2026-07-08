import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { HealthController } from './health.controller'
import { OrdersModule } from './orders/orders.module'
import { OrderStatusesModule } from './order-statuses/order-statuses.module'
import { PdfImportsModule } from './pdf-imports/pdf-imports.module'
import { PrismaModule } from './prisma/prisma.module'
import { PublicModule } from './public/public.module'
import { StorageModule } from './storage/storage.module'
import { SupervisorLinksModule } from './supervisor-links/supervisor-links.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['apps/api/.env', '.env', '../../.env'] }),
    PrismaModule,
    StorageModule,
    AuthModule,
    OrdersModule,
    OrderStatusesModule,
    PdfImportsModule,
    SupervisorLinksModule,
    PublicModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
