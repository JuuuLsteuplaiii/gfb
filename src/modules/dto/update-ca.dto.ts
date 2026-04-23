import { PartialType } from '@nestjs/mapped-types';
import { CreateCaDto } from './create-ca.dto';

export class UpdateCaDto extends PartialType(CreateCaDto) {}