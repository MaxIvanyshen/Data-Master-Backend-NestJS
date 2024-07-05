import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*', // You can specify a specific origin or an array of origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true, // Optional: Set to true if you need to include credentials like cookies in requests
    });

    const PORT = process.env.SERVER_PORT || 3000
    await app.listen(PORT, () => console.log(`listening on localhost:${PORT}`));
}

bootstrap();
