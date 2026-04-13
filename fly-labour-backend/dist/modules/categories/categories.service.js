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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = exports.CreateCategoryDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./category.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const gcs_service_1 = require("../../common/services/gcs.service");
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "nameEn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "sortOrder", void 0);
let CategoriesService = CategoriesService_1 = class CategoriesService {
    constructor(catsRepo, gcsService) {
        this.catsRepo = catsRepo;
        this.gcsService = gcsService;
        this.logger = new common_1.Logger(CategoriesService_1.name);
    }
    async onModuleInit() {
        const mapping = {
            'Nông nghiệp': '1',
            'Chăm sóc sắc đẹp': '2',
            'Nail & Spa': '2',
            'Kỹ thuật': '3',
            'Xây dựng': '4',
            'Nhà hàng': '5',
            'Dịch Vụ - Nhà hàng - Khách sạn': '5',
            'Y tế': '6',
            'Logistics': '7',
            'Công nghệ': '8',
            'Lao động phổ thông': '9',
            'Giáo dục': '10',
            'Dịch vụ': '11',
        };
        try {
            const categories = await this.catsRepo.find();
            let updatedCount = 0;
            for (const cat of categories) {
                const isEmoji = cat.icon && !cat.icon.match(/^\d+$/) && !cat.icon.startsWith('http') && !cat.icon.startsWith('/');
                if (isEmoji) {
                    const newIcon = mapping[cat.name];
                    if (newIcon) {
                        cat.icon = newIcon;
                        await this.catsRepo.save(cat);
                        updatedCount++;
                    }
                }
            }
            if (updatedCount > 0) {
                this.logger.log(`✅ Tự động cập nhật ${updatedCount} icon danh mục sang định dạng PNG mới.`);
            }
        }
        catch (err) {
            this.logger.error('❌ Lỗi khi tự động cập nhật icon danh mục:', err.message);
        }
    }
    findAll() {
        return this.catsRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC', name: 'ASC' } });
    }
    findAllAdmin() {
        return this.catsRepo.find({ order: { sortOrder: 'ASC' } });
    }
    async findOne(id) {
        const cat = await this.catsRepo.findOne({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Không tìm thấy danh mục');
        return cat;
    }
    async create(dto, file) {
        const exists = await this.catsRepo.findOne({ where: { name: dto.name } });
        if (exists)
            throw new common_1.ConflictException('Tên danh mục đã tồn tại');
        const cat = this.catsRepo.create(dto);
        if (file) {
            const url = await this.gcsService.uploadFile(file, 'categories');
            cat.icon = url;
        }
        return this.catsRepo.save(cat);
    }
    async update(id, dto, file) {
        const cat = await this.findOne(id);
        Object.assign(cat, dto);
        if (file) {
            const url = await this.gcsService.uploadFile(file, 'categories');
            cat.icon = url;
        }
        return this.catsRepo.save(cat);
    }
    async remove(id) {
        const cat = await this.findOne(id);
        await this.catsRepo.remove(cat);
        return { message: 'Đã xóa danh mục' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gcs_service_1.GcsService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map