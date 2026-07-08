import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { SupervisorLinksController } from './supervisor-links.controller'
import { SupervisorLinksService } from './supervisor-links.service'

@Module({
  imports: [AuthModule],
  controllers: [SupervisorLinksController],
  providers: [SupervisorLinksService],
  exports: [SupervisorLinksService],
})
export class SupervisorLinksModule {}
