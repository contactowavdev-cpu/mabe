import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'

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

if (!process.env.DATABASE_URL) {
  throw new Error('Falta DATABASE_URL. Crea apps/api/.env con la conexion real de MySQL/MariaDB.')
}

const prisma = new PrismaClient()

const orderColumns: Array<[string, string]> = [
  ['order_status_id', 'BIGINT UNSIGNED NULL'],
  ['customer_name', 'VARCHAR(255) NULL'],
  ['customer_id_card', 'VARCHAR(120) NULL'],
  ['postal_code', 'VARCHAR(40) NULL'],
  ['cross_streets', 'TEXT NULL'],
  ['neighborhood', 'VARCHAR(255) NULL'],
  ['home_phone', 'VARCHAR(80) NULL'],
  ['cell_phone', 'VARCHAR(80) NULL'],
  ['office_phone', 'VARCHAR(80) NULL'],
  ['phone_extension', 'VARCHAR(40) NULL'],
  ['assigned_to_type', 'VARCHAR(255) NULL'],
  ['purchase_place_origin', 'VARCHAR(255) NULL'],
  ['technician_number', 'VARCHAR(120) NULL'],
  ['model_origin', 'VARCHAR(255) NULL'],
  ['module_origin', 'VARCHAR(255) NULL'],
  ['serial_number_origin', 'VARCHAR(255) NULL'],
  ['base_origin', 'VARCHAR(255) NULL'],
  ['product_description_origin', 'TEXT NULL'],
  ['confirmed_purchase_place', 'VARCHAR(255) NULL'],
  ['confirmed_invoice_number', 'VARCHAR(120) NULL'],
  ['confirmed_purchase_date', 'DATE NULL'],
  ['confirmed_brand', 'VARCHAR(120) NULL'],
  ['confirmed_model', 'VARCHAR(255) NULL'],
  ['confirmed_serial_number', 'VARCHAR(255) NULL'],
  ['requires_invoice', 'TINYINT(1) NOT NULL DEFAULT 0'],
  ['part_number', 'VARCHAR(255) NULL'],
  ['description_1', 'TEXT NULL'],
  ['description_2', 'TEXT NULL'],
  ['description_3', 'TEXT NULL'],
  ['kilometers_traveled', 'DECIMAL(10,2) NULL'],
  ['fuel_cost', 'DECIMAL(10,2) NULL'],
  ['location_place', 'VARCHAR(255) NULL'],
  ['public_token', 'VARCHAR(120) NULL'],
  ['client_signature_path', 'VARCHAR(500) NULL'],
  ['is_completed', 'TINYINT(1) NOT NULL DEFAULT 0'],
]

async function columnExists(table: string, column: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ total: bigint | number }>>(
    'SELECT COUNT(*) AS total FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
    table,
    column,
  )

  return Number(rows[0]?.total ?? 0) > 0
}

async function indexExists(table: string, index: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ total: bigint | number }>>(
    'SELECT COUNT(*) AS total FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?',
    table,
    index,
  )

  return Number(rows[0]?.total ?? 0) > 0
}

async function addColumnIfMissing(table: string, column: string, definition: string) {
  if (await columnExists(table, column)) {
    console.log(`ok ${table}.${column}`)
    return
  }

  await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
  console.log(`add ${table}.${column}`)
}

async function addIndexIfMissing(table: string, index: string, sql: string) {
  if (await indexExists(table, index)) {
    console.log(`ok ${index}`)
    return
  }

  await prisma.$executeRawUnsafe(sql)
  console.log(`add ${index}`)
}

async function main() {
  await addColumnIfMissing(
    'tb_usuarios',
    'role',
    "ENUM('superadmin', 'admin', 'supervisor', 'technician') NOT NULL DEFAULT 'technician'",
  )
  await addColumnIfMissing('tb_usuarios', 'active', 'TINYINT(1) NOT NULL DEFAULT 1')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS order_statuses (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      color VARCHAR(30) NOT NULL,
      icon VARCHAR(80) NOT NULL,
      priority INT NOT NULL DEFAULT 99,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY order_statuses_name_unique (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await prisma.$executeRawUnsafe(`
    INSERT INTO order_statuses (name, color, icon, priority)
    VALUES
      ('En curso', '#2563eb', 'Wrench', 1),
      ('Falta de piezas', '#d97706', 'PackageSearch', 2),
      ('Finalizado', '#16a34a', 'CheckCircle2', 50),
      ('Cancelado', '#dc2626', 'CircleX', 90),
      ('Pendiente', '#111827', 'Clock3', 99)
    ON DUPLICATE KEY UPDATE
      color = VALUES(color),
      icon = VALUES(icon),
      priority = VALUES(priority)
  `)

  for (const [column, definition] of orderColumns) {
    await addColumnIfMissing('ordenes', column, definition)
  }

  await prisma.$executeRawUnsafe(`
    UPDATE ordenes
    SET order_status_id = (SELECT id FROM order_statuses WHERE name = 'Pendiente' LIMIT 1)
    WHERE order_status_id IS NULL
  `)

  await addIndexIfMissing(
    'ordenes',
    'ordenes_order_status_id_idx',
    'CREATE INDEX `ordenes_order_status_id_idx` ON `ordenes` (`order_status_id`)',
  )
  await addIndexIfMissing(
    'ordenes',
    'ordenes_public_token_unique',
    'CREATE UNIQUE INDEX `ordenes_public_token_unique` ON `ordenes` (`public_token`)',
  )

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS order_photos (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id BIGINT UNSIGNED NOT NULL,
      photo_path VARCHAR(500) NOT NULL,
      original_name VARCHAR(255) NULL,
      mime_type VARCHAR(80) NOT NULL,
      size INT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY order_photos_order_id_idx (order_id),
      CONSTRAINT order_photos_order_id_fk FOREIGN KEY (order_id) REFERENCES ordenes(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS supervisor_links (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      token VARCHAR(120) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_by_user_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY supervisor_links_token_unique (token),
      KEY supervisor_links_created_by_user_id_idx (created_by_user_id),
      CONSTRAINT supervisor_links_created_by_user_id_fk FOREIGN KEY (created_by_user_id) REFERENCES tb_usuarios(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS pdf_imports (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      extracted_text LONGTEXT NULL,
      extracted_payload JSON NULL,
      status ENUM('pending_review', 'confirmed', 'failed') NOT NULL DEFAULT 'pending_review',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY pdf_imports_user_id_idx (user_id),
      CONSTRAINT pdf_imports_user_id_fk FOREIGN KEY (user_id) REFERENCES tb_usuarios(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  console.log('Base de datos completada correctamente.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
