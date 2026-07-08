import { PrismaClient, UserRole } from '@prisma/client'
import * as argon2 from 'argon2'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile(path: string) {
  if (!existsSync(path)) return

  const content = readFileSync(path, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const equalsIndex = trimmed.indexOf('=')
    if (equalsIndex === -1) continue

    const key = trimmed.slice(0, equalsIndex).trim()
    const rawValue = trimmed.slice(equalsIndex + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(process.cwd(), '.env'))
loadEnvFile(resolve(process.cwd(), 'apps/api/.env'))

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await argon2.hash('Admin123!')

  await prisma.orderStatus.upsert({
    where: { name: 'En curso' },
    update: {},
    create: { name: 'En curso', color: '#2563eb', icon: 'Wrench', priority: 1 },
  })
  await prisma.orderStatus.upsert({
    where: { name: 'Falta de piezas' },
    update: {},
    create: { name: 'Falta de piezas', color: '#d97706', icon: 'PackageSearch', priority: 2 },
  })
  await prisma.orderStatus.upsert({
    where: { name: 'Finalizado' },
    update: {},
    create: { name: 'Finalizado', color: '#16a34a', icon: 'CheckCircle2', priority: 50 },
  })
  await prisma.orderStatus.upsert({
    where: { name: 'Cancelado' },
    update: {},
    create: { name: 'Cancelado', color: '#dc2626', icon: 'CircleX', priority: 90 },
  })
  await prisma.orderStatus.upsert({
    where: { name: 'Pendiente' },
    update: {},
    create: { name: 'Pendiente', color: '#111827', icon: 'Clock3', priority: 99 },
  })

  await prisma.user.upsert({
    where: { email: 'admin@ordenes.local' },
    update: {
      passwordHash: adminPassword,
      role: UserRole.superadmin,
      active: true,
    },
    create: {
      name: 'Administrador',
      email: 'admin@ordenes.local',
      passwordHash: adminPassword,
      role: UserRole.superadmin,
      active: true,
    },
  })
}

main().finally(() => prisma.$disconnect())
