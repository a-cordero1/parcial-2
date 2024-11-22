import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';

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
   pacientes: PacienteEntity[];
}
