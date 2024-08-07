import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '@/main/api/users/use-cases';
import { CreateUserDTO } from '@/main/api/users/dtos/create-user.dto';
import { UserOutputDTO } from '@/common/dtos/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(
    @Body() CreateUserDto: CreateUserDTO,
  ): Promise<UserOutputDTO> {
    const { user } = await this.createUserUseCase.execute({
      createUserDto: CreateUserDto,
    });

    return UserOutputDTO.toHttp(user);
  }
}
