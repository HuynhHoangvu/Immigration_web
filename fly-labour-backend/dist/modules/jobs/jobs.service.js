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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./job.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let JobsService = class JobsService {
    constructor(jobsRepo) {
        this.jobsRepo = jobsRepo;
    }
    async findAll(query) {
        const { page = 1, limit = 12, search, country, categoryId, jobType, isHot } = query;
        const qb = this.jobsRepo.createQueryBuilder('job')
            .leftJoinAndSelect('job.category', 'category')
            .where('job.status = :status', { status: job_entity_1.JobStatus.ACTIVE });
        if (search) {
            qb.andWhere('(job.title ILIKE :s OR job.company ILIKE :s OR job.location ILIKE :s)', { s: `%${search}%` });
        }
        if (country)
            qb.andWhere('job.country = :country', { country });
        if (categoryId)
            qb.andWhere('job.categoryId = :categoryId', { categoryId });
        if (jobType)
            qb.andWhere('job.jobType = :jobType', { jobType });
        if (isHot !== undefined)
            qb.andWhere('job.isHot = :isHot', { isHot });
        qb.orderBy('job.isHot', 'DESC')
            .addOrderBy('job.isFeatured', 'DESC')
            .addOrderBy('job.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async findHot() {
        return this.jobsRepo.find({
            where: { isHot: true, status: job_entity_1.JobStatus.ACTIVE },
            relations: ['category'],
            order: { createdAt: 'DESC' },
            take: 8,
        });
    }
    async findAllAdmin(query) {
        const { page = 1, limit = 20, search } = query;
        const qb = this.jobsRepo.createQueryBuilder('job')
            .leftJoinAndSelect('job.category', 'category');
        if (search) {
            qb.where('(job.title ILIKE :s OR job.company ILIKE :s)', { s: `%${search}%` });
        }
        qb.orderBy('job.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const job = await this.jobsRepo.findOne({ where: { id }, relations: ['category'] });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        await this.jobsRepo.increment({ id }, 'viewCount', 1);
        return job;
    }
    async create(dto, file) {
        const job = this.jobsRepo.create(dto);
        if (file)
            job.image = await this.saveFile(file);
        return this.jobsRepo.save(job);
    }
    async update(id, dto, file) {
        const job = await this.findOneRaw(id);
        Object.assign(job, dto);
        if (file)
            job.image = await this.saveFile(file);
        return this.jobsRepo.save(job);
    }
    async remove(id) {
        const job = await this.findOneRaw(id);
        await this.jobsRepo.remove(job);
        return { message: 'Job deleted successfully' };
    }
    async findByEmployer(employerId, query) {
        const { page = 1, limit = 20 } = query;
        const qb = this.jobsRepo.createQueryBuilder('job')
            .leftJoinAndSelect('job.category', 'category')
            .where('job.createdById = :employerId', { employerId })
            .orderBy('job.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async createByEmployer(dto, employerId, file) {
        const job = this.jobsRepo.create({ ...dto, createdById: employerId });
        if (file)
            job.image = await this.saveFile(file);
        return this.jobsRepo.save(job);
    }
    async updateByEmployer(id, employerId, dto, file) {
        const job = await this.findOneRaw(id);
        if (job.createdById !== employerId) {
            throw new common_1.ForbiddenException('You can only edit your own job listings');
        }
        Object.assign(job, dto);
        if (file)
            job.image = await this.saveFile(file);
        return this.jobsRepo.save(job);
    }
    async deleteByEmployer(id, employerId) {
        const job = await this.findOneRaw(id);
        if (job.createdById !== employerId) {
            throw new common_1.ForbiddenException('You can only delete your own job listings');
        }
        await this.jobsRepo.remove(job);
        return { message: 'Job deleted successfully' };
    }
    async getStats() {
        const [totalJobs, activeJobs, totalUsers] = await Promise.all([
            this.jobsRepo.count(),
            this.jobsRepo.count({ where: { status: job_entity_1.JobStatus.ACTIVE } }),
            this.jobsRepo.query('SELECT COUNT(*) FROM users'),
        ]);
        const totalViews = await this.jobsRepo
            .createQueryBuilder('job').select('SUM(job.viewCount)', 'total').getRawOne();
        const byCountry = await this.jobsRepo
            .createQueryBuilder('job').select('job.country', 'country').addSelect('COUNT(*)', 'count')
            .groupBy('job.country').getRawMany();
        return {
            totalJobs,
            activeJobs,
            totalUsers: parseInt(totalUsers[0]?.count || '0'),
            totalViews: parseInt(totalViews?.total || '0'),
            byCountry,
        };
    }
    async findOneRaw(id) {
        const job = await this.jobsRepo.findOne({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return job;
    }
    async saveFile(file) {
        const uploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'jobs');
        if (!(0, fs_1.existsSync)(uploadDir)) {
            (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
        }
        const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
        const filePath = (0, path_1.join)(uploadDir, filename);
        (0, fs_1.writeFileSync)(filePath, file.buffer);
        return `/uploads/jobs/${filename}`;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map