import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

@Entity('pacientes') 
export class PacienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  genero: string;

  @ManyToMany(() => MedicoEntity, medicos => medicos.pacientes)
   medicos: MedicoEntity[];

  @ManyToMany(() => DiagnosticoEntity, diagnosticos => diagnosticos.pacientes)
   diagnosticos: DiagnosticoEntity[];
}
