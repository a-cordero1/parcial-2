/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from '../../medico/medico.entity';
import { PacienteEntity } from '../../paciente/paciente.entity';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'postgres', // Cambiamos de SQLite a PostgreSQL
    host: 'localhost', // Host de PostgreSQL
    port: 5432, // Puerto de PostgreSQL
    username: 'postgres', // Usuario configurado para PostgreSQL
    password: '1234', // Contraseña configurada
    database: 'medico', // Nombre de la base de datos
    entities: [
      MedicoEntity,
      PacienteEntity,
      DiagnosticoEntity,
    ],
    dropSchema: true, // Limpia el esquema en cada ejecución para pruebas
    synchronize: true, // Crea las tablas automáticamente en la base de datos
    keepConnectionAlive: true, // Mantiene la conexión viva entre pruebas
  }),
  TypeOrmModule.forFeature([
    MedicoEntity,
    PacienteEntity,
    DiagnosticoEntity,
  ]),
];
