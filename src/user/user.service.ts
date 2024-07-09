import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { LoginType, User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';
import { DbDataService } from 'src/db-data/db-data.service';
import { UserInfoDto } from './dto/user-info.dto';
import { Db, DbData } from 'src/db-data/entity/db-data.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly dbDataService: DbDataService,
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

    async getUserInfo(req: Request) {
        const uuid = await this.tokenService.getUUID(await this.tokenService.extractTokenFromHeader(req));
        const user = await this.findByUUID(uuid);
        const userInfo = new UserInfoDto();

        userInfo.firstname = user.firstname;
        userInfo.lastname = user.lastname;
        userInfo.email = user.email;
        userInfo.databases = {};
        
        let psqlDbs = await this.dbDataService.findByUserAndDb(uuid, Db.PostgreSQL);
        for(let i = 0; i < psqlDbs.length; i++) {
            psqlDbs[i] = psqlDbs[i].dataValues;
        }
        userInfo.databases['PostgreSQL'] = psqlDbs;

        let mysqlDbs = await this.dbDataService.findByUserAndDb(uuid, Db.MySQL);
        for(let i = 0; i < mysqlDbs.length; i++) {
            mysqlDbs[i] = mysqlDbs[i].dataValues;
        }
        userInfo.databases['MySQL'] = mysqlDbs;

        let mongoDbs = await this.dbDataService.findByUserAndDb(uuid, Db.MongoDB);
        for(let i = 0; i < mongoDbs.length; i++) {
            mongoDbs[i] = mongoDbs[i].dataValues;
        }
        userInfo.databases['MongoDB'] = mongoDbs;

        return userInfo
    }
}
