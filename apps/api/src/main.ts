import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as express from 'express'
import { AppModule } from './app.module'

;(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString()
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.enableCors({
    origin: config.get('PUBLIC_APP_URL') ?? true,
    credentials: true,
  })
  app.setGlobalPrefix('api')
  app.use('/uploads', express.static(config.get('UPLOAD_DIR') ?? './uploads'))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}

bootstrap()
