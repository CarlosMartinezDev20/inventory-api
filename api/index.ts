import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: '*',
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Inventory Management API')
      .setDescription('REST API for inventory management system with PostgreSQL and Prisma')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication', 'Login and JWT authentication')
      .addTag('Users', 'User management')
      .addTag('Categories', 'Product categories')
      .addTag('Suppliers', 'Supplier management')
      .addTag('Customers', 'Customer management')
      .addTag('Warehouses', 'Warehouse locations')
      .addTag('Products', 'Product catalog with inventory tracking')
      .addTag('Inventory', 'Inventory levels and adjustments')
      .addTag('Stock Movements', 'Stock IN/OUT operations')
      .addTag('Purchase Orders', 'Purchase orders and receiving')
      .addTag('Sales Orders', 'Sales orders and fulfillment')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    await app.init();
  }
  return app;
}

module.exports = async (req: any, res: any) => {
  const server = await bootstrap();
  const httpAdapter = server.getHttpAdapter();
  const instance = httpAdapter.getInstance();
  return instance(req, res);
};
