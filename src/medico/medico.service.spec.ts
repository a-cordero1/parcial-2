import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('MedicoService', () => {
  let service: MedicoService;
  let medicoRepository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [MedicoService],
      }).compile();

    service = module.get<MedicoService>(MedicoService);
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    // Asegúrate de que las tablas están vacías
    await pacienteRepository.delete({});
    await medicoRepository.delete({});

    // Inserta datos de prueba
    medicosList = [];
    for (let i = 0; i < 3; i++) {
      const medico = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: [],
      });
      medicosList.push(medico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new medico', async () => {
    const medico: Partial<MedicoEntity> = {
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
    };

    const newMedico = await service.create(medico);

    expect(newMedico).not.toBeNull();

    const storedMedico = await medicoRepository.findOne({ where: { id: newMedico.id } });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre);
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
    expect(storedMedico.telefono).toEqual(newMedico.telefono);
  });

  it('create should throw an exception if nombre or especialidad is missing', async () => {
    const medico: Partial<MedicoEntity> = {
      telefono: faker.phone.number(),
    };

    await expect(service.create(medico)).rejects.toThrow(BadRequestException);
  });

  it('findOne should return a medico by id', async () => {
    const storedMedico = medicosList[0];
    const medico = await service.findOne(storedMedico.id);

    expect(medico).not.toBeNull();
    expect(medico.id).toEqual(storedMedico.id);
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('findAll should return all medicos', async () => {
    const medicos = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos.length).toBe(medicosList.length);
  });

  it('delete should remove a medico', async () => {
    const medico = medicosList[0];
    await service.delete(medico.id);

    const deletedMedico = await medicoRepository.findOne({ where: { id: medico.id } });
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an exception if medico has pacientes assigned', async () => {
    const medico = medicosList[0];
    const paciente = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.person.sex(),
    });

    medico.pacientes = [paciente];
    await medicoRepository.save(medico);

    await expect(service.delete(medico.id)).rejects.toThrow(BusinessLogicException);
  });

  it('delete should throw an exception for an invalid medico', async () => {
    await expect(service.delete('invalid-id')).rejects.toThrow(BusinessLogicException);
  });
});
