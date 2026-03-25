import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 1. CẬP NHẬT CORS: Thêm dấu * hoặc domain của Railway nếu cần
  app.enableCors({
    origin: true, // Cho phép tất cả các nguồn trong quá trình test, hoặc liệt kê domain Railway của bạn vào đây
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })

  const config = new DocumentBuilder()
    .setTitle('🦅 Fly Labour API')
    .setDescription('API tuyển dụng lao động quốc tế — Úc · Canada · New Zealand')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config))

  // Route healthcheck bạn đã viết rất tốt
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  const port = process.env.PORT || 3000
  
  // 2. QUAN TRỌNG NHẤT: Thêm '0.0.0.0' ở đây
  await app.listen(port, '0.0.0.0')

  console.log('\n🦅 ================================')
  console.log(`🚀 Backend:  http://0.0.0.0:${port}`)
  console.log(`📖 API Docs: http://0.0.0.0:${port}/api`)
  console.log('🦅 ================================\n')
}
bootstrap()
