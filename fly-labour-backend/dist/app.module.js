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
                    if (databaseUrl) {
                        return {
                            type: 'postgres',
                            url: databaseUrl,
                            ssl: { rejectUnauthorized: false },
                            entities: [__dirname + '/**/*.entity{.ts,.js}'],
                            synchronize: true,
                            logging: false,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: cfg.get('DB_HOST', 'localhost'),
                        port: cfg.get('DB_PORT', 5432),
                        username: cfg.get('DB_USERNAME', 'postgres'),
                        password: cfg.get('DB_PASSWORD', '123456'),
                        database: cfg.get('DB_NAME', 'fly_labour'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: cfg.get('NODE_ENV') !== 'production',
                        logging: cfg.get('NODE_ENV') === 'development',
                    };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            jobs_module_1.JobsModule,
            applications_module_1.ApplicationsModule,
            categories_module_1.CategoriesModule,
            news_module_1.NewsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map