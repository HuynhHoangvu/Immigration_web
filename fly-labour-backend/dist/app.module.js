"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const applications_module_1 = require("./modules/applications/applications.module");
const categories_module_1 = require("./modules/categories/categories.module");
const news_module_1 = require("./modules/news/news.module");
const contact_module_1 = require("./modules/contact/contact.module");
const settings_module_1 = require("./modules/settings/settings.module");
const upload_module_1 = require("./modules/upload/upload.module");
const gcs_module_1 = require("./common/services/gcs.module");
const chores_module_1 = require("./modules/chores/chores.module");
const path_1 = require("path");
const logger = new common_1.Logger('TypeORM');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => {
                    const databaseUrl = cfg.get('DATABASE_URL');
                    const nodeEnv = cfg.get('NODE_ENV', 'development');
                    const isProduction = nodeEnv !== 'development';
                    if (databaseUrl) {
                        const isInternalUrl = databaseUrl.includes('.internal');
                        return {
                            type: 'postgres',
                            url: databaseUrl,
                            ssl: isInternalUrl ? false : { rejectUnauthorized: false },
                            entities: [(0, path_1.join)(__dirname, '**', '*.entity{.ts,.js}')],
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
                    const host = cfg.get('DB_HOST', 'localhost');
                    const password = cfg.get('DB_PASSWORD');
                    if (!password)
                        logger.warn('DB_PASSWORD not set — using default "123456" (development only)');
                    return {
                        type: 'postgres',
                        host,
                        port: cfg.get('DB_PORT', 5432),
                        username: cfg.get('DB_USERNAME', 'postgres'),
                        password: password ?? '123456',
                        database: cfg.get('DB_NAME', 'fly_labour'),
                        entities: [(0, path_1.join)(__dirname, '**', '*.entity{.ts,.js}')],
                        synchronize: true,
                        logging: true,
                        retryAttempts: 5,
                        retryDelay: 3000,
                        connectTimeoutMS: 30000,
                    };
                },
            }),
            gcs_module_1.GcsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            jobs_module_1.JobsModule,
            applications_module_1.ApplicationsModule,
            categories_module_1.CategoriesModule,
            news_module_1.NewsModule,
            contact_module_1.ContactModule,
            settings_module_1.SettingsModule,
            upload_module_1.UploadModule,
            chores_module_1.ChoresModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map