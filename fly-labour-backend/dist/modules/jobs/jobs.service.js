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
const gcs_service_1 = require("../../common/services/gcs.service");
const constants_1 = require("../../common/constants");
const job_translation_service_1 = require("./job-translation.service");
let JobsService = class JobsService {
    constructor(jobsRepo, gcsService, translationService) {
        this.jobsRepo = jobsRepo;
        this.gcsService = gcsService;
        this.translationService = translationService;
    }
    async findAll(query) {
        const { page = 1, search, country, categoryId, jobType, isHot, isFeatured, sort } = query;
        const limit = Math.min(query.limit ?? 12, constants_1.PAGINATION.MAX_LIMIT);
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
        if (isFeatured !== undefined)
            qb.andWhere('job.isFeatured = :isFeatured', { isFeatured });
        if (sort === 'hot') {
            qb.orderBy('job.isHot', 'DESC').addOrderBy('job.isFeatured', 'DESC').addOrderBy('job.createdAt', 'DESC');
        }
        else if (sort === 'salary_desc') {
            qb.orderBy('job.salaryMax', 'DESC').addOrderBy('job.salaryMin', 'DESC').addOrderBy('job.createdAt', 'DESC');
        }
        else {
            qb.orderBy('job.isHot', 'DESC').addOrderBy('job.isFeatured', 'DESC').addOrderBy('job.createdAt', 'DESC');
        }
        qb.skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async getAvailableFilters() {
        const jobs = await this.jobsRepo
            .createQueryBuilder('job')
            .select(['job.country', 'job.categoryId'])
            .where('job.status = :status', { status: job_entity_1.JobStatus.ACTIVE })
            .getMany();
        const countries = [...new Set(jobs.map(j => j.country).filter(Boolean))];
        const categoryIds = [...new Set(jobs.map(j => j.categoryId).filter(Boolean))];
        return { countries, categoryIds };
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
        const { page = 1, search } = query;
        const limit = Math.min(query.limit ?? constants_1.PAGINATION.DEFAULT_LIMIT, constants_1.PAGINATION.MAX_LIMIT);
        const qb = this.jobsRepo.createQueryBuilder('job')
            .leftJoinAndSelect('job.category', 'category')
            .leftJoinAndSelect('job.createdBy', 'createdBy');
        if (search) {
            qb.where('(job.title ILIKE :s OR job.company ILIKE :s OR createdBy.companyName ILIKE :s)', { s: `%${search}%` });
        }
        qb.orderBy('job.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        const safeData = data.map(job => {
            if (job.createdBy) {
                const { password, ...safeUser } = job.createdBy;
                return { ...job, createdBy: safeUser };
            }
            return job;
        });
        return { data: safeData, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const job = await this.jobsRepo.findOne({ where: { id }, relations: ['category'] });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        this.jobsRepo.createQueryBuilder()
            .update(job_entity_1.Job)
            .set({ viewCount: () => '"viewCount" + 1' })
            .where('id = :id', { id })
            .execute()
            .catch(() => { });
        return job;
    }
    async create(dto, file) {
        const translatedDto = await this.translationService.enrichEnglishFields(dto);
        const job = this.jobsRepo.create(translatedDto);
        if (file)
            job.image = await this.saveFile(file);
        return this.jobsRepo.save(job);
    }
    async update(id, dto, file) {
        const job = await this.findOneRaw(id);
        const translatedDto = await this.translationService.enrichEnglishFields(dto, job, Boolean(dto.forceRetranslate));
        delete translatedDto.forceRetranslate;
        Object.assign(job, translatedDto);
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
        const { page = 1 } = query;
        const limit = Math.min(query.limit ?? constants_1.PAGINATION.DEFAULT_LIMIT, constants_1.PAGINATION.MAX_LIMIT);
        const qb = this.jobsRepo.createQueryBuilder('job')
            .leftJoinAndSelect('job.category', 'category')
            .where('job.createdById = :employerId', { employerId })
            .orderBy('job.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async getEmployerPerformance(employerId) {
        const rows = await this.jobsRepo
            .createQueryBuilder('job')
            .leftJoin('applications', 'app', 'app.jobId = job.id')
            .select('job.id', 'jobId')
            .addSelect('job.title', 'title')
            .addSelect('job.viewCount', 'viewCount')
            .addSelect('COUNT(app.id)', 'applicationCount')
            .addSelect(`COUNT(app.id) FILTER (WHERE app.status = 'approved')`, 'approvedCount')
            .where('job.createdById = :employerId', { employerId })
            .groupBy('job.id')
            .addGroupBy('job.title')
            .addGroupBy('job.viewCount')
            .orderBy('job.createdAt', 'DESC')
            .getRawMany();
        return rows.map((r) => {
            const views = Number(r.viewCount || 0);
            const apps = Number(r.applicationCount || 0);
            return {
                jobId: r.jobId,
                title: r.title,
                viewCount: views,
                applicationCount: apps,
                approvedCount: Number(r.approvedCount || 0),
                conversionRate: views > 0 ? Number(((apps / views) * 100).toFixed(2)) : 0,
            };
        });
    }
    async createByEmployer(dto, employerId, file) {
        const translatedDto = await this.translationService.enrichEnglishFields(dto);
        const job = this.jobsRepo.create({ ...translatedDto, createdById: employerId, status: job_entity_1.JobStatus.PENDING_REVIEW });
        if (file)
            job.image = await this.saveFile(file);
        return this.jobsRepo.save(job);
    }
    async approveJob(id) {
        const job = await this.findOneRaw(id);
        job.status = job_entity_1.JobStatus.ACTIVE;
        return this.jobsRepo.save(job);
    }
    async rejectJob(id) {
        const job = await this.findOneRaw(id);
        job.status = job_entity_1.JobStatus.CLOSED;
        return this.jobsRepo.save(job);
    }
    async getPendingCount() {
        const count = await this.jobsRepo.count({ where: { status: job_entity_1.JobStatus.PENDING_REVIEW } });
        return { count };
    }
    async updateByEmployer(id, employerId, dto, file) {
        const job = await this.findOneRaw(id);
        if (job.createdById !== employerId) {
            throw new common_1.ForbiddenException('You can only edit your own job listings');
        }
        const translatedDto = await this.translationService.enrichEnglishFields(dto, job, Boolean(dto.forceRetranslate));
        delete translatedDto.forceRetranslate;
        Object.assign(job, translatedDto);
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
        const [jobStats, byCountry] = await Promise.all([
            this.jobsRepo
                .createQueryBuilder('job')
                .select('COUNT(*)', 'totalJobs')
                .addSelect(`COUNT(*) FILTER (WHERE job.status = '${job_entity_1.JobStatus.ACTIVE}')`, 'activeJobs')
                .addSelect('COALESCE(SUM(job.viewCount), 0)', 'totalViews')
                .addSelect('(SELECT COUNT(*) FROM users)', 'totalUsers')
                .getRawOne(),
            this.jobsRepo
                .createQueryBuilder('job')
                .select('job.country', 'country')
                .addSelect('COUNT(*)', 'count')
                .groupBy('job.country')
                .getRawMany(),
        ]);
        return {
            totalJobs: parseInt(jobStats?.totalJobs || '0'),
            activeJobs: parseInt(jobStats?.activeJobs || '0'),
            totalViews: parseInt(jobStats?.totalViews || '0'),
            totalUsers: parseInt(jobStats?.totalUsers || '0'),
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
        return this.gcsService.uploadFile(file, 'jobs');
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gcs_service_1.GcsService,
        job_translation_service_1.JobTranslationService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map