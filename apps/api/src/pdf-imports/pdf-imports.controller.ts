import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AuthUser } from '../common/auth-user'
import { ConfirmPdfImportDto } from './dto'
import { PdfImportsService } from './pdf-imports.service'

@UseGuards(JwtAuthGuard)
@Controller('pdf-imports')
export class PdfImportsController {
  constructor(private readonly imports: PdfImportsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('pdf', { limits: { fileSize: 12 * 1024 * 1024 } }))
  create(@CurrentUser() user: AuthUser, @UploadedFile() file: Express.Multer.File) {
    return this.imports.create(user, file)
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.imports.findOne(user, id)
  }

  @Post(':id/confirm')
  confirm(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: ConfirmPdfImportDto) {
    return this.imports.confirm(user, id, (dto.orders ?? dto.order) as never)
  }
}
