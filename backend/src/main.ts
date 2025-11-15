import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Root route for health check
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'Salary Calculator API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        salary: '/api/salary',
        ats: '/api/ats',
      },
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
}

bootstrap();

