import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaMensuel } from './entities/ca-mensuel.entity';
import {
  BulkCreateCaMensuelDto,
  FilterCaMensuelDto,
} from '../dto/filter-ca.dto';
import { CreateCaMensuelDto } from '../dto/create-ca.dto';
import { UpdateCaMensuelDto } from '../dto/update-ca.dto';

@Injectable()
export class CaMensuelService {
  constructor(
    @InjectRepository(CaMensuel)
    private readonly repo: Repository<CaMensuel>,
  ) {}

  async findAll(filter?: FilterCaMensuelDto): Promise<CaMensuel[]> {
    const qb = this.repo
      .createQueryBuilder('ca')
      .orderBy('ca.annee', 'ASC')
      .addOrderBy('ca.mois', 'ASC');

    if (filter?.annee)
      qb.andWhere('ca.annee = :annee', { annee: filter.annee });
    if (filter?.mois) qb.andWhere('ca.mois = :mois', { mois: filter.mois });

    return qb.getMany();
  }

  async findOne(id: number): Promise<CaMensuel> {
    const entry = await this.repo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`Entrée #${id} introuvable`);
    return entry;
  }

  async findByAnnee(annee: number): Promise<CaMensuel[]> {
    return this.repo.find({
      where: { annee },
      order: { mois: 'ASC' },
    });
  }

  async getAnneesDisponibles(): Promise<number[]> {
    const result = await this.repo
      .createQueryBuilder('ca')
      .select('DISTINCT ca.annee', 'annee')
      .orderBy('ca.annee', 'ASC')
      .getRawMany<{ annee: number }>();

    return result.map((r) => Number(r.annee));
  }

  async create(dto: CreateCaMensuelDto): Promise<CaMensuel> {
    await this.checkDoublon(dto.annee, dto.mois);
    const entry = this.repo.create(dto);
    return this.repo.save(entry);
  }

  async bulkCreate(dto: BulkCreateCaMensuelDto): Promise<CaMensuel[]> {
    // Vérifie les doublons dans le lot lui-même
    const keys = dto.items.map((i) => `${i.annee}-${i.mois}`);
    const unique = new Set(keys);
    if (unique.size !== keys.length) {
      throw new ConflictException(
        'Le lot contient des doublons (même annee/mois)',
      );
    }

    // Vérifie les doublons en base
    for (const item of dto.items) {
      await this.checkDoublon(item.annee, item.mois);
    }

    const entries = this.repo.create(dto.items);
    return this.repo.save(entries);
  }

  async update(id: number, dto: UpdateCaMensuelDto): Promise<CaMensuel> {
    const entry = await this.findOne(id);

    // Si on change annee ou mois, vérifie la contrainte d'unicité
    const newAnnee = dto.annee ?? entry.annee;
    const newMois = dto.mois ?? entry.mois;
    const isChangingKey = newAnnee !== entry.annee || newMois !== entry.mois;

    if (isChangingKey) {
      await this.checkDoublon(newAnnee, newMois);
    }

    Object.assign(entry, dto);
    return this.repo.save(entry);
  }

  async remove(id: number): Promise<void> {
    const entry = await this.findOne(id);
    await this.repo.remove(entry);
  }

  async removeByAnnee(annee: number): Promise<{ deleted: number }> {
    const entries = await this.findByAnnee(annee);
    if (entries.length === 0) {
      throw new NotFoundException(`Aucune donnée pour l'année ${annee}`);
    }
    await this.repo.remove(entries);
    return { deleted: entries.length };
  }

  private async checkDoublon(annee: number, mois: number): Promise<void> {
    const existing = await this.repo.findOne({ where: { annee, mois } });
    if (existing) {
      throw new ConflictException(
        `Une entrée existe déjà pour ${annee}/${String(mois).padStart(2, '0')}`,
      );
    }
  }
}
