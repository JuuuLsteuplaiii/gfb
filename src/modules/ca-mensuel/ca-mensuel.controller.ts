import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CaMensuelService } from './ca-mensuel.service';
import { CreateCaDto } from '../dto/create-ca.dto';
import { UpdateCaDto } from '../dto/update-ca.dto';

@Controller('ca-mensuel')
export class CaMensuelController {
  constructor(private readonly caMensuelService: CaMensuelService) {}

  // POST /ca-mensuel → Ajouter une entrée
  @Post()
  create(@Body() createCaDto: CreateCaDto) {
    return this.caMensuelService.create(createCaDto);
  }

  // POST /ca-mensuel/bulk → Ajouter plusieurs entrées
  @Post('bulk')
  createMany(@Body() createCaDtos: CreateCaDto[]) {
    return this.caMensuelService.createMany(createCaDtos);
  }

  // GET /ca-mensuel → Récupérer tout
  @Get()
  findAll() {
    return this.caMensuelService.findAll();
  }

  // GET /ca-mensuel/:id → Récupérer un seul
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.caMensuelService.findOne(id);
  }

  // PUT /ca-mensuel/:id → Mettre à jour
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaDto: UpdateCaDto,
  ) {
    return this.caMensuelService.update(id, updateCaDto);
  }

  // DELETE /ca-mensuel/:id → Supprimer
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.caMensuelService.remove(id);
  }
}