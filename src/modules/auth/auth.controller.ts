import { Body, Controller, Get, Post, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthEntity } from './entities/auth.entity';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthDto } from '../user/dto/user.auth.dto';
import { UserEntity } from '../user/entities/user.entity';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: UserAuthDto): Promise<AuthEntity> {
    return this.authService.login(userDto);
  }
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Headers('authorization') authorizationHeader: string): Promise<UserEntity | null> {
    return await this.authService.validateUserByToken(authorizationHeader);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('refresh-token')
  async refreshTokens(@Body() refreshToken: RefreshTokenDto): Promise<AuthEntity> {
    return this.authService.refreshTokens(refreshToken);
  }
}
