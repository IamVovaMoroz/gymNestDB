import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserEntity } from './entities/user.entity';
import { UserUpdateDto } from './dto/user.update.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPaginatedData } from '../../types/interface';
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  async createUser(@Body() userDto: UserCreateDto): Promise<UserEntity> {
    return await this.userService.createUser(userDto);
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto): Promise<UserEntity> {
    return this.userService.updateUser(+id, updateUserDto);
  }
  @Delete(':id')
  async softDeleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.softDeleteUser(+id);
  }
  @ApiResponse({ type: UserEntity, isArray: true })
  @Get('all')
  async findAll(@Query('page') page: string, @Query('limit') limit: string): Promise<IPaginatedData<UserEntity>> {
    return this.userService.findAll(+page, +limit);
  }
  @ApiQuery({ name: 'fieldName', description: 'email, last_name , first_name' })
  @Get('field')
  async getUserByField(
    @Query('fieldName') fieldName: keyof UserEntity,
    @Query('value') value: string,
  ): Promise<UserEntity> {
    return await this.userService.getUserByField(fieldName, value);
  }
  @Get('/:id')
  async getUserById(@Param('id') userId?: string): Promise<UserEntity> {
    return this.userService.getUserById(+userId);
  }
}
