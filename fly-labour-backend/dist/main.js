"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const logger = new common_1.Logger('Bootstrap');
async function bootstrap() {
    let app;
    try {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
    }
    catch (err) {
        console.error('❌ Failed to initialize application (database connection error):', err);
        process.exit(1);
    }
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl)
        logger.warn('FRONTEND_URL not set — production CORS may be too permissive');
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://localhost:8081',
        'http://localhost:8082',
        'http://127.0.0.1:8081',
        'http://127.0.0.1:8082',
        'https://flylabour.up.railway.app',
        'https://flyimmigration.vn',
        'https://www.flyimmigration.vn',
        frontendUrl,
    ].filter(Boolean);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin))
                return callback(null, true);
            callback(new Error(`Origin ${origin} not allowed`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), { prefix: '/uploads' });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('🦅 Fly Labour API')
        .setDescription('API tuyển dụng lao động quốc tế — Úc · Canada · New Zealand')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();
    swagger_1.SwaggerModule.setup('api', app, swagger_1.SwaggerModule.createDocument(app, config));
    app.getHttpAdapter().get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log('\n🦅 ================================');
    console.log(`🚀 Backend:  http://localhost:${port}`);
    console.log(`📖 API Docs: http://localhost:${port}/api`);
    console.log(`🖼️  Uploads:  http://localhost:${port}/uploads`);
    console.log('🦅 ================================\n');
}
bootstrap();
//# sourceMappingURL=main.js.map