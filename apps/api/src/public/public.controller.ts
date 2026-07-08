import { Body, Controller, Get, Param, Post, Res, StreamableFile } from '@nestjs/common'
import { Response } from 'express'
import { IsString } from 'class-validator'
import { PublicService } from './public.service'

class SignatureDto {
  @IsString()
  signatureDataUrl!: string
}

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('orders/:token')
  getOrder(@Param('token') token: string) {
    return this.publicService.getOrder(token)
  }

  @Post('orders/:token/signature')
  saveSignature(@Param('token') token: string, @Body() dto: SignatureDto) {
    return this.publicService.saveSignature(token, dto.signatureDataUrl)
  }

  @Get('orders/:token/service-confirmation.pdf')
  async downloadServiceConfirmation(@Param('token') token: string, @Res({ passthrough: true }) response: Response) {
    const { fileName, buffer } = await this.publicService.generateServiceConfirmationPdf(token)
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': buffer.byteLength,
    })
    return new StreamableFile(buffer)
  }

  @Get('supervisor/:token/orders')
  getSupervisorOrders(@Param('token') token: string) {
    return this.publicService.getSupervisorOrders(token)
  }
}
