import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async create(paciente: Partial<PacienteEntity>): Promise<PacienteEntity> {
    if (!paciente.nombre || paciente.nombre.length < 3) {
      throw new BadRequestException('El nombre del paciente debe tener al menos 3 caracteres');
    }
    const nuevoPaciente = this.pacienteRepository.create(paciente);
    return await this.pacienteRepository.save(nuevoPaciente);
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`El paciente con id ${id} no existe`);
    }
    return paciente;
  }

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find();
  }

  async delete(id: string): Promise<void> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id } });
    const diagnosticos = await this.diagnosticoRepository.find({
      where: { pacientes: { id: paciente.id } },
    });
    if (diagnosticos.length > 0) {
      throw new BadRequestException('No se puede eliminar un paciente que tiene diagnósticos asociados');
    }
    await this.pacienteRepository.delete(id);
  }
}
