/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { MedicoDto } from './medico.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoService.findAll();
  }

  @Get(':medicoId')
  async findOne(@Param('medicoId') medicoId: string): Promise<MedicoEntity> {
    return await this.medicoService.findOne(medicoId);
  }

  @Post()
  async create(@Body() medicoDto: MedicoDto): Promise<MedicoEntity> {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.create(medico);
  }

  @Delete(':medicoId')
  @HttpCode(204)
  async delete(@Param('medicoId') medicoId: string): Promise<void> {
    return await this.medicoService.delete(medicoId);
  }
}
