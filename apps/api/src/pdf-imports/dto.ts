import { IsArray, IsObject, IsOptional } from 'class-validator'

export class ConfirmPdfImportDto {
  @IsOptional()
  @IsObject()
  order?: Record<string, unknown>

  @IsOptional()
  @IsArray()
  orders?: Array<Record<string, unknown>>
}
