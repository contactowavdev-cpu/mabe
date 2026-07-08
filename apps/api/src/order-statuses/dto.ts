import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpsertOrderStatusDto {
  @IsString()
  name!: string

  @IsString()
  color!: string

  @IsString()
  icon!: string

  @IsInt()
  priority!: number
}

export class UpdateOrderStatusDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsString() color?: string
  @IsOptional() @IsString() icon?: string
  @IsOptional() @IsInt() priority?: number
}
