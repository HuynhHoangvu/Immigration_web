import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { NewsModule } from './modules/news/news.module'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const databaseUrl = cfg.get<string>('DATABASE_URL');
        const nodeEnv = cfg.get<string>('NODE_ENV', 'development');

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            // Railway: Cần SSL cho external URL, nội bộ (.internal) đôi khi cũng cần tùy version
            ssl: { rejectUnauthorized: false },
            entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
            // Bật true một lần để tự tạo bảng cho database mới xóa
            synchronize: true, 
            logging: nodeEnv === 'development',
            extra: {
              max: 20,
              connectionTimeoutMillis: 30000,
              idleTimeoutMillis: 30000,
              statement_timeout: 30000,
            },
          };
        }

        // Cấu hình fallback cho Local (Docker/Localhost)
        return {
          type: 'postgres',
          host: cfg.get<string>('DB_HOST', 'localhost'),
          port: cfg.get<number>('DB_PORT', 5432),
          username: cfg.get<string>('DB_USERNAME', 'postgres'),
          password: cfg.get<string>('DB_PASSWORD', '123456'),
          database: cfg.get<string>('DB_NAME', 'fly_labour'),
          entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
          synchronize: true,
          logging: true,
        };
      },
    }),

    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    CategoriesModule,
    NewsModule,
  ],
})
export class AppModule {}