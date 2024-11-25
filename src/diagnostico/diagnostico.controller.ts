/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoDto } from './diagnostico.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Get()
  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoService.findAll();
  }

  @Get(':diagnosticoId')
  async findOne(@Param('diagnosticoId') diagnosticoId: string): Promise<DiagnosticoEntity> {
    return await this.diagnosticoService.findOne(diagnosticoId);
  }

  @Post()
  async create(@Body() diagnosticoDto: DiagnosticoDto): Promise<DiagnosticoEntity> {
    const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
    return await this.diagnosticoService.create(diagnostico);
  }

  @Delete(':diagnosticoId')
  @HttpCode(204)
  async delete(@Param('diagnosticoId') diagnosticoId: string): Promise<void> {
    return await this.diagnosticoService.delete(diagnosticoId);
  }
}
