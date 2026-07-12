import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'
import { Buffer } from 'node:buffer'
import { randomBytes } from 'node:crypto'
import PDFDocument = require('pdfkit')
import sharp from 'sharp'
import { AuthUser } from '../common/auth-user'
import { PublicService } from '../public/public.service'
import { PrismaService } from '../prisma/prisma.service'
import { StorageService } from '../storage/storage.service'
import { CreateOrderDto, UpdateOrderDto } from './dto'

const elevatedRoles: UserRole[] = [UserRole.superadmin, UserRole.admin, UserRole.supervisor]
const toBigIntId = (id: string | number | bigint) => typeof id === 'bigint' ? id : BigInt(id)

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly publicService: PublicService,
  ) {}

  list(user: AuthUser) {
    return this.prisma.order.findMany({
      where: this.visibleWhere(user),
      include: { status: true, technician: true, photos: true },
      orderBy: [{ status: { priority: 'asc' } }, { orderDate: 'desc' }],
    })
  }

  async create(user: AuthUser, dto: CreateOrderDto) {
    const pending = await this.prisma.orderStatus.findUnique({ where: { name: 'Pendiente' } })
    if (!pending) throw new BadRequestException('Debe ejecutar el seed de estados')

    const technicianId = elevatedRoles.includes(user.role) ? dto.technicianId ?? user.sub : user.sub
    const existing = await this.prisma.order.findUnique({ where: { orderNumber: dto.orderNumber } })
    if (existing) {
      return this.prisma.order.update({
        where: { id: existing.id },
        data: {
          ...this.mapOrderUpdateDto(dto),
          technician: { connect: { id: toBigIntId(technicianId) } },
          status: { connect: { id: existing.orderStatusId ?? pending.id } },
        },
        include: { status: true, photos: true },
      })
    }

    return this.prisma.order.create({
      data: this.mapOrderDto(dto, technicianId, pending.id),
      include: { status: true, photos: true },
    })
  }

  async findOne(user: AuthUser, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: toBigIntId(id), ...this.visibleWhere(user) },
      include: { status: true, technician: true, photos: true },
    })
    if (!order) throw new NotFoundException('Orden no encontrada')
    return order
  }

  async update(user: AuthUser, id: string, dto: UpdateOrderDto) {
    await this.findOne(user, id)
    return this.prisma.order.update({
      where: { id: toBigIntId(id) },
      data: this.mapOrderUpdateDto(dto),
      include: { status: true, photos: true },
    })
  }

  async updateStatus(user: AuthUser, id: string, orderStatusId: string) {
    await this.findOne(user, id)
    const status = await this.prisma.orderStatus.findUnique({ where: { id: toBigIntId(orderStatusId) } })
    if (!status) throw new BadRequestException('Estado no encontrado')

    return this.prisma.order.update({
      where: { id: toBigIntId(id) },
      data: {
        orderStatusId: status.id,
        statusText: this.toLegacyStatusText(status.name),
        isCompleted: status.name === 'Finalizado',
        completedAt: status.name === 'Finalizado' ? new Date() : undefined,
      },
      include: { status: true, photos: true },
    })
  }

  async delete(user: AuthUser, id: string) {
    await this.findOne(user, id)
    await this.prisma.order.delete({ where: { id: toBigIntId(id) } })
    return { ok: true }
  }

  async generateServiceOrderPdf(user: AuthUser, id: string) {
    const order = await this.findOne(user, id)
    const buffer = await this.createTechnicalOrderPdfBuffer(order)
    return {
      fileName: `orden-servicio-${order.orderNumber}.pdf`,
      buffer,
    }
  }

  private createTechnicalOrderPdfBuffer(order: Awaited<ReturnType<OrdersService['findOne']>>) {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 26 })
      const chunks: Buffer[] = []
      doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const black = '#000000'
      const line = (value?: string | number | Date | null) => {
        if (!value) return ''
        if (value instanceof Date) return value.toLocaleDateString('es-GT')
        return String(value)
      }
      const text = (value: string, x: number, y: number, width: number, size = 10, bold = false, align: 'left' | 'center' | 'right' = 'left') => {
        doc
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(size)
          .fillColor(black)
          .text(value, x, y, { width, align, lineGap: 2 })
      }
      const value = (value: string, x: number, y: number, width: number, size = 10, bold = false) => {
        text(value || '', x, y, width, size, bold)
      }
      const row = (label: string, val: string, x: number, y: number, labelW: number, valueW: number, size = 10, bold = false) => {
        text(label, x, y, labelW, size)
        value(val, x + labelW + 6, y, valueW, size, bold)
      }

      const left = 26
      let y = 18

      row('NO. ORDEN:', line(order.orderNumber), left, y, 118, 130, 10, true)
      row('TIPO SERVICIO:', line(order.assignedToType || 'GARANTIA DE FABRICA'), 300, y + 3, 112, 170, 9)
      row('FECHA PROG:', order.orderDate ? `${order.orderDate.toLocaleDateString('es-GT')} 10:00:00` : '', 612, y + 3, 94, 116, 9)

      y += 35
      row('NOMBRE DEL CLIENTE:', line(order.customerName), left, y, 154, 210, 10)
      row('DELEGACION O MUNICIPIO:', line(order.locationPlace), 396, y, 154, 170, 9)

      y += 22
      row('DIRECCION:', line(order.description3), left, y, 154, 210, 10)
      row('COD. POSTAL:', line(order.postalCode), 396, y, 154, 92, 9)

      y += 62
      row('COLONIA:', line(order.neighborhood), left, y, 154, 210, 10)
      row('ENTRE CALLES:', line(order.crossStreets), 396, y, 154, 210, 10)

      y += 24
      row('TEL. CASA:', line(order.homePhone), left, y, 154, 90, 10)
      row('TEL. CEL.:', line(order.cellPhone), 250, y, 95, 120, 10)

      y += 24
      row('TEL. OFICINA:', line(order.officePhone), left, y, 154, 90, 10)
      row('EXT.:', line(order.phoneExtension), 250, y, 95, 120, 10)

      y += 58
      row('ASIGNADO A:', line('CENTRO DE SERVICIO ELECTROFIX'), left, y, 154, 230, 10)
      row('LUGAR DE COMPRA:', line(order.purchasePlaceOrigin), 424, y, 122, 220, 10)

      y += 24
      row('NO. TECNICO:', line(order.technicianNumber), left, y, 154, 90, 10)
      row('MODELO:', line(order.modelOrigin), 486, y, 80, 150, 10)

      y += 24
      row('MODULO:', line(order.moduleOrigin || 'SUPERVISOR DE SERVICIO GUA'), left, y, 154, 250, 10)
      row('NO. DE SERIE:', line(order.serialNumberOrigin), 454, y, 112, 160, 10)

      y += 24
      row('BASE:', line(order.baseOrigin), left, y, 154, 160, 10)
      row('DESCRIPCION PRODUCTO:', line(order.productDescriptionOrigin), 390, y, 176, 250, 10)

      y += 24
      row('FALLA REPORTADA/QUIEN', line(order.description1), 390, y, 176, 270, 10)

      y += 24
      row('REPORTA:', '', 485, y, 80, 110, 10)
      text('FECHA DE VISITA: ____________________', 565, y, 220, 10)

      doc.end()
    })
  }

  async addPhoto(user: AuthUser, id: string, file: Express.Multer.File) {
    await this.findOne(user, id)
    if (!file) throw new BadRequestException('Debe seleccionar una foto')

    const orderId = toBigIntId(id)
    const count = await this.prisma.orderPhoto.count({ where: { orderId } })
    if (count >= 10) throw new BadRequestException('Máximo 10 fotos por orden')
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Archivo de imagen inválido')

    try {
      const avif = await sharp(file.buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .avif({ quality: 62 })
        .toBuffer()
      const path = await this.storage.putObject(`orders/${id}/${randomBytes(12).toString('hex')}.avif`, avif)

      return this.prisma.orderPhoto.create({
        data: {
          orderId,
          photoPath: path,
          originalName: file.originalname,
          mimeType: 'image/avif',
          size: avif.byteLength,
          sortOrder: count,
        },
      })
    } catch (error) {
      this.logger.error(`No se pudo procesar la foto de la orden ${id}`, error instanceof Error ? error.stack : String(error))
      throw new BadRequestException('No se pudo procesar la foto. Usa JPG/PNG y evita imagenes muy pesadas.')
    }
  }

  async deletePhoto(user: AuthUser, id: string, photoId: string) {
    await this.findOne(user, id)
    await this.prisma.orderPhoto.deleteMany({ where: { id: toBigIntId(photoId), orderId: toBigIntId(id) } })
    return { ok: true }
  }

  async complete(user: AuthUser, id: string) {
    await this.findOne(user, id)
    const finalized = await this.prisma.orderStatus.findUnique({ where: { name: 'Finalizado' } })
    if (!finalized) throw new BadRequestException('Falta estado Finalizado')

    return this.prisma.order.update({
      where: { id: toBigIntId(id) },
      data: {
        orderStatusId: finalized.id,
        statusText: 'completado',
        isCompleted: true,
        publicToken: randomBytes(32).toString('hex'),
      },
      include: { status: true, photos: true },
    })
  }

  visibleWhere(user: AuthUser): Prisma.OrderWhereInput {
    return elevatedRoles.includes(user.role) ? {} : { technicianId: toBigIntId(user.sub) }
  }

  private toLegacyStatusText(statusName: string) {
    const normalized = statusName.toLowerCase()
    if (normalized.includes('final')) return 'completado'
    if (normalized.includes('cancel')) return 'cancelado'
    if (normalized.includes('curso')) return 'en_proceso'
    return 'pendiente'
  }

  private mapOrderDto(dto: CreateOrderDto, technicianId: string | bigint, orderStatusId: bigint): Prisma.OrderCreateInput {
    return {
      customerIdCard: dto.customerIdCard,
      postalCode: dto.postalCode,
      crossStreets: dto.crossStreets,
      neighborhood: dto.neighborhood,
      homePhone: dto.homePhone,
      cellPhone: dto.cellPhone,
      officePhone: dto.officePhone,
      phoneExtension: dto.phoneExtension,
      assignedToType: dto.assignedToType,
      purchasePlaceOrigin: dto.purchasePlaceOrigin,
      technicianNumber: dto.technicianNumber,
      modelOrigin: dto.modelOrigin,
      moduleOrigin: dto.moduleOrigin,
      serialNumberOrigin: dto.serialNumberOrigin,
      baseOrigin: dto.baseOrigin,
      productDescriptionOrigin: dto.productDescriptionOrigin,
      confirmedPurchasePlace: dto.confirmedPurchasePlace,
      confirmedInvoiceNumber: dto.confirmedInvoiceNumber,
      confirmedPurchaseDate: dto.confirmedPurchaseDate ? new Date(dto.confirmedPurchaseDate) : undefined,
      confirmedBrand: dto.confirmedBrand,
      confirmedModel: dto.confirmedModel,
      confirmedSerialNumber: dto.confirmedSerialNumber,
      requiresInvoice: dto.requiresInvoice,
      partNumber: dto.partNumber,
      description1: dto.description1,
      description2: dto.description2,
      description3: dto.description3,
      orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
      total: dto.orderPayment,
      kilometersTraveled: dto.kilometersTraveled,
      locationPlace: dto.locationPlace,
      technician: { connect: { id: toBigIntId(technicianId) } },
      status: { connect: { id: orderStatusId } },
      orderNumber: dto.orderNumber,
      customerName: dto.customerName,
    }
  }

  private mapOrderUpdateDto(dto: UpdateOrderDto): Prisma.OrderUpdateInput {
    return {
      customerIdCard: dto.customerIdCard,
      postalCode: dto.postalCode,
      crossStreets: dto.crossStreets,
      neighborhood: dto.neighborhood,
      homePhone: dto.homePhone,
      cellPhone: dto.cellPhone,
      officePhone: dto.officePhone,
      phoneExtension: dto.phoneExtension,
      assignedToType: dto.assignedToType,
      purchasePlaceOrigin: dto.purchasePlaceOrigin,
      technicianNumber: dto.technicianNumber,
      modelOrigin: dto.modelOrigin,
      moduleOrigin: dto.moduleOrigin,
      serialNumberOrigin: dto.serialNumberOrigin,
      baseOrigin: dto.baseOrigin,
      productDescriptionOrigin: dto.productDescriptionOrigin,
      confirmedPurchasePlace: dto.confirmedPurchasePlace,
      confirmedInvoiceNumber: dto.confirmedInvoiceNumber,
      confirmedPurchaseDate: dto.confirmedPurchaseDate ? new Date(dto.confirmedPurchaseDate) : undefined,
      confirmedBrand: dto.confirmedBrand,
      confirmedModel: dto.confirmedModel,
      confirmedSerialNumber: dto.confirmedSerialNumber,
      requiresInvoice: dto.requiresInvoice,
      partNumber: dto.partNumber,
      description1: dto.description1,
      description2: dto.description2,
      description3: dto.description3,
      orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
      total: dto.orderPayment,
      kilometersTraveled: dto.kilometersTraveled,
      locationPlace: dto.locationPlace,
      orderNumber: dto.orderNumber,
      customerName: dto.customerName,
      status: dto.orderStatusId ? { connect: { id: toBigIntId(dto.orderStatusId) } } : undefined,
    }
  }
}
