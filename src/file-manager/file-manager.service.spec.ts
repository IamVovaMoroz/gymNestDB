import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FileManagerService } from './file-manager.service';
import { FolderTypeEntity } from './entities/folder.type.entity';
import { FileEntity } from './entities/file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

const mockFolderTypeDto = { folder_name: 'test_folder' };
const mockFolderTypeEntity = { id: 1, folder_name: 'test_folder' };
const mockFolderTypeUpdateDto = { folder_name: 'new_test_folder' };
const mockFile = {
  originalname: 'test_file.txt',
  buffer: Buffer.from('test file content'),
} as any;

describe('FileManagerService', () => {
  let service: FileManagerService;
  let folderTypeRepository: Repository<FolderTypeEntity>;
  let fileRepository: Repository<FileEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileManagerService,
        {
          provide: getRepositoryToken(FolderTypeEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FileEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FileManagerService>(FileManagerService);
    folderTypeRepository = module.get<Repository<FolderTypeEntity>>(getRepositoryToken(FolderTypeEntity));
    fileRepository = module.get<Repository<FileEntity>>(getRepositoryToken(FileEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFolderType', () => {
    it('should create a new folder type', async () => {
      jest.spyOn(folderTypeRepository, 'save').mockResolvedValueOnce(mockFolderTypeEntity as FolderTypeEntity);

      const result = await service.createFolderType(mockFolderTypeDto);

      expect(result).toEqual(mockFolderTypeEntity);
      expect(folderTypeRepository.save).toHaveBeenCalledWith(expect.any(FolderTypeEntity));
    });

    it('should throw ConflictException if folder type already exists', async () => {
      jest.spyOn(fs.promises, 'mkdir').mockRejectedValueOnce(new Error('Folder already exists'));

      await expect(service.createFolderType(mockFolderTypeDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateFolderTypeName', () => {
    it('should update folder type name', async () => {
      jest.spyOn(folderTypeRepository, 'findOne').mockResolvedValueOnce(mockFolderTypeEntity as FolderTypeEntity);
      jest.spyOn(folderTypeRepository, 'save').mockResolvedValueOnce(mockFolderTypeEntity as FolderTypeEntity);

      const result = await service.updateFolderTypeName(1, mockFolderTypeUpdateDto);

      expect(result).toEqual(mockFolderTypeEntity);
      expect(folderTypeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(folderTypeRepository.save).toHaveBeenCalledWith(mockFolderTypeEntity);
    });

    it('should throw NotFoundException if folder type not found', async () => {
      jest.spyOn(folderTypeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateFolderTypeName(1, mockFolderTypeUpdateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createFile', () => {
    it('should create a new file', async () => {
      jest.spyOn(folderTypeRepository, 'findOne').mockResolvedValueOnce(mockFolderTypeEntity as FolderTypeEntity);
      jest.spyOn(service as any, 'generateFileName').mockResolvedValueOnce('generated_file_name.txt');
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValueOnce();
      jest.spyOn(fileRepository, 'save').mockResolvedValueOnce(mockFile);

      const result = await service.createFile(mockFile, 1);

      expect(result).toEqual(mockFile);
      expect(fileRepository.save).toHaveBeenCalledWith(expect.any(FileEntity));
    });

    it('should throw Error if folder type not found', async () => {
      jest.spyOn(folderTypeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.createFile(mockFile, 1)).rejects.toThrow(Error);
    });
  });
});
