import { Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject("USERS_REPOSITORY")
        private readonly userRepo: typeof User,
    ) {}

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({where: { email }});
        return user
    }

    async findByUUID(uuid: string): Promise<User> {
        const user = await this.userRepo.findByPk(uuid);
        return user
    }

    async create(dto: UserDto) {
        const user = new User();

        user.firstname = dto.firstname;
        user.lastname = dto.lastname;
        user.password = dto.password;
        user.email = dto.email;

        return this.toDto(await user.save());
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
