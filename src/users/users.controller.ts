import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResource } from './users.resource';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return UserResource.toResource(user);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return UserResource.toCollection(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOne(+id);
    return UserResource.toResource(user);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return UserResource.toResource(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.usersService.remove(+id);
    return { message: 'User deleted successfully' };
  }
}
