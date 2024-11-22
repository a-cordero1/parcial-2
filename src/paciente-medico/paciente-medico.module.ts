import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';
import { MedicoEntity } from 'src/medico/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
})
export class PacienteMedicoModule {}