import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateCaDto {
  @IsNumber()
  @IsNotEmpty()
  annee!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  mois!: number;

  @IsNumber()
  @IsNotEmpty()
  valeur!: number;
}