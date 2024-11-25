/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PacienteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre del paciente debe tener al menos 3 caracteres' })
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly genero: string;
}
