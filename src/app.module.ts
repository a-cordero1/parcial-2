import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { MedicoEntity } from './medico/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // Usa ':memory:' para pruebas en memoria o especifica un archivo para almacenamiento persistente.
      entities: [
        MedicoEntity,
        PacienteEntity,
        DiagnosticoEntity,
      ],
      synchronize: true, // Automáticamente crea las tablas en SQLite.
      logging: false,    // Opcional: desactiva el logueo en consola.
    }),
    MedicoModule,
    PacienteModule,
    DiagnosticoModule,
    PacienteMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
