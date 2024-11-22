import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { MedicoService } from './medico.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
  providers: [MedicoService],
})
export class MedicoModule {}

