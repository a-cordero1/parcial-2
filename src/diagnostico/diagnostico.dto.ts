/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DiagnosticoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'La descripción no puede tener más de 200 caracteres' })
  readonly descripcion: string;
}
