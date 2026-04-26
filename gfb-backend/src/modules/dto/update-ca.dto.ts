import { PartialType } from '@nestjs/mapped-types';
import { CreateCaMensuelDto } from './create-ca.dto';

export class UpdateCaMensuelDto extends PartialType(CreateCaMensuelDto) {}
