import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import * as argon2 from 'argon2'
import { AuthUser } from '../common/auth-user'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto'

const manageableRoles: UserRole[] = [UserRole.admin, UserRole.technician]

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list(currentUser: AuthUser) {
    this.assertSuperadmin(currentUser)
    return this.prisma.user.findMany({
      where: { role: { in: manageableRoles } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    })
  }

  async create(currentUser: AuthUser, dto: CreateUserDto) {
    this.assertSuperadmin(currentUser)
    if (!manageableRoles.includes(dto.role)) {
      throw new BadRequestException('Solo se pueden crear tecnicos y administradores desde esta pantalla')
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new BadRequestException('Ya existe un usuario con este correo')

    const passwordHash = await argon2.hash(dto.password)
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        username: dto.email,
        passwordHash,
        phone: dto.phone,
        role: dto.role,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
      },
    })
  }

  private assertSuperadmin(user: AuthUser) {
    if (user.role !== UserRole.superadmin) {
      throw new ForbiddenException('Solo el super administrador puede gestionar usuarios')
    }
  }
}
