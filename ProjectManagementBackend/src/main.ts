import { NestFactory } from '@nestjs/core';
import { AppModule } from './component/app/app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin:['http://localhost:3000','http://13.58.47.84']
  });
  await app.listen(5000);
}
bootstrap();
