import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '@/main/api/identification/use-cases';
import { CreateUserDTO } from '@/main/api/identification/dtos/create-user.dto';
import { UserOutputDTO } from '@/common/dtos/user.dto';
import { Auth } from '@/common/decorators/auth.decorator';
import { RoutePublic } from '@/common/decorators/route-public.decorator';

@Auth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @RoutePublic()
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
