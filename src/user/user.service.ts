import { Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject("USERS_REPOSITORY")
        private readonly userRepo: typeof User,
    ) {}

    async findByEmail(email: string): Promise<UserDto> {
        const user = await this.userRepo.findOne({where: { email }});
        return this.toDto(user);
    }

    async newUser(dto: UserDto) {
        const user = new User();

        user.firstname = dto.firstname;
        user.lastname = dto.lastname;
        user.password = dto.password;
        user.email = dto.email;

        await user.save();
    }

    private toDto(user: User): UserDto {
        const dto = new UserDto();

        dto.id = user.id;
        dto.firstname = user.firstname;
        dto.lastname = user.lastname;
        dto.password = user.password;
        dto.email = user.email;

        return dto
    }
}
