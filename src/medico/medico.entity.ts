import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';

@Entity() 
export class MedicoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  @ManyToMany(() => PacienteEntity, pacientes => pacientes.medicos)
  @JoinTable()
   pacientes: PacienteEntity[];
}
