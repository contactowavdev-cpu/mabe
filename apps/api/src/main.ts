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
  const configuredOrigins = [
    config.get('PUBLIC_APP_URL'),
    config.get('CORS_ORIGINS'),
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean)
  const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
  const allowedOrigins = new Set([...configuredOrigins, ...localOrigins])

  const isAllowedOrigin = (origin?: string) => {
    if (!origin) return true
    const normalized = origin.replace(/\/$/, '')
    return allowedOrigins.has(normalized)
      || /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(normalized)
      || /^https?:\/\/localhost(:\d+)?$/i.test(normalized)
      || /^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(normalized)
  }

  app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
    const origin = request.headers.origin
    if (typeof origin === 'string' && isAllowedOrigin(origin)) {
      response.header('Access-Control-Allow-Origin', origin)
      response.header('Vary', 'Origin')
      response.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
      response.header(
        'Access-Control-Allow-Headers',
        request.headers['access-control-request-headers'] ?? 'Content-Type, Authorization, Accept',
      )
      response.header('Access-Control-Max-Age', '86400')
    }

    if (request.method === 'OPTIONS') {
      response.status(204).send()
      return
    }

    next()
  })

  app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (request.path === '/') {
      response.json({ ok: true, service: 'mabe-api' })
      return
    }
    next()
  })

  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, origin?: string | boolean) => void) => {
      if (isAllowedOrigin(origin)) {
        callback(null, origin ?? true)
        return
      }
      callback(null, false)
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 204,
  })
  app.setGlobalPrefix('api')
  app.use('/uploads', express.static(config.get('UPLOAD_DIR') ?? './uploads'))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}

bootstrap()
