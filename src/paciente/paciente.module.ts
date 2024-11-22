import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity])],
  providers: [PacienteService],
})
export class PacienteModule {}