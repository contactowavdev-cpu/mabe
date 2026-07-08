import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateOrderStatusDto, UpsertOrderStatusDto } from './dto'

@Injectable()
export class OrderStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.orderStatus.findMany({ orderBy: { priority: 'asc' } })
  }

  create(dto: UpsertOrderStatusDto) {
    return this.prisma.orderStatus.create({ data: dto })
  }

  update(id: string, dto: UpdateOrderStatusDto) {
    return this.prisma.orderStatus.update({ where: { id: BigInt(id) }, data: dto })
  }
}
