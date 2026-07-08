import { Injectable } from '@nestjs/common'
import { randomBytes } from 'node:crypto'
import { PrismaService } from '../prisma/prisma.service'

const toBigIntId = (id: string | number | bigint) => (typeof id === 'bigint' ? id : BigInt(id))

@Injectable()
export class SupervisorLinksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createdByUserId: string, days: number) {
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    return this.prisma.supervisorLink.create({
      data: {
        createdByUserId: toBigIntId(createdByUserId),
        expiresAt,
        token: randomBytes(32).toString('hex'),
      },
    })
  }
}
