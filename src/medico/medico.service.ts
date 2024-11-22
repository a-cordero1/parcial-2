import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async create(medico: Partial<MedicoEntity>): Promise<MedicoEntity> {
    if (!medico.nombre || !medico.especialidad) {
      throw new BadRequestException('El nombre y la especialidad no pueden estar vacíos');
    }
    const nuevoMedico = this.medicoRepository.create(medico);
    return await this.medicoRepository.save(nuevoMedico);
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico = await this.medicoRepository.findOne({ where: { id } });
    if (!medico) {
      throw new NotFoundException(`El médico con id ${id} no existe`);
    }
    return medico;
  }

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find();
  }

  async delete(id: string): Promise<void> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}});
    const pacientes = await this.pacienteRepository.find({
      where: { medicos: { id: medico.id } },
      relations: ['medicos'],
    });
    if (pacientes.length > 0) {
      throw new BadRequestException('No se puede eliminar un médico que tiene pacientes asignados');
    }
    await this.medicoRepository.delete(id);
  }
}
