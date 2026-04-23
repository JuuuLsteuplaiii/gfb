import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ca_mensuel')
export class CaMensuel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  annee!: number;

  @Column()
  mois!: number; 

  @Column('decimal', { precision: 10, scale: 2 })
  valeur!: number;

  @CreateDateColumn()
  created_at!: Date;
}