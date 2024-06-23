import { Sequelize } from 'sequelize-typescript';
import { DbData } from 'src/db-data/entity/db-data.entity';
import { User } from 'src/user/entity/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
      });
      sequelize.addModels([User, DbData]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
