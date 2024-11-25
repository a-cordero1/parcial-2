import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let pacientesList: PacienteEntity[];
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await pacienteRepository.clear();
    await medicoRepository.clear();
  
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente = await pacienteRepository.save({
        nombre: faker.person.firstName(),
        genero: faker.person.sex(),
        medicos: [],
      });
      pacientesList.push(paciente);
    }
  
    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }
  };
    

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should associate a medico with a paciente', async () => {
    const newMedico = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
    });
  
    const paciente = pacientesList[0];
  
    const updatedPaciente = await service.addMedicoToPaciente(paciente.id, newMedico.id);
  
    // Recarga el paciente para validar la relación
    const reloadedPaciente = await pacienteRepository.findOne({ where: { id: paciente.id }, relations: ['medicos'] });
  
    expect(reloadedPaciente.medicos.length).toBe(1); // Relación inicial
    expect(reloadedPaciente.medicos.some(medico => medico.id === newMedico.id)).toBeTruthy();
  });
  

  it('addMedicoToPaciente should throw an exception for invalid medico', async () => {
    const paciente = pacientesList[0];
    await expect(service.addMedicoToPaciente(paciente.id, 'invalid-medico-id')).rejects.toThrow(
      BusinessLogicException,
    );
  });

  it('addMedicoToPaciente should throw an exception for invalid paciente', async () => {
    const newMedico = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente('invalid-paciente-id', newMedico.id)).rejects.toThrow(
      BusinessLogicException,
    );
  });

  it('addMedicoToPaciente should throw an exception if paciente already has 5 medicos', async () => {
    const paciente = pacientesList[0];
  
    // Asigna 5 médicos al paciente
    for (let i = 0; i < 5; i++) {
      await service.addMedicoToPaciente(paciente.id, medicosList[i].id);
    }
  
    const newMedico = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
    });
  
    // Intenta asignar un sexto médico
    await expect(service.addMedicoToPaciente(paciente.id, newMedico.id)).rejects.toThrow(BusinessLogicException);
  
    // Verifica que no se agregó el sexto médico
    const updatedPaciente = await pacienteRepository.findOne({ where: { id: paciente.id }, relations: ['medicos'] });
    expect(updatedPaciente.medicos.length).toBe(5); // Debe mantenerse en 5
  });    
});
