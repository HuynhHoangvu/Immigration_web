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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const jobs_service_1 = require("./jobs.service");
const job_dto_1 = require("./dto/job.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
const employer_guard_1 = require("../../common/guards/employer.guard");
const constants_1 = require("../../common/constants");
const imageUploadInterceptor = (0, platform_express_1.FileInterceptor)('image', {
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: constants_1.FILE_UPLOAD.MAX_SIZE_BYTES },
    fileFilter: (_req, file, cb) => {
        if (!constants_1.FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new common_1.BadRequestException(`Chỉ chấp nhận file ảnh (${constants_1.FILE_UPLOAD.ALLOWED_MIME_TYPES.join(', ')})`), false);
        }
        cb(null, true);
    },
});
let JobsController = class JobsController {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    findAll(query) {
        return this.jobsService.findAll(query);
    }
    getAvailableFilters() {
        return this.jobsService.getAvailableFilters();
    }
    findHot() {
        return this.jobsService.findHot();
    }
    findEmployerJobs(req, query) {
        return this.jobsService.findByEmployer(req.user.id, query);
    }
    getEmployerPerformance(req) {
        return this.jobsService.getEmployerPerformance(req.user.id);
    }
    createByEmployer(dto, req, file) {
        return this.jobsService.createByEmployer(dto, req.user.id, file);
    }
    updateByEmployer(id, dto, req, file) {
        return this.jobsService.updateByEmployer(id, req.user.id, dto, file);
    }
    deleteByEmployer(id, req) {
        return this.jobsService.deleteByEmployer(id, req.user.id);
    }
    findAllAdmin(query) {
        return this.jobsService.findAllAdmin(query);
    }
    getStats() {
        return this.jobsService.getStats();
    }
    getPendingCount() {
        return this.jobsService.getPendingCount();
    }
    approveJob(id) {
        return this.jobsService.approveJob(id);
    }
    rejectJob(id) {
        return this.jobsService.rejectJob(id);
    }
    create(dto, file) {
        return this.jobsService.create(dto, file);
    }
    update(id, dto, file) {
        return this.jobsService.update(id, dto, file);
    }
    remove(id) {
        return this.jobsService.remove(id);
    }
    findOne(id) {
        return this.jobsService.findOne(id);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List jobs (filter + pagination)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.QueryJobDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filters/available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available filter options (countries, categories)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getAvailableFilters", null);
__decorate([
    (0, common_1.Get)('hot'),
    (0, swagger_1.ApiOperation)({ summary: 'Hot / Featured jobs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findHot", null);
__decorate([
    (0, common_1.Get)('employer/my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, employer_guard_1.EmployerGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Employer] My job listings' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, job_dto_1.QueryJobDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findEmployerJobs", null);
__decorate([
    (0, common_1.Get)('employer/performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, employer_guard_1.EmployerGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Employer] Job performance (views, apps, conversion)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getEmployerPerformance", null);
__decorate([
    (0, common_1.Post)('employer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, employer_guard_1.EmployerGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: '[Employer] Create job listing' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)(imageUploadInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.CreateJobDto, Object, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "createByEmployer", null);
__decorate([
    (0, common_1.Patch)('employer/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, employer_guard_1.EmployerGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Employer] Update own job listing' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)(imageUploadInterceptor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, job_dto_1.UpdateJobDto, Object, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "updateByEmployer", null);
__decorate([
    (0, common_1.Delete)('employer/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, employer_guard_1.EmployerGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: '[Employer] Delete own job listing' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "deleteByEmployer", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] All job listings including drafts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.QueryJobDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Dashboard stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('admin/pending-count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Count pending review jobs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getPendingCount", null);
__decorate([
    (0, common_1.Patch)('admin/:id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Approve employer job listing' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "approveJob", null);
__decorate([
    (0, common_1.Patch)('admin/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Reject employer job listing' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "rejectJob", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Create job listing' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)(imageUploadInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.CreateJobDto, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update job listing' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)(imageUploadInterceptor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, job_dto_1.UpdateJobDto, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Delete job listing' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Job detail' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOne", null);
exports.JobsController = JobsController = __decorate([
    (0, swagger_1.ApiTags)('💼 Jobs'),
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map