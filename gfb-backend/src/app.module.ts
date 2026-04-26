import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaMensuelModule } from './modules/ca-mensuel/ca-mensuel.module';
import { CaMensuel } from './modules/ca-mensuel/entities/ca-mensuel.entity';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Configuration PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [CaMensuel],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CaMensuelModule,
  ],
})
export class AppModule {}
