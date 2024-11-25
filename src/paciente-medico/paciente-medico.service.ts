/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new BusinessLogicException("El médico con el ID proporcionado no existe", BusinessError.NOT_FOUND);
    }
  
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'], // Carga las relaciones existentes
    });
    if (!paciente) {
      throw new BusinessLogicException("El paciente con el ID proporcionado no existe", BusinessError.NOT_FOUND);
    }
  
    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException("Un paciente no puede tener más de 5 médicos asignados", BusinessError.PRECONDITION_FAILED);
    }
  
    paciente.medicos.push(medico); // Agrega el nuevo médico
    await this.pacienteRepository.save(paciente);
  
    // Recarga el paciente para incluir las relaciones actualizadas
    return this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medicos'] });
  }  
}
