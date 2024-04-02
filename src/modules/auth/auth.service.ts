import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { AuthEntity } from './entities/auth.entity';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserAuthDto } from '../user/dto/user.auth.dto';
import { ITokenResponse } from '../../types/interface';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async login(userDto: UserAuthDto): Promise<AuthEntity> {
    const user = await this.validateUser(userDto.email, userDto.password);
    let auth = await this.authRepository.findOne({ where: { userEmail: user.email } });
    const { newAccessToken, newRefreshToken, newActionToken } = await this.generateTokens(user.email);
    if (!auth) {
      auth = this.authRepository.create({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        actionToken: newActionToken,
        userEmail: user.email,
      });
    } else {
      auth.accessToken = newAccessToken;
      auth.refreshToken = newRefreshToken;
      auth.actionToken = newActionToken;
    }

    this.logger.log(`User logged in: ${user.email}`);
    return await this.authRepository.save(auth);
  }

  private async generateTokens(email: string): Promise<ITokenResponse> {
    const payload = { userEmail: email };
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.getOrThrow<string>('SECRET_ACCESS'),
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
      secret: this.configService.getOrThrow<string>('SECRET_REFRESH'),
    });
    const newActionToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.getOrThrow<string>('SECRET_ACTION'),
    });
    return { newAccessToken, newRefreshToken, newActionToken };
  }

  private async comparePasswords(password: string, userPasswordHash: string): Promise<boolean> {
    try {
      const [salt, userHash] = userPasswordHash.split(':');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return userHash === derivedKey;
    } catch (error) {
      this.logger.error(`Error comparing passwords: ${error.message}`);
      throw error;
    }
  }

  private async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password'],
    });

    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  async validateUserByToken(authorizationHeader: string): Promise<UserEntity | null> {
    try {
      const token = authorizationHeader.split(' ')[1];
      const payload: JwtPayload = this.jwtService.verify(token);
      const { userEmail } = payload;
      return await this.userRepository.findOne({ where: { email: userEmail } });
    } catch (error) {
      this.logger.error(`Error validating token: ${error.message}`);
      return null;
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthEntity> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshTokenDto.refreshToken);
      const { userEmail } = payload;
      const user = await this.userRepository.findOne({ where: { email: userEmail } });
      if (user) {
        const { newAccessToken, newRefreshToken, newActionToken } = await this.generateTokens(userEmail);
        await this.authRepository.update(
          { userEmail },
          { accessToken: newAccessToken, refreshToken: newRefreshToken, actionToken: newActionToken },
        );
        return await this.authRepository.findOne({ where: { userEmail } });
      }
    } catch (error) {
      this.logger.error(`Error refreshing tokens: ${error.message}`);
      throw new UnauthorizedException('Invalid refreshToken');
    }
  }
}
