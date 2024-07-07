import { DbData } from 'src/db-data/entity/db-data.entity';

export class UserInfoDto {
    firstname: string;
    lastname: string;
    email: string;
    databases: Map<String, DbData[]>;
}
