/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class MedicoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly especialidad: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  readonly telefono: string;
}
