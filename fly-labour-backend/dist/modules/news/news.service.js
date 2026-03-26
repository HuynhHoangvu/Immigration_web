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
exports.NewsService = exports.CreateNewsDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_entity_1 = require("./news.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
class CreateNewsDto {
}
exports.CreateNewsDto = CreateNewsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNewsDto.prototype, "isPublished", void 0);
let NewsService = class NewsService {
    constructor(newsRepo) {
        this.newsRepo = newsRepo;
    }
    findAll() {
        return this.newsRepo.find({ where: { isPublished: true }, order: { createdAt: 'DESC' }, take: 10 });
    }
    findAllAdmin() {
        return this.newsRepo.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(slug) {
        const n = await this.newsRepo.findOne({ where: { slug } });
        if (!n)
            throw new common_1.NotFoundException('Không tìm thấy bài viết');
        return n;
    }
    async create(dto, file) {
        const n = this.newsRepo.create(dto);
        if (file)
            n.image = await this.saveFile(file);
        return this.newsRepo.save(n);
    }
    async update(id, dto, file) {
        const n = await this.newsRepo.findOne({ where: { id } });
        if (!n)
            throw new common_1.NotFoundException();
        Object.assign(n, dto);
        if (file)
            n.image = await this.saveFile(file);
        return this.newsRepo.save(n);
    }
    async remove(id) {
        const n = await this.newsRepo.findOne({ where: { id } });
        if (!n)
            throw new common_1.NotFoundException();
        await this.newsRepo.remove(n);
        return { message: 'Đã xóa bài viết' };
    }
    async saveFile(file) {
        const uploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'news');
        if (!(0, fs_1.existsSync)(uploadDir))
            (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
        const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
        (0, fs_1.writeFileSync)((0, path_1.join)(uploadDir, filename), file.buffer);
        return `/uploads/news/${filename}`;
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsService);
//# sourceMappingURL=news.service.js.map