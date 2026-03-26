import { Module, Logger } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { NewsModule } from './modules/news/news.module'
import { ContactModule } from './modules/contact/contact.module'
import { SettingsModule } from './modules/settings/settings.module'
import { UploadModule } from './modules/upload/upload.module'
import { join } from 'path'

const logger = new Logger('TypeORM')

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const databaseUrl = cfg.get<string>('DATABASE_URL');
        const nodeEnv = cfg.get<string>('NODE_ENV', 'development');
        const isProduction = nodeEnv !== 'development';

        if (databaseUrl) {
          // Kiểm tra xem URL có phải là mạng nội bộ của Railway không
          const isInternalUrl = databaseUrl.includes('.internal');

          return {
            type: 'postgres',
            url: databaseUrl,
            // Nếu là nội bộ -> Tắt SSL (false). Nếu là Public -> Bật SSL
            ssl: isInternalUrl ? false : { rejectUnauthorized: false }, 
            entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
            synchronize: !isProduction,
            logging: !isProduction,
            retryAttempts: 5,
            retryDelay: 3000,
            connectTimeoutMS: 30000,
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
          retryAttempts: 5,
          retryDelay: 3000,
          connectTimeoutMS: 30000,
        };
      },
    }),

    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    CategoriesModule,
    NewsModule,
    ContactModule,
    SettingsModule,
    UploadModule,
  ],
})
export class AppModule {}