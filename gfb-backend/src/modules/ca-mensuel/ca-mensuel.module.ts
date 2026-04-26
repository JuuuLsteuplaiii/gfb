import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaMensuel } from './entities/ca-mensuel.entity';
import { CaMensuelService } from './ca-mensuel.service';
import { CaMensuelController } from './ca-mensuel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaMensuel])],
  controllers: [CaMensuelController],
  providers: [CaMensuelService],
  exports: [CaMensuelService],
})
export class CaMensuelModule {}
