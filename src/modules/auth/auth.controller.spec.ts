import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAuthDto } from '../user/dto/user.auth.dto';
import { MockExpectedResultOfUser } from '../../common/constants';


jest.mock('./auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const userDto: UserAuthDto = { email: 'mock@example.com', password: 'mockPassword' };
      const tokenResponse = {
        newAccessToken: 'token',
        newRefreshToken: 'token',
        newActionToken: 'token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(tokenResponse as any);

      const result = await authController.login(userDto);

      expect(authService.login).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(tokenResponse);
    });
  });

  describe('getProfile', () => {
    it('should return user profile on successful token validation', async () => {
      const authorizationHeader = 'Bearer validToken';

      jest.spyOn(authService, 'validateUserByToken').mockResolvedValue(MockExpectedResultOfUser);

      const result = await authController.getProfile(authorizationHeader);

      expect(authService.validateUserByToken).toHaveBeenCalledWith(authorizationHeader);
      expect(result).toEqual(MockExpectedResultOfUser);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens on successful token refresh', async () => {
      const refreshToken = 'validRefreshToken';
      const tokenResponse = {
        newAccessToken: 'newToken',
        newRefreshToken: 'newToken',
        newActionToken: 'newToken',
      };

      jest.spyOn(authService, 'refreshTokens').mockResolvedValue(tokenResponse as any);

      const result = await authController.refreshTokens('validRefreshToken' as any);

      expect(authService.refreshTokens).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(tokenResponse);
    });
  });
});
