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
const gcs_service_1 = require("../../common/services/gcs.service");
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
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['news', 'handbook', 'study', 'travel'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "registerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateNewsDto.prototype, "priceFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateNewsDto.prototype, "priceTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "priceCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "itinerary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "studyType", void 0);
let NewsService = class NewsService {
    constructor(newsRepo, gcsService) {
        this.newsRepo = newsRepo;
        this.gcsService = gcsService;
    }
    findAll() {
        return this.newsRepo.find({ where: { isPublished: true, type: 'news' }, order: { createdAt: 'DESC' }, take: 20 });
    }
    findAllHandbook() {
        return this.newsRepo.find({ where: { isPublished: true, type: 'handbook' }, order: { createdAt: 'DESC' }, take: 50 });
    }
    findAllStudy(country, studyType) {
        const where = { isPublished: true, type: 'study' };
        if (country)
            where.country = country;
        if (studyType)
            where.studyType = studyType;
        return this.newsRepo.find({ where, order: { createdAt: 'DESC' }, take: 100 });
    }
    findAllTravel() {
        return this.newsRepo.find({ where: { isPublished: true, type: 'travel' }, order: { createdAt: 'DESC' }, take: 100 });
    }
    findAllAdmin() {
        return this.newsRepo.find({ where: { type: 'news' }, order: { createdAt: 'DESC' } });
    }
    findAllHandbookAdmin() {
        return this.newsRepo.find({ where: { type: 'handbook' }, order: { createdAt: 'DESC' } });
    }
    findAllStudyAdmin() {
        return this.newsRepo.find({ where: { type: 'study' }, order: { createdAt: 'DESC' } });
    }
    findAllTravelAdmin() {
        return this.newsRepo.find({ where: { type: 'travel' }, order: { createdAt: 'DESC' } });
    }
    async findOne(slug) {
        const n = await this.newsRepo.findOne({ where: { slug } });
        if (!n)
            throw new common_1.NotFoundException('Không tìm thấy bài viết');
        return n;
    }
    async create(dto, file) {
        const n = this.newsRepo.create({
            ...dto,
            type: dto.type ?? 'news',
            isPublished: this.parseBoolean(dto.isPublished),
        });
        if (file)
            n.image = await this.saveFile(file, dto.type ?? 'news');
        return this.newsRepo.save(n);
    }
    async update(id, dto, file) {
        const n = await this.newsRepo.findOne({ where: { id } });
        if (!n)
            throw new common_1.NotFoundException();
        Object.assign(n, {
            ...dto,
            isPublished: dto.isPublished !== undefined ? this.parseBoolean(dto.isPublished) : n.isPublished,
        });
        if (file)
            n.image = await this.saveFile(file, n.type);
        return this.newsRepo.save(n);
    }
    async remove(id) {
        const n = await this.newsRepo.findOne({ where: { id } });
        if (!n)
            throw new common_1.NotFoundException();
        await this.newsRepo.remove(n);
        return { message: 'Đã xóa bài viết' };
    }
    parseBoolean(value) {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string')
            return value === 'true' || value === '1';
        return !!value;
    }
    async saveFile(file, type) {
        const folder = type === 'handbook' ? 'handbook'
            : type === 'study' ? 'study'
                : type === 'travel' ? 'travel'
                    : 'news';
        return this.gcsService.uploadFile(file, folder);
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gcs_service_1.GcsService])
], NewsService);
//# sourceMappingURL=news.service.js.map