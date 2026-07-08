import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { ok: true }
  }

  @Get('/')
  checkWithSlash() {
    return { ok: true }
  }
}
