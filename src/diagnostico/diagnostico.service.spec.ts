import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    // Limpieza manual de las tablas relacionadas
    await diagnosticoRepository.query('DELETE FROM "pacientes_diagnosticos_diagnosticos"');
    await diagnosticoRepository.query('DELETE FROM "diagnosticos"');

    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico = await diagnosticoRepository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
      });
      diagnosticosList.push(diagnostico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new diagnostico', async () => {
    const diagnostico: Partial<DiagnosticoEntity> = {
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    };

    const newDiagnostico = await service.create(diagnostico);

    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico = await diagnosticoRepository.findOne({ where: { id: newDiagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(diagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(diagnostico.descripcion);
  });

  it('create should throw an exception if descripcion exceeds 200 characters', async () => {
    const diagnostico: Partial<DiagnosticoEntity> = {
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraphs(5), // Genera una descripción larga
    };

    await expect(service.create(diagnostico)).rejects.toThrow(BadRequestException);
    await expect(service.create(diagnostico)).rejects.toThrow(
      'La descripción no puede tener más de 200 caracteres',
    );
  });

  it('findOne should return a diagnostico by id', async () => {
    const storedDiagnostico = diagnosticosList[0];
    const diagnostico = await service.findOne(storedDiagnostico.id);

    expect(diagnostico).not.toBeNull();
    expect(diagnostico.id).toEqual(storedDiagnostico.id);
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
    await expect(service.findOne(uuid())).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining('El diagnóstico con id'),
      }),
    );
  });

  it('findAll should return all diagnosticos', async () => {
    const diagnosticos = await service.findAll();

    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticosList.length);
  });

  it('delete should remove a diagnostico', async () => {
    const diagnostico = diagnosticosList[0];
    await service.delete(diagnostico.id);

    const deletedDiagnostico = await diagnosticoRepository.findOne({ where: { id: diagnostico.id } });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception for an invalid id', async () => {
    const invalidId = uuid();

    await expect(service.delete(invalidId)).rejects.toThrow(NotFoundException);
    await expect(service.delete(invalidId)).rejects.toThrow('El diagnóstico no existe');
  });
});
