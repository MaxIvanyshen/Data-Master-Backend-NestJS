import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { LoginType, User } from './entity/user.entity';
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

    async create(dto: UserDto, loginType: LoginType) {
        if(await this.userRepo.findOne({ where: { email: dto.email }})) {
            throw new ConflictException("email already in use");
        }

        const user = new User();

        user.firstname = dto.firstname;
        user.lastname = dto.lastname;
        user.password = dto.password;
        user.email = dto.email;
        user.loginType = loginType;

        return await user.save();
    }
}
