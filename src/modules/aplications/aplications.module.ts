import { Module } from '@nestjs/common';
import { AplicationsService } from './aplications.service';
import { AplicationsController } from './aplications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aplications } from './entities/aplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aplications])],
  controllers: [AplicationsController],
  providers: [AplicationsService],
})
export class AplicationsModule {}
