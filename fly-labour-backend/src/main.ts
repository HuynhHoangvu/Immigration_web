import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // CORS — cho phép frontend localhost:5173 gọi API
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  })

  // Tự động validate DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))

  // Serve ảnh upload tĩnh tại /uploads/...
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })

  // Swagger API docs tại /api
  const config = new DocumentBuilder()
    .setTitle('🦅 Fly Labour API')
    .setDescription('API tuyển dụng lao động quốc tế — Úc · Canada · New Zealand')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config))

  const port = process.env.PORT || 3000
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})
  await app.listen(port)

  console.log('\n🦅 ================================')
  console.log(`🚀 Backend:  http://localhost:${port}`)
  console.log(`📖 API Docs: http://localhost:${port}/api`)
  console.log(`🖼️  Uploads:  http://localhost:${port}/uploads`)
  console.log('🦅 ================================\n')
}
bootstrap()
