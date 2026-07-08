import { IsInt, Min } from 'class-validator'

export class CreateSupervisorLinkDto {
  @IsInt()
  @Min(1)
  days!: number
}
