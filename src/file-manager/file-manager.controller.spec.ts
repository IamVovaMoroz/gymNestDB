import { Test, TestingModule } from '@nestjs/testing';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file-manager.service';
import { FolderTypeEntity } from './entities/folder.type.entity';
import { FolderTypeCreateDto } from './dto/folder.type.create.dto';
import { FolderTypeUpdateDto } from './dto/folder.type.update.dto';
import { FileEntity } from './entities/file.entity';
import { HttpException, NotFoundException } from '@nestjs/common';

const mockFolderTypeDto = { folder_name: 'test_folder' } as FolderTypeCreateDto;
const mockFolderTypeEntity = { id: 1, folder_name: 'test_folder' } as FolderTypeEntity;
const mockFolderTypeUpdateDto = { folder_name: 'new_test_folder' } as FolderTypeUpdateDto;

const mockFile = {
  fieldname: 'file',
  originalname: 'test_file.txt',
  encoding: '7bit',
  mimetype: 'text/plain',
  buffer: Buffer.from('test file content'),
  size: 1024,
} as Express.Multer.File;

describe('FileManagerController', () => {
  let controller: FileManagerController;
  let service: FileManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileManagerController],
      providers: [
        {
          provide: FileManagerService,
          useValue: {
            createFolderType: jest.fn(),
            updateFolderTypeName: jest.fn(),
            getFolderTypeWithFiles: jest.fn(),
            deleteFolderType: jest.fn(),
            createFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FileManagerController>(FileManagerController);
    service = module.get<FileManagerService>(FileManagerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFolder', () => {
    it('should create a new folder type', async () => {
      jest.spyOn(service, 'createFolderType').mockResolvedValueOnce(mockFolderTypeEntity);

      const result = await controller.createFolder(mockFolderTypeDto);

      expect(result).toEqual(mockFolderTypeEntity);
    });
  });

  describe('updateFolderTypeName', () => {
    it('should update folder type name', async () => {
      jest.spyOn(service, 'updateFolderTypeName').mockResolvedValueOnce(mockFolderTypeEntity);

      const result = await controller.updateFolderTypeName('1', mockFolderTypeUpdateDto);

      expect(result).toEqual(mockFolderTypeEntity);
    });
  });

  describe('getFolderTypeWithFiles', () => {
    it('should get folder type with files', async () => {
      jest.spyOn(service, 'getFolderTypeWithFiles').mockResolvedValueOnce(mockFolderTypeEntity);

      const result = await controller.getFolderTypeWithFiles('1');

      expect(result).toEqual(mockFolderTypeEntity);
    });
  });

  describe('deleteFolder', () => {
    it('should delete folder type', async () => {
      jest.spyOn(service, 'deleteFolderType').mockResolvedValueOnce();

      const result = await controller.deleteFolder('1');

      expect(result).toBeUndefined();
    });
  });

  describe('createFile', () => {
    it('should create a new file', async () => {
      const mockCreatedFile = { id: 1, name: 'test_file.txt' };
      jest.spyOn(service, 'createFile').mockResolvedValueOnce(mockCreatedFile as FileEntity);

      const result = await controller.createFile(mockFile, '1');

      expect(result).toEqual(mockCreatedFile);
      expect(service.createFile).toHaveBeenCalledWith(mockFile, 1);
    });

    it('should throw HttpException if folder type not found', async () => {
      jest.spyOn(service, 'createFile').mockRejectedValueOnce(new NotFoundException('Folder type not found'));

      await expect(controller.createFile(mockFile, '1')).rejects.toThrow(HttpException);
    });
  });
});
