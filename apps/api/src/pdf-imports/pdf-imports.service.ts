import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { randomBytes } from 'node:crypto'
import { AuthUser } from '../common/auth-user'
import { CreateOrderDto } from '../orders/dto'
import { OrdersService } from '../orders/orders.service'
import { PrismaService } from '../prisma/prisma.service'
import { StorageService } from '../storage/storage.service'

const toBigIntId = (id: string | number | bigint) => (typeof id === 'bigint' ? id : BigInt(id))
const pdfParse = require('pdf-parse') as (
  buffer: Buffer,
  options?: { pagerender?: (pageData: any) => Promise<string> },
) => Promise<{ text: string }>

@Injectable()
export class PdfImportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly orders: OrdersService,
  ) {}

  async create(user: AuthUser, file: Express.Multer.File) {
    if (file.mimetype !== 'application/pdf') throw new BadRequestException('Debe subir un PDF')

    const text = (await pdfParse(file.buffer, { pagerender: this.renderPdfPage })).text
    const payload = this.mapTextToOrderDraft(text)
    const filePath = await this.storage.putObject(`pdf-imports/${randomBytes(12).toString('hex')}.pdf`, file.buffer)

    return this.prisma.pdfImport.create({
      data: {
        userId: toBigIntId(user.sub),
        filePath,
        extractedText: text,
        extractedPayload: payload,
      },
    })
  }

  async findOne(user: AuthUser, id: string) {
    const pdfImport = await this.prisma.pdfImport.findFirst({
      where: { id: toBigIntId(id), userId: toBigIntId(user.sub) },
    })
    if (!pdfImport) throw new NotFoundException('Importacion no encontrada')
    return pdfImport
  }

  async confirm(user: AuthUser, id: string, orderOrOrders: CreateOrderDto | CreateOrderDto[]) {
    await this.findOne(user, id)

    const list = Array.isArray(orderOrOrders) ? orderOrOrders : [orderOrOrders]
    if (!list.length) throw new BadRequestException('No hay ordenes para confirmar')

    const created = []
    for (const [index, order] of list.entries()) {
      created.push(await this.orders.create(user, this.normalizeOrderDraft(order, id, index)))
    }

    await this.prisma.pdfImport.update({ where: { id: toBigIntId(id) }, data: { status: 'confirmed' } })
    return { count: created.length, orders: created }
  }

  private normalizeOrderDraft(order: CreateOrderDto, importId: string, index: number): CreateOrderDto {
    const clean = Object.fromEntries(
      Object.entries(order).map(([key, value]) => [key, value === '' ? undefined : value]),
    ) as CreateOrderDto

    const orderPayment = clean.orderPayment === undefined ? undefined : Number(clean.orderPayment)
    const kilometersTraveled = clean.kilometersTraveled === undefined ? undefined : Number(clean.kilometersTraveled)

    return {
      ...clean,
      orderNumber: clean.orderNumber || `IMPORT-${importId}-${index + 1}`,
      customerName: clean.customerName || 'Cliente sin nombre',
      confirmedPurchaseDate: this.validDate(clean.confirmedPurchaseDate),
      orderDate: this.validDate(clean.orderDate),
      requiresInvoice: Boolean(clean.requiresInvoice),
      orderPayment: Number.isFinite(orderPayment) ? orderPayment : undefined,
      kilometersTraveled: Number.isFinite(kilometersTraveled) ? kilometersTraveled : undefined,
    }
  }

  private validDate(value?: string) {
    if (!value) return undefined
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : value
  }

  private mapTextToOrderDraft(text: string) {
    const cleanText = this.normalize(text)
    const workshop = this.pick(cleanText, /TALLER:\s*([^\n\r]+)/)
    const blocks = this.splitOrderBlocks(cleanText)

    const orders = blocks.map((block) => this.mapOrderBlock(block, workshop))

    return {
      source: 'NUEVAS_OTTO_MO',
      count: orders.length,
      workshop,
      orders,
      rawTextPreview: cleanText.slice(0, 2500),
    }
  }

  private mapOrderBlock(block: string, workshop: string) {
    const orderNumber = this.pick(block, /NO\. ORDEN:\s*(\d{8,})/)
    const serviceType = this.pick(block, /TIPO SERVICIO:\s*([\s\S]*?)\s+FECHA PROG:/)
    const scheduledAt = this.pick(block, /FECHA PROG:\s*([0-9.:\s]+)/)
    const customerName = this.pick(block, /NOMBRE DEL CLIENTE:\s*([\s\S]*?)\s+DELEGACI[ÓO]N O MUNICIPIO:/)
    const delegation = this.pick(block, /DELEGACI[ÓO]N O MUNICIPIO:\s*([\s\S]*?)\s+DIRECCI[ÓO]N:/)
    const addressBlock = this.pick(block, /DIRECCI[ÓO]N:\s*([\s\S]*?)\s+COLONIA:/)
    const postalCode = this.pick(block, /COD\. POSTAL:\s*([A-Z0-9-]+)/)
    const neighborhood = this.pick(block, /COLONIA:\s*([\s\S]*?)\s+ENTRE CALLES:/)
    const crossStreets = this.pick(block, /ENTRE CALLES:\s*([\s\S]*?)\s+TEL\. CASA:/)
    const homePhone = this.phone(this.pick(block, /TEL\. CASA:\s*([\s\S]*?)\s+TEL\. CEL\.:/))
    const cellPhone = this.phone(this.pick(block, /TEL\. CEL\.:\s*([\s\S]*?)\s+TEL\. OFICINA:/))
    const officePhone = this.phone(this.pick(block, /TEL\. OFICINA:\s*([\s\S]*?)\s+EXT\.:/))
    const phoneExtension = this.pick(block, /EXT\.:\s*([\s\S]*?)\s+ASIGNADO A:/)
    const assignedTo = this.pick(block, /ASIGNADO A:\s*([\s\S]*?)\s+LUGAR DE COMPRA:/)
    const purchasePlace = this.pick(block, /LUGAR DE COMPRA:\s*([\s\S]*?)\s+NO\. T[ÉE]CNICO:/)
    const technicianNumber = this.pick(block, /NO\. T[ÉE]CNICO:\s*([\s\S]*?)\s+MODELO:/)
    const model = this.pick(block, /MODELO:\s*([\s\S]*?)\s+M[ÓO]DULO:/)
    const module = this.pick(block, /M[ÓO]DULO:\s*([\s\S]*?)\s+NO\. DE SERIE:/)
    const serialNumber = this.pick(block, /NO\. DE SERIE:\s*([\s\S]*?)\s+BASE:/)
    const base = this.pick(block, /BASE:\s*([\s\S]*?)\s+DESCRIPCI[ÓO]N PRODUCTO:/)
    const productDescription = this.pick(block, /DESCRIPCI[ÓO]N PRODUCTO:\s*([\s\S]*?)\s+FALLA REPORTADA/)
    const failure = this.pick(block, /FALLA REPORTADA\/QUI[ÉE]N\s*([\s\S]*?)\s+REPORTA:/)

    return {
      orderNumber,
      orderDate: this.toIsoDate(scheduledAt),
      customerName,
      postalCode,
      crossStreets,
      neighborhood,
      homePhone,
      cellPhone,
      officePhone,
      phoneExtension,
      assignedToType: serviceType,
      purchasePlaceOrigin: purchasePlace,
      technicianNumber,
      modelOrigin: model,
      moduleOrigin: module,
      serialNumberOrigin: serialNumber,
      baseOrigin: base || workshop,
      productDescriptionOrigin: productDescription,
      confirmedPurchasePlace: purchasePlace,
      confirmedBrand: 'MABE',
      confirmedModel: model,
      confirmedSerialNumber: serialNumber,
      requiresInvoice: false,
      description1: failure,
      description2: '',
      description3: this.cleanAddress(addressBlock, postalCode),
      locationPlace: delegation,
    }
  }

  private splitOrderBlocks(text: string) {
    const matches = [...text.matchAll(/NO\. ORDEN:\s*\d{8,}/g)]
    return matches.map((match, index) => {
      const start = match.index ?? 0
      const end = index + 1 < matches.length ? matches[index + 1].index ?? text.length : text.length
      return text.slice(start, end).trim()
    })
  }

  private pick(text: string, pattern: RegExp) {
    return this.clean(text.match(pattern)?.[1] ?? '')
  }

  private normalize(value: string) {
    return value
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  private clean(value: string) {
    return value
      .replace(/\s+/g, ' ')
      .replace(/^N\\A$/i, '')
      .trim()
  }

  private cleanAddress(value: string, postalCode: string) {
    return this.clean(value.replace(/COD\. POSTAL:\s*[A-Z0-9-]+/i, '').replace(postalCode, ''))
  }

  private phone(value: string) {
    return value.match(/[0-9]{6,}/)?.[0] ?? ''
  }

  private toIsoDate(value: string) {
    const match = value.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/)
    if (!match) return undefined
    const [, day, month, year, hour, minute, second] = match
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString()
  }

  private async renderPdfPage(pageData: any) {
    const textContent = await pageData.getTextContent({
      normalizeWhitespace: false,
      disableCombineTextItems: false,
    })

    const items = textContent.items
      .map((item: any) => ({
        text: String(item.str ?? '').trim(),
        x: Number(item.transform?.[4] ?? 0),
        y: Math.round(Number(item.transform?.[5] ?? 0)),
      }))
      .filter((item: { text: string }) => item.text)
      .sort((a: { x: number; y: number }, b: { x: number; y: number }) => b.y - a.y || a.x - b.x)

    const lines: Array<{ y: number; items: Array<{ text: string; x: number }> }> = []
    for (const item of items) {
      let line = lines.find((candidate) => Math.abs(candidate.y - item.y) <= 2)
      if (!line) {
        line = { y: item.y, items: [] }
        lines.push(line)
      }
      line.items.push(item)
    }

    return lines
      .map((line) =>
        line.items
          .sort((a, b) => a.x - b.x)
          .map((item) => item.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
      )
      .join('\n')
  }
}
