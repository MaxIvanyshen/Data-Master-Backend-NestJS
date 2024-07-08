import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });

    const PORT = process.env.SERVER_PORT || 3000
    await app.listen(PORT, () => console.log(`listening on localhost:${PORT}`));
}

bootstrap();
