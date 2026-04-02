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
exports.UploadModule = exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const path_1 = require("path");
const gcs_service_1 = require("../../common/services/gcs.service");
let UploadController = class UploadController {
    constructor(gcsService) {
        this.gcsService = gcsService;
    }
    async uploadCv(file) {
        const url = await this.gcsService.uploadFile(file, 'cv');
        return { url, filename: file.originalname };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('cv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload CV (PDF/DOC)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 20 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const allowed = ['.pdf', '.doc', '.docx'];
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (allowed.includes(ext))
                cb(null, true);
            else
                cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX'), false);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadCv", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('📎 Upload'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [gcs_service_1.GcsService])
], UploadController);
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_2.Module)({
        controllers: [UploadController],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map