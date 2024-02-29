import { Module } from '@nestjs/common';
import { TypeController } from './type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeService } from './type.service';
import { TypesEntity } from './entities/type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypesEntity])],
  controllers: [TypeController],
  providers: [TypeService]
})
export class TypeModule { }
