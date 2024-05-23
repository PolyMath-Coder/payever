import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalRoute } from './shared/constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GlobalRoute.PREFIX);
  await app.listen(process.env.PORT);
}
bootstrap();
