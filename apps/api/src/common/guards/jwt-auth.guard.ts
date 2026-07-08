import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const header = request.headers.authorization as string | undefined
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

    if (!token) throw new UnauthorizedException('Missing bearer token')

    try {
      request.user = await this.jwt.verifyAsync(token, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      })
      return true
    } catch {
      throw new UnauthorizedException('Invalid bearer token')
    }
  }
}
