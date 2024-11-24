/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
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
    // Arrange
    const paciente: PacienteEntity = {
      id: uuid(),
      nombre: faker.person.firstName(),
      genero: faker.person.sex(),
      medicos: [],
      diagnosticos: [],
    };

    // Act
    const newPaciente: PacienteEntity = await service.create(paciente);

    // Assert
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create should throw an exception if nombre has less than 3 characters', async () => {
    // Arrange
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'Al',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: [],
    };

    // Act & Assert
    await expect(service.create(paciente)).rejects.toThrow(BadRequestException);
    await expect(service.create(paciente)).rejects.toThrow(
      'El nombre del paciente debe tener al menos 3 caracteres',
    );
  });
});

