"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = exports.UpdateApplicationStatusDto = exports.CreateApplicationDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("./application.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
class CreateApplicationDto {
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "languageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "coverLetter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "cvUrl", void 0);
class UpdateApplicationStatusDto {
}
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: application_entity_1.ApplicationStatus }),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "adminNote", void 0);
let ApplicationsService = class ApplicationsService {
    constructor(appsRepo) {
        this.appsRepo = appsRepo;
    }
    async create(dto, userId) {
        const app = this.appsRepo.create({ ...dto, userId });
        return this.appsRepo.save(app);
    }
    async findAll(query) {
        const { page = 1, status, jobId } = query;
        const limit = Math.min(query.limit ?? constants_1.PAGINATION.DEFAULT_LIMIT, constants_1.PAGINATION.MAX_LIMIT);
        const qb = this.appsRepo.createQueryBuilder('app')
            .leftJoinAndSelect('app.job', 'job')
            .leftJoinAndSelect('app.user', 'user')
            .orderBy('app.createdAt', 'DESC');
        if (status)
            qb.where('app.status = :status', { status });
        if (jobId)
            qb.andWhere('app.jobId = :jobId', { jobId });
        qb.skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const app = await this.appsRepo.findOne({ where: { id }, relations: ['job', 'user'] });
        if (!app)
            throw new common_1.NotFoundException('Không tìm thấy đơn ứng tuyển');
        return app;
    }
    async updateStatus(id, dto) {
        const app = await this.findOne(id);
        app.status = dto.status;
        if (dto.adminNote)
            app.adminNote = dto.adminNote;
        return this.appsRepo.save(app);
    }
    async getStatsByStatus() {
        return this.appsRepo.createQueryBuilder('app')
            .select('app.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('app.status')
            .getRawMany();
    }
    async findByUser(userId) {
        return this.appsRepo.find({
            where: { userId },
            relations: ['job'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByEmployer(employerId) {
        return this.appsRepo.createQueryBuilder('app')
            .leftJoinAndSelect('app.job', 'job')
            .leftJoinAndSelect('app.user', 'user')
            .where('job.createdById = :employerId', { employerId })
            .orderBy('app.createdAt', 'DESC')
            .getMany();
    }
    async withdraw(id, userId) {
        const app = await this.appsRepo.findOne({ where: { id }, relations: ['job'] });
        if (!app)
            throw new common_1.NotFoundException('Không tìm thấy đơn ứng tuyển');
        if (app.userId !== userId)
            throw new common_1.ForbiddenException('Bạn không có quyền rút đơn này');
        if (app.status === application_entity_1.ApplicationStatus.WITHDRAWN)
            throw new common_1.ForbiddenException('Đơn đã được rút trước đó');
        app.status = application_entity_1.ApplicationStatus.WITHDRAWN;
        return this.appsRepo.save(app);
    }
    async employerUpdateStatus(id, employerId, status) {
        const app = await this.appsRepo.findOne({ where: { id }, relations: ['job'] });
        if (!app)
            throw new common_1.NotFoundException('Không tìm thấy đơn ứng tuyển');
        if (app.job?.createdById !== employerId)
            throw new common_1.ForbiddenException('Bạn không có quyền cập nhật đơn này');
        app.status = status;
        return this.appsRepo.save(app);
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map