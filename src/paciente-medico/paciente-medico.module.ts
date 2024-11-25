import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';
import { MedicoEntity } from 'src/medico/medico.entity';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  providers: [PacienteMedicoService],
  imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
  controllers: [PacienteMedicoController],
})
export class PacienteMedicoModule {}