import { Module, Logger } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { StudyApplicationsModule } from './modules/study-applications/study-applications.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { NewsModule } from './modules/news/news.module'
import { ContactModule } from './modules/contact/contact.module'
import { SettingsModule } from './modules/settings/settings.module'
import { UploadModule } from './modules/upload/upload.module'
import { GcsModule } from './common/services/gcs.module'
import { ChoresModule } from './modules/chores/chores.module'
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
          const isInternalUrl = databaseUrl.includes('.internal');

          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: isInternalUrl ? false : { rejectUnauthorized: false },
            entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
            synchronize: true,
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

        const host = cfg.get<string>('DB_HOST', 'localhost')
        const password = cfg.get<string>('DB_PASSWORD')
        if (!password) logger.warn('DB_PASSWORD not set — using default "123456" (development only)')
        return {
          type: 'postgres',
          host,
          port: cfg.get<number>('DB_PORT', 5432),
          username: cfg.get<string>('DB_USERNAME', 'postgres'),
          password: password ?? '123456',
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

    GcsModule,
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    StudyApplicationsModule,
    CategoriesModule,
    NewsModule,
    ContactModule,
    SettingsModule,
    UploadModule,
    ChoresModule,
  ],
})
export class AppModule {}
