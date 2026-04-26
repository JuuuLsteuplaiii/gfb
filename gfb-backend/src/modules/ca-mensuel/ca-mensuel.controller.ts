import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaMensuelService } from './ca-mensuel.service';
import {
  BulkCreateCaMensuelDto,
  FilterCaMensuelDto,
} from '../dto/filter-ca.dto';
import { CreateCaMensuelDto } from '../dto/create-ca.dto';
import { UpdateCaMensuelDto } from '../dto/update-ca.dto';

@Controller('ca-mensuel')
export class CaMensuelController {
  constructor(private readonly service: CaMensuelService) {}

  // ?annee=1994&mois=3  (filtres optionnels)
  @Get()
  findAll(@Query() filter: FilterCaMensuelDto) {
    return this.service.findAll(filter);
  }

  // Retourne la liste des années disponibles en base
  @Get('annees')
  getAnnees() {
    return this.service.getAnneesDisponibles();
  }

  // Tous les mois d'une année donnée, trié par mois ASC
  @Get('annee/:annee')
  findByAnnee(@Param('annee', ParseIntPipe) annee: number) {
    return this.service.findByAnnee(annee);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Créer une seule entrée
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCaMensuelDto) {
    return this.service.create(dto);
  }

  // Créer plusieurs entrées d'un coup (import d'un tableau complet)
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  bulkCreate(@Body() dto: BulkCreateCaMensuelDto) {
    return this.service.bulkCreate(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCaMensuelDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Supprimer toute une année d'un coup
  @Delete('annee/:annee')
  removeByAnnee(@Param('annee', ParseIntPipe) annee: number) {
    return this.service.removeByAnnee(annee);
  }
}
