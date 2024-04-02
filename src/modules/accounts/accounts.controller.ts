import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Accounts } from './entities/account.entity';
import { ApiResponse } from '@nestjs/swagger';
import { IPaginatedData } from 'src/types/interface';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create')
  create(@Body() createAccountDto: CreateAccountDto): Promise<Accounts> {
    return this.accountsService.create(createAccountDto);
  }

  @ApiResponse({ type: Accounts, isArray: true })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IPaginatedData<Accounts>> {
    return await this.accountsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAccountDto: UpdateAccountDto) {
    return await this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.accountsService.softDelete(id);
  }
}
