import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  console.log('🚀 Starting MediChive Backend Server...');
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS to allow requests from your frontend
  app.enableCors({
    origin: [
      'http://localhost:3000', // Backend server
      'http://127.0.0.1:3000', // Alternative localhost
      'http://localhost:3001', // Frontend or other services
      'http://localhost:8080', // Flutter web dev server alternative
      'http://10.0.2.2:3000', // Android emulator
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global validation pipe (keep your existing setup)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Changed to false to allow extra properties
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log('✅ MediChive Backend Server is running!');
  console.log(`🌐 Server URL: http://localhost:${port}`);
  console.log('📡 Ready to accept API requests');
}
bootstrap().catch((error) => {
  console.error('❌ Failed to start MediChive Backend Server:', error);
  process.exit(1);
});
