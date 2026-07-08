import { Type } from 'class-transformer'
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateOrderDto {
  @IsOptional() @IsString() technicianId?: string
  @IsString() orderNumber!: string
  @IsString() customerName!: string
  @IsOptional() @IsString() customerIdCard?: string
  @IsOptional() @IsString() postalCode?: string
  @IsOptional() @IsString() crossStreets?: string
  @IsOptional() @IsString() neighborhood?: string
  @IsOptional() @IsString() homePhone?: string
  @IsOptional() @IsString() cellPhone?: string
  @IsOptional() @IsString() officePhone?: string
  @IsOptional() @IsString() phoneExtension?: string
  @IsOptional() @IsString() assignedToType?: string
  @IsOptional() @IsString() purchasePlaceOrigin?: string
  @IsOptional() @IsString() technicianNumber?: string
  @IsOptional() @IsString() modelOrigin?: string
  @IsOptional() @IsString() moduleOrigin?: string
  @IsOptional() @IsString() serialNumberOrigin?: string
  @IsOptional() @IsString() baseOrigin?: string
  @IsOptional() @IsString() productDescriptionOrigin?: string
  @IsOptional() @IsString() confirmedPurchasePlace?: string
  @IsOptional() @IsString() confirmedInvoiceNumber?: string
  @IsOptional() @IsDateString() confirmedPurchaseDate?: string
  @IsOptional() @IsString() confirmedBrand?: string
  @IsOptional() @IsString() confirmedModel?: string
  @IsOptional() @IsString() confirmedSerialNumber?: string
  @IsOptional() @IsBoolean() requiresInvoice?: boolean
  @IsOptional() @IsString() partNumber?: string
  @IsOptional() @IsString() description1?: string
  @IsOptional() @IsString() description2?: string
  @IsOptional() @IsString() description3?: string
  @IsOptional() @IsDateString() orderDate?: string
  @IsOptional() @Type(() => Number) @IsNumber() orderPayment?: number
  @IsOptional() @Type(() => Number) @IsNumber() kilometersTraveled?: number
  @IsOptional() @IsString() locationPlace?: string
}

export class UpdateOrderDto extends CreateOrderDto {
  @IsOptional() @IsString() orderStatusId?: string
}

export class UpdateStatusDto {
  @IsString()
  orderStatusId!: string
}
