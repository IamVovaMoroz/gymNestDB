import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { FolderTypeEntity } from './entities/folder.type.entity';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { FolderTypeCreateDto } from './dto/folder.type.create.dto';
import { FolderTypeUpdateDto } from './dto/folder.type.update.dto';

@Injectable()
export class FileManagerService {
  private readonly logger = new Logger(FileManagerService.name);
  constructor(
    @InjectRepository(FolderTypeEntity)
    private readonly folderTypeRepository: Repository<FolderTypeEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async createFolderType(folderTypeDto: FolderTypeCreateDto): Promise<FolderTypeEntity> {
    const folderType = new FolderTypeEntity();
    folderType.folder_name = folderTypeDto.folder_name;

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      await fs.promises.mkdir(uploadsDir);
    }
    const folderPath = path.join(uploadsDir, folderTypeDto.folder_name);
    if (fs.existsSync(folderPath)) {
      throw new ConflictException('Folder already exists');
    }
    await fs.promises.mkdir(folderPath);
    return await this.folderTypeRepository.save(folderType);
  }
  async updateFolderTypeName(
    folderTypeId: number,
    folderTypeUpdateDto: FolderTypeUpdateDto,
  ): Promise<FolderTypeEntity> {
    const new_folder_name = folderTypeUpdateDto.folder_name;

    const folderType = await this.folderTypeRepository.findOne({ where: { id: folderTypeId } });
    if (!folderType) {
      throw new NotFoundException('Folder type not found');
    }

    const oldFolderPath = path.join(__dirname, '..', 'uploads', folderType.folder_name);
    const newFolderPath = path.join(__dirname, '..', 'uploads', new_folder_name);
    if (fs.existsSync(oldFolderPath)) {
      fs.renameSync(oldFolderPath, newFolderPath);
    }

    folderType.folder_name = new_folder_name;
    return await this.folderTypeRepository.save(folderType);
  }
  async getFolderTypeWithFiles(id: number): Promise<FolderTypeEntity> {
    const folderType = await this.folderTypeRepository.findOne({ where: { id }, relations: ['files'] });
    if (!folderType) {
      throw new NotFoundException('Folder type not found');
    }
    return folderType;
  }
  async deleteFolderType(id: number): Promise<void> {
    const folderType = await this.folderTypeRepository.findOne({ where: { id } });
    if (!folderType) {
      throw new NotFoundException('Folder type not found');
    }

    const folderPath = path.join(__dirname, '..', 'uploads', folderType.folder_name);
    if (fs.existsSync(folderPath)) {
      await this.deleteFolderRecursive(folderPath);
    }

    await this.fileRepository.delete({ folderType: folderType });
    await this.folderTypeRepository.delete(id);
  }

  private async deleteFolderRecursive(folderPath: string): Promise<void> {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          this.deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }
  async createFile(file: Express.Multer.File, folderTypeId: number): Promise<FileEntity> {
    const folderType = await this.folderTypeRepository.findOne({ where: { id: folderTypeId } });
    if (!folderType) {
      throw new Error('Folder type not found');
    }
    this.logger.log(file.originalname);

    const fileName = await this.generateFileName(file.originalname);
    const filePath = path.join(__dirname, '..', `uploads/${folderType.folder_name}`, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    const newFile = new FileEntity();
    newFile.name = fileName;
    newFile.folderType = folderType;

    return await this.fileRepository.save(newFile);
  }

  private async generateFileName(fileName: string): Promise<string> {
    const timestamp = new Date().getTime();
    const hash = crypto.createHash('md5').update(timestamp.toString()).digest('hex');
    const ext = path.extname(fileName);
    return `${hash}${ext}`;
  }
}
