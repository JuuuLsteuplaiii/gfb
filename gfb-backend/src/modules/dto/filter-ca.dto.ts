import {
  IsArray,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateCaMensuelDto } from './create-ca.dto';
import { Type } from 'class-transformer';

export class FilterCaMensuelDto {
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  annee?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  mois?: number;
}

export class BulkCreateCaMensuelDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCaMensuelDto)
  items!: CreateCaMensuelDto[];
}
