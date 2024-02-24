import { Module } from '@nestjs/common';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionEntity } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionEntity])],
  controllers: [OptionsController],
  providers: [OptionsService]
})
export class OptionsModule {}
