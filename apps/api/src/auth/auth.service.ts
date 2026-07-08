import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as argon2 from 'argon2'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !user.active || !(await this.verifyPassword(user.passwordHash, password))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const payload = { sub: String(user.id), email: user.email, role: user.role }
    return {
      user: { id: String(user.id), name: user.name, email: user.email, role: user.role },
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '14d',
      }),
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      })
      const user = await this.prisma.user.findUnique({ where: { id: BigInt(payload.sub) } })
      if (!user?.active) throw new UnauthorizedException()

      return this.loginWithPayload(String(user.id), user.email, user.role)
    } catch {
      throw new UnauthorizedException('Refresh token inválido')
    }
  }

  private async loginWithPayload(sub: string, email: string, role: string) {
    const payload = { sub, email, role }
    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
    }
  }

  private async verifyPassword(hash: string, password: string) {
    if (hash.startsWith('$2y$') || hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
      return bcrypt.compare(password, hash)
    }

    return argon2.verify(hash, password)
  }
}
