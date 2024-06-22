import { AuthGuard } from "@nestjs/passport";

export const guardProviders = [
    {
        provide: "APP_GUARD",
        useClass: AuthGuard
    },
];
