import {
  IsInt,
  IsNumber,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

export class CreateCaMensuelDto {
  @IsInt()
  @Min(1900)
  @Max(2100)
  annee!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  mois!: number;

  @IsNumber()
  @IsPositive()
  valeur!: number;
}