import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { FileEntity } from './entities/file.entity';
import { FolderTypeEntity } from './entities/folder.type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, FolderTypeEntity])],
  controllers: [FileManagerController],
  providers: [FileManagerService],
})
export class FileManagerModule {}
