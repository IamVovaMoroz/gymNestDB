import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FolderTypeEntity } from './entities/folder.type.entity';
import { FolderTypeCreateDto } from './dto/folder.type.create.dto';
import { FolderTypeUpdateDto } from './dto/folder.type.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('File-manager')
@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('folder/create')
  async createFolder(@Body() folderTypeDto: FolderTypeCreateDto): Promise<FolderTypeEntity> {
    return await this.fileManagerService.createFolderType(folderTypeDto);
  }
  @Put('folder/update/:id')
  async updateFolderTypeName(
    @Param('id') id: string,
    @Body() folderTypeUpdateDto: FolderTypeUpdateDto,
  ): Promise<FolderTypeEntity> {
    return await this.fileManagerService.updateFolderTypeName(+id, folderTypeUpdateDto);
  }
  @Get('folder/:id')
  async getFolderTypeWithFiles(@Param('id') id: string) {
    return await this.fileManagerService.getFolderTypeWithFiles(+id);
  }
  @Delete('folder/:id')
  async deleteFolder(@Param('id') id: string) {
    return await this.fileManagerService.deleteFolderType(+id);
  }
  @Post('file/:folderTypeId')
  @UseInterceptors(FileInterceptor('file'))
  async createFile(@UploadedFile() file: Express.Multer.File, @Param('folderTypeId') folderTypeId: string) {
    return await this.fileManagerService.createFile(file, +folderTypeId);
  }
}
