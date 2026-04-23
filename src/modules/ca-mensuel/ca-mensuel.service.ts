import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaMensuel } from './entities/ca-mensuel.entity';
import { CreateCaDto } from '../dto/create-ca.dto';
import { UpdateCaDto } from '../dto/update-ca.dto';

@Injectable()
export class CaMensuelService {
  constructor(
    @InjectRepository(CaMensuel)
    private readonly caMensuelRepository: Repository<CaMensuel>,
  ) {}

  // Créer une entrée
  async create(createCaDto: CreateCaDto): Promise<CaMensuel> {
    const ca = this.caMensuelRepository.create(createCaDto);
    return await this.caMensuelRepository.save(ca);
  }

  // Créer plusieurs entrées d'un coup
  async createMany(createCaDtos: CreateCaDto[]): Promise<CaMensuel[]> {
    const cas = this.caMensuelRepository.create(createCaDtos);
    return await this.caMensuelRepository.save(cas);
  }

  // Récupérer toutes les données
  async findAll(): Promise<CaMensuel[]> {
    return await this.caMensuelRepository.find({
      order: { annee: 'ASC', mois: 'ASC' },
    });
  }

  // Récupérer par id
  async findOne(id: number): Promise<CaMensuel> {
    const ca = await this.caMensuelRepository.findOne({ where: { id } });
    if (!ca) {
      throw new NotFoundException(`CA mensuel #${id} non trouvé`);
    }
    return ca;
  }

  // Mettre à jour
  async update(id: number, updateCaDto: UpdateCaDto): Promise<CaMensuel> {
    const ca = await this.findOne(id);
    Object.assign(ca, updateCaDto);
    return await this.caMensuelRepository.save(ca);
  }

  // Supprimer
  async remove(id: number): Promise<void> {
    const ca = await this.findOne(id);
    await this.caMensuelRepository.remove(ca);
  }
}