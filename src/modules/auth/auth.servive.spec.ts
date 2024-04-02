import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entities/user.entity';
import { UserAuthDto } from '../user/dto/user.auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userRepository: Repository<UserEntity>;
  let authRepository: Repository<AuthEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), JwtModule], // Ensure ConfigService is available

      providers: [
        AuthService,
        // {
        //   provide: JwtService,
        //   useValue: {
        //     verify: jest.fn(),
        //     sing: jest.fn(),
        //   },
        // },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuthEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    authRepository = module.get<Repository<AuthEntity>>(getRepositoryToken(AuthEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should log in user and return auth entity', async () => {
      const userDto: UserAuthDto = { email: 'test@example.com', password: 'password' };
      const user: UserEntity = { email: 'test@example.com', password: 'hashedPassword' } as UserEntity;
      const authEntity: AuthEntity = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        actionToken: 'actionToken',
        userEmail: 'test@example.com',
      } as AuthEntity;

      jest.spyOn(service as any, 'validateUser').mockResolvedValueOnce(user);
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(authRepository, 'create').mockReturnValueOnce(authEntity);
      jest.spyOn(authRepository, 'save').mockResolvedValueOnce(authEntity);

      const result = await service.login(userDto);

      expect(result).toEqual(authEntity);
      expect(authRepository.create).toHaveBeenCalledWith({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        actionToken: expect.any(String),
        userEmail: userDto.email,
      });
      expect(authRepository.save).toHaveBeenCalledWith(authEntity);
    });
    it('should throw UnauthorizedException if user validation fails', async () => {
      const userDto: UserAuthDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(service as any, 'validateUser').mockRejectedValueOnce(new UnauthorizedException());

      await expect(service.login(userDto)).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('validateUserByToken', () => {
    beforeEach(() => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userEmail: 'test@example.com' });
    });

    it('should return user if token is valid and user exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ email: 'test@example.com' } as UserEntity);

      const result = await service.validateUserByToken('Bearer validToken');

      expect(result).toEqual({ email: 'test@example.com' } as UserEntity);
      expect(jwtService.verify).toHaveBeenCalledWith('validToken');
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null if token is valid but user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateUserByToken('Bearer validToken');

      expect(result).toBeNull();
      expect(jwtService.verify).toHaveBeenCalledWith('validToken');
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });
  });
  describe('refreshTokens', () => {
    it('should refresh tokens and return auth entity if refreshToken is valid', async () => {
      const refreshTokenDto = { refreshToken: 'validRefreshToken' };
      const user = { email: 'test@example.com' } as UserEntity;
      const authEntity = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        actionToken: 'newActionToken',
        userEmail: 'test@example.com',
      };

      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ userEmail: user.email });
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValueOnce({
        newAccessToken: 'newAccessToken',
        newRefreshToken: 'newRefreshToken',
        newActionToken: 'newActionToken',
      });
      jest.spyOn(authRepository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(authEntity as AuthEntity);

      const result = await service['refreshTokens'](refreshTokenDto);

      expect(result).toEqual(authEntity);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(service['generateTokens']).toHaveBeenCalledWith(user.email);
      expect(authRepository.update).toHaveBeenCalledWith(
        { userEmail: user.email },
        { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken', actionToken: 'newActionToken' },
      );
      expect(authRepository.findOne).toHaveBeenCalledWith({ where: { userEmail: user.email } });
    });

    it('should throw UnauthorizedException if refreshToken is invalid', async () => {
      const refreshTokenDto = { refreshToken: 'invalidRefreshToken' };

      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(service['refreshTokens'](refreshTokenDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
