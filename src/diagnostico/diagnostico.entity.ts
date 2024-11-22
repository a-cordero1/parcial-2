import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';

@Entity('diagnosticos') 
export class DiagnosticoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => PacienteEntity, pacientes => pacientes.diagnosticos)
   pacientes: PacienteEntity[];
}
