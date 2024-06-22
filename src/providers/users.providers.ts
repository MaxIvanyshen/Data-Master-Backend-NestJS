import { User } from "../user/entity/user.entity";

export const usersProviders = [
    {
        provide: "USERS_REPOSITORY",
        useValue: User,
    },
];
