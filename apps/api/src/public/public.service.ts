import { BadRequestException, GoneException, Injectable, NotFoundException } from '@nestjs/common'
import { randomBytes } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { ConfigService } from '@nestjs/config'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import PDFDocument = require('pdfkit')
import { PrismaService } from '../prisma/prisma.service'
import { StorageService } from '../storage/storage.service'

const field = (value?: string | number | null) => String(value || 'No registrado')

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {}

  async getOrder(token: string) {
    const order = await this.prisma.order.findUnique({
      where: { publicToken: token },
      include: { status: true, photos: true },
    })
    if (!order?.isCompleted) throw new NotFoundException('Orden pública no encontrada')
    return order
  }

  async saveSignature(token: string, dataUrl: string) {
    const order = await this.getOrder(token)
    const match = dataUrl.match(/^data:image\/png;base64,(.+)$/)
    if (!match) throw new BadRequestException('Firma inválida')

    const buffer = Buffer.from(match[1], 'base64')
    const path = await this.storage.putObject(`signatures/${order.id}/${randomBytes(12).toString('hex')}.png`, buffer)
    return this.prisma.order.update({
      where: { id: order.id },
      data: { clientSignaturePath: path },
      include: { status: true, photos: true },
    })
  }

  async generateServiceConfirmationPdf(token: string) {
    const order = await this.getOrder(token)
    if (!order.clientSignaturePath) throw new BadRequestException('La orden aun no tiene firma del cliente')

    const buffer = await this.createPdfBuffer(order)
    return {
      fileName: `confirmacion-servicio-${order.orderNumber}.pdf`,
      buffer,
    }
  }

  createPdfBuffer(order: Awaited<ReturnType<PublicService['getOrder']>>) {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 26 })
      const chunks: Buffer[] = []
      doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const left = 28
      const top = 28
      const width = doc.page.width - left * 2
      const black = '#111111'
      const gray = '#b7b7b7'

      const box = (x: number, y: number, w: number, h: number) => {
        doc.rect(x, y, w, h).lineWidth(0.8).strokeColor(black).stroke()
      }
      const fillBox = (x: number, y: number, w: number, h: number, color = gray) => {
        doc.rect(x, y, w, h).fillAndStroke(color, black)
      }
      const txt = (value: string, x: number, y: number, w: number, size = 7, bold = false, align: 'left' | 'center' | 'right' = 'left') => {
        doc
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(size)
          .fillColor(black)
          .text(value, x, y, { width: w, align, lineGap: 0 })
      }
      const lineField = (
        label: string,
        value: string,
        x: number,
        y: number,
        labelW: number,
        lineW: number,
        size = 7,
        options: { lines?: number } = {},
      ) => {
        const lines = options.lines ?? 1
        const valueX = x + labelW + 3
        const valueW = lineW - 6
        const underline = (fromX: number, toX: number, lineY: number) => {
          doc.moveTo(fromX, lineY).lineTo(toX, lineY).strokeColor(black).lineWidth(0.6).stroke()
        }
        const fitLines = (text: string, maxW: number, maxLines: number, fontSize: number) => {
          doc.font('Helvetica').fontSize(fontSize)
          const words = text.split(/\s+/).filter(Boolean)
          const result: string[] = []
          let current = ''
          for (const word of words) {
            const candidate = current ? `${current} ${word}` : word
            if (doc.widthOfString(candidate) <= maxW) {
              current = candidate
              continue
            }
            if (current) result.push(current)
            current = word
            if (result.length === maxLines) break
          }
          if (result.length < maxLines && current) result.push(current)
          const consumed = result.join(' ').split(/\s+/).filter(Boolean).length
          if (consumed < words.length && result.length) {
            let last = `${result[result.length - 1]}...`
            while (last.length > 4 && doc.widthOfString(last) > maxW) {
              last = `${last.slice(0, -4)}...`
            }
            result[result.length - 1] = last
          }
          return result.slice(0, maxLines)
        }
        txt(label, x, y, labelW, size)
        if (lines === 1) {
          underline(x + labelW, x + labelW + lineW, y + size + 5)
          if (value && value !== 'No registrado') {
            doc
              .font('Helvetica')
              .fontSize(size)
              .fillColor(black)
              .text(value, valueX, y, { width: valueW, height: size + 4, ellipsis: true, lineBreak: false })
          }
          return
        }

        const valueSize = size - 0.8
        const rowGap = size + 6
        for (let index = 0; index < lines; index += 1) {
          underline(x + labelW, x + labelW + lineW, y + size + 5 + index * rowGap)
        }
        if (value && value !== 'No registrado') {
          fitLines(value, valueW, lines, valueSize).forEach((line, index) => {
            doc
              .font('Helvetica')
              .fontSize(valueSize)
              .fillColor(black)
              .text(line, valueX, y + index * rowGap, {
                width: valueW,
                height: valueSize + 3,
                ellipsis: true,
                lineBreak: false,
              })
          })
        }
      }
      const check = (label: string, x: number, y: number) => {
        doc.rect(x, y, 7, 7).lineWidth(0.6).strokeColor(black).stroke()
        txt(label, x + 10, y - 1, 72, 6)
      }

      doc.rect(28, 30, 98, 19).fillAndStroke('#0b78a6', '#0b78a6')
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#ffffff').text('servicio mabe', 33, 34, { width: 88, align: 'center' })

      txt('SERVICIO MABE', 232, 36, 120, 7, true, 'center')
      txt('GUATEMALA', 232, 48, 120, 7, true, 'center')
      txt('44 calle 16-46 zona 12 Guatemala, Guatemala', 196, 66, 192, 7, true, 'center')
      txt('Telefono: (502) 22337425', 224, 78, 136, 7, true, 'center')
      txt('ORDEN DE SERVICIO', 472, 30, 96, 9, true, 'center')
      lineField('NO. ORDEN:', field(order.orderNumber), 380, 48, 54, 132, 7)
      lineField('TIPO SERVICIO:', field(order.assignedToType || 'INSTALACION PRODUCTO-GARANTIA'), 376, 72, 64, 142, 7)
      lineField('FECHA PROG:', order.orderDate ? new Date(order.orderDate).toLocaleDateString('es-GT') : '', 382, 98, 60, 100, 7)

      let y = 116
      box(left, y, width, 104)
      lineField('NOMBRE DEL CLIENTE:', field(order.customerName), left + 16, y + 14, 98, 170, 7)
      lineField('CIUDAD', field(order.locationPlace), left + 290, y + 14, 38, 90, 7)
      lineField('CEDULA', field(order.customerIdCard), left + 16, y + 28, 56, 175, 7)
      lineField('COD. POSTAL:', field(order.postalCode), left + 290, y + 28, 62, 70, 7)
      lineField('DIRECCION:', field(order.description3), left + 16, y + 42, 58, 170, 7, { lines: 2 })
      lineField('ENTRE CALLES:', field(order.crossStreets), left + 290, y + 42, 70, 160, 7, { lines: 2 })
      lineField('BARRIO', field(order.neighborhood), left + 16, y + 70, 36, 100, 7)
      lineField('TEL. CASA:', field(order.homePhone), left + 16, y + 84, 52, 58, 7)
      lineField('TEL. CEL.:', field(order.cellPhone), left + 128, y + 84, 50, 70, 7)
      lineField('TEL. OFICINA:', field(order.officePhone), left + 16, y + 90, 64, 72, 7)
      lineField('EXT.:', field(order.phoneExtension), left + 150, y + 90, 30, 60, 7)

      y += 112
      box(left, y, width, 78)
      lineField('ASIGNADO A:', field(order.assignedToType || 'TECNICOS PROPIOS'), left + 12, y + 10, 72, 148, 7)
      lineField('LUGAR DE COMPRA:', field(order.purchasePlaceOrigin), left + 266, y + 10, 88, 145, 7, { lines: 2 })
      lineField('NO. TECNICO:', field(order.technicianNumber), left + 12, y + 28, 58, 112, 7)
      lineField('MODELO:', field(order.modelOrigin), left + 320, y + 28, 44, 115, 7)
      lineField('MODULO:', field(order.moduleOrigin || 'SUPERVISOR DE SERVICIO GUA'), left + 12, y + 42, 44, 180, 7)
      lineField('NO. DE SERIE:', field(order.serialNumberOrigin), left + 230, y + 42, 70, 150, 7)
      lineField('BASE:', field(order.baseOrigin || 'CSA AA'), left + 12, y + 56, 30, 112, 7)
      txt('DESCRIPCION PRODUCTO:', left + 230, y + 56, 108, 6.8)
      doc.font('Helvetica').fontSize(6.8).fillColor(black).text(field(order.productDescriptionOrigin), left + 342, y + 56, {
        width: 150,
        height: 9,
        ellipsis: true,
        lineBreak: false,
      })
      txt('FALLA REPORTADA/QUIEN', left + 230, y + 65, 104, 6.8)
      doc.font('Helvetica').fontSize(6.8).fillColor(black).text(field(order.description1), left + 340, y + 65, {
        width: 178,
        height: 9,
        ellipsis: true,
        lineBreak: false,
      })

      y += 86
      box(left, y, width, 60)
      txt('Informacion a confirmar por el Tecnico', left + 3, y + 3, 220, 8, true)
      lineField('LUGAR DE COMPRA:', field(order.confirmedPurchasePlace), left + 18, y + 22, 82, 105, 7, { lines: 2 })
      lineField('NO. FACTURA:', field(order.confirmedInvoiceNumber), left + 220, y + 22, 66, 102, 7)
      lineField('FECHA COMPRA:', order.confirmedPurchaseDate ? new Date(order.confirmedPurchaseDate).toLocaleDateString('es-GT') : '', left + 18, y + 38, 72, 106, 7)
      lineField('MARCA:', field(order.confirmedBrand || 'MABE'), left + 220, y + 38, 40, 106, 7)
      lineField('MODELO:', field(order.confirmedModel), left + 378, y + 38, 42, 100, 7)
      lineField('NO. DE SERIE:', field(order.confirmedSerialNumber), left + 18, y + 52, 66, 120, 7)
      txt('REQUIERE FACTURA', left + 220, y + 52, 82, 7)
      doc.rect(left + 304, y + 49, 30, 13).stroke()
      txt(order.requiresInvoice ? 'SI' : '', left + 304, y + 52, 30, 7, true, 'center')
      doc.rect(left + 334, y + 49, 30, 13).stroke()
      txt(!order.requiresInvoice ? 'NO' : '', left + 334, y + 52, 30, 7, true, 'center')

      y += 68
      box(left, y, width, 148)
      txt('R\nE\nF\nA\nC\nC\nI\nO\nN\nE\nS', left + 8, y + 13, 10, 8, true, 'center')
      const tableX = left + 18
      const tableW = width - 38
      fillBox(tableX, y + 4, tableW, 14)
      txt('NO. PARTE', tableX + 3, y + 8, 64, 7, true, 'center')
      txt('DESCRIPCION', tableX + 70, y + 8, 250, 7, true, 'center')
      txt('CANT.', tableX + 332, y + 8, 54, 7, true, 'center')
      txt('P. UNIT', tableX + 390, y + 8, 54, 7, true, 'center')
      txt('TOTAL', tableX + 450, y + 8, 54, 7, true, 'center')
      doc.moveTo(tableX + 64, y + 4).lineTo(tableX + 64, y + 92).stroke()
      doc.moveTo(tableX + 330, y + 4).lineTo(tableX + 330, y + 92).stroke()
      doc.moveTo(tableX + 388, y + 4).lineTo(tableX + 388, y + 92).stroke()
      doc.moveTo(tableX + 446, y + 4).lineTo(tableX + 446, y + 92).stroke()
      fillBox(tableX, y + 92, tableW, 14)
      txt('COD. FALLA', tableX + 4, y + 96, 64, 7, true, 'center')
      txt('DESCRIPCION DE LA FALLA', tableX + 70, y + 96, tableW - 72, 7, true, 'center')
      txt(field(order.partNumber), tableX + 4, y + 24, 58, 7)
      txt(field(order.description1), tableX + 70, y + 112, tableW - 76, 7)

      y += 154
      box(left, y, width, 64)
      txt('JURAMOS QUE LOS VALORES Y CANTIDADES EN ESTA ORDEN SON CORRECTOS', left, y + 4, width, 8, true)
      txt('1.- Nuestros trabajadores no pueden recibir propinas le rogamos abstenerse de ofrecerlas.', left, y + 16, width, 6)
      txt('2.- Asegurarse de que su articulo quede bien reparado, se usaron repuestos el tecnico le comprobara el cambio de ello.', left, y + 25, width, 6)
      txt('3.- Para facilitar un futuro servicio conserve este comprobante.', left, y + 34, width, 6)
      txt('ESTA GARANTIA NO APLICA', left, y + 43, width, 8, true)
      txt('A.- Cuando se observa en el equipo intervencion extrana al departamento de servicio de mabe industrial S.A.', left, y + 53, width, 6)

      y += 74
      fillBox(left, y, 382, 14)
      txt('DESCRIPCION DEL TRABAJO', left + 4, y + 4, 160, 7)
      box(left, y + 14, 382, 36)
      txt(field(order.description2), left + 4, y + 18, 374, 7)
      lineField('FECHA:', new Date().toLocaleDateString('es-GT'), left + 438, y + 30, 34, 66, 7)

      y += 56
      box(left, y, width, 92)
      txt('VERIFICACION DE ESTADO FINAL DEL ARTICULO', left, y + 3, width, 7, true, 'center')
      const colW = 106
      const heads = ['REFRIGERADORES', 'COCINAS', 'LAVADORAS', 'MICROONDAS']
      heads.forEach((head, index) => {
        const x = left + index * colW
        doc.moveTo(x, y + 14).lineTo(x, y + 92).stroke()
        txt(head, x + 2, y + 24, colW - 4, 6, false, 'center')
      })
      doc.moveTo(left + colW * 4, y + 14).lineTo(left + colW * 4, y + 92).stroke()
      check('ESTADO FISICO', left + 8, y + 44)
      check('AJUSTE DE PUERTAS', left + 8, y + 54)
      check('EMPAQUES', left + 8, y + 64)
      check('ESTADO FISICO', left + colW + 8, y + 44)
      check('PERILLAS', left + colW + 8, y + 54)
      check('SISTEMA ELECTRICO', left + colW + 8, y + 64)
      check('ESTADO FISICO', left + colW * 2 + 8, y + 44)
      check('TANQUE PLASTICO', left + colW * 2 + 8, y + 54)
      check('DESAGUE', left + colW * 2 + 8, y + 64)
      check('ESTADO FISICO', left + colW * 3 + 8, y + 44)
      check('PANEL', left + colW * 3 + 8, y + 54)
      check('PUERTA', left + colW * 3 + 8, y + 64)
      txt('FIRMA DE VERIFICADOR', left + colW * 4 + 2, y + 24, width - colW * 4 - 4, 7)
      txt('TIEMPO REAL', left + colW * 4 + 2, y + 62, width - colW * 4 - 4, 7)
      txt('DURACION', left + colW * 4 + 2, y + 76, width - colW * 4 - 4, 7)

      const signaturePath = this.resolveUploadPath(order.clientSignaturePath)
      const signY = y + 114
      if (signaturePath && existsSync(signaturePath)) {
        doc.image(signaturePath, left + 40, signY - 34, { fit: [150, 44] })
      }
      doc.moveTo(left + 40, signY + 14).lineTo(left + 180, signY + 14).stroke()
      doc.moveTo(left + 248, signY + 14).lineTo(left + 388, signY + 14).stroke()
      txt('FIRMA Y NOMBRE DEL CLIENTE', left + 40, signY + 22, 140, 6, false, 'center')
      txt('FIRMA Y NOMBRE DEL TECNICO', left + 248, signY + 22, 140, 6, false, 'center')
      txt('Acepto condiciones como se entrega el Producto', left + 40, signY + 36, 150, 6, false, 'center')
      txt('Realizacion del trabajo', left + 248, signY + 36, 140, 6, false, 'center')

      doc.end()
    })
  }

  private resolveUploadPath(publicPath?: string | null) {
    if (!publicPath?.startsWith('/uploads/')) return null
    const uploadDir = this.config.get('UPLOAD_DIR') ?? './uploads'
    return join(uploadDir, publicPath.replace('/uploads/', ''))
  }

  async getSupervisorOrders(token: string) {
    const link = await this.prisma.supervisorLink.findUnique({ where: { token } })
    if (!link) throw new NotFoundException('Link no encontrado')
    if (link.expiresAt < new Date()) throw new GoneException('Link expirado')

    return this.prisma.order.findMany({
      include: { status: true, technician: true, photos: true },
      orderBy: [{ status: { priority: 'asc' } }, { orderDate: 'desc' }],
    })
  }
}
