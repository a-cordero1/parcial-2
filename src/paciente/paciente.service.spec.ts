import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<PacienteEntity>;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await pacienteRepository.query('DELETE FROM "pacientes_diagnosticos_diagnosticos"');
    await pacienteRepository.query('DELETE FROM "diagnosticos"');
    await pacienteRepository.query('DELETE FROM "pacientes"');

    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente = await pacienteRepository.save({
        nombre: faker.person.firstName(),
        genero: faker.person.sex(),
      });
      pacientesList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new paciente', async () => {
    const paciente: PacienteEntity = {
      id: uuid(),
      nombre: faker.person.firstName(),
      genero: faker.person.sex(),
      medicos: [],
      diagnosticos: [],
    };

    const newPaciente: PacienteEntity = await service.create(paciente);

    expect(newPaciente).not.toBeNull();

    const storedPaciente = await pacienteRepository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create should throw an exception if nombre has less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: uuid(),
      nombre: 'Al',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: [],
    };

    await expect(service.create(paciente)).rejects.toThrow(BadRequestException);
    await expect(service.create(paciente)).rejects.toThrow(
      'El nombre del paciente debe tener al menos 3 caracteres',
    );
  });

  it('findOne should return a paciente by id', async () => {
    const storedPaciente = pacientesList[0];
    const paciente = await service.findOne(storedPaciente.id);

    expect(paciente).not.toBeNull();
    expect(paciente.id).toEqual(storedPaciente.id);
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it('findAll should return all pacientes', async () => {
    const pacientes = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('delete should remove a paciente', async () => {
    const paciente = pacientesList[0];
    await service.delete(paciente.id);

    const deletedPaciente = await pacienteRepository.findOne({ where: { id: paciente.id } });
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception for an invalid paciente', async () => {
    const invalidId = uuid();
    await expect(service.delete(invalidId)).rejects.toThrow(NotFoundException);
  });

  it('delete should throw an exception if paciente has diagnosticos associated', async () => {
    const paciente = pacientesList[0];
    const diagnostico = await diagnosticoRepository.save({
      id: uuid(),
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    paciente.diagnosticos = [diagnostico];
    await pacienteRepository.save(paciente);

    await expect(service.delete(paciente.id)).rejects.toThrow(BadRequestException);
  });
});

