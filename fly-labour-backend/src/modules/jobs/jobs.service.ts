import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './job.entity';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';
import { GcsService } from '../../common/services/gcs.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
    private gcsService: GcsService,
  ) {}

  async findAll(query: QueryJobDto) {
    const { page = 1, limit = 12, search, country, categoryId, jobType, isHot, sort } = query;

    const qb = this.jobsRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.category', 'category')
      .where('job.status = :status', { status: JobStatus.ACTIVE });

    if (search) {
      qb.andWhere('(job.title ILIKE :s OR job.company ILIKE :s OR job.location ILIKE :s)', { s: `%${search}%` });
    }
    if (country) qb.andWhere('job.country = :country', { country });
    if (categoryId) qb.andWhere('job.categoryId = :categoryId', { categoryId });
    if (jobType) qb.andWhere('job.jobType = :jobType', { jobType });
    if (isHot !== undefined) qb.andWhere('job.isHot = :isHot', { isHot });

    if (sort === 'hot') {
      qb.orderBy('job.isHot', 'DESC').addOrderBy('job.isFeatured', 'DESC').addOrderBy('job.createdAt', 'DESC');
    } else if (sort === 'salary_desc') {
      qb.orderBy('job.salaryMax', 'DESC').addOrderBy('job.salaryMin', 'DESC').addOrderBy('job.createdAt', 'DESC');
    } else {
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
      .where('job.status = :status', { status: JobStatus.ACTIVE })
      .getMany()

    const countries = [...new Set(jobs.map(j => j.country).filter(Boolean))]
    const categoryIds = [...new Set(jobs.map(j => j.categoryId).filter(Boolean))]
    return { countries, categoryIds }
  }

  async findHot() {
    return this.jobsRepo.find({
      where: { isHot: true, status: JobStatus.ACTIVE },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 8,
    });
  }

  // Admin: all jobs including draft/paused
  async findAllAdmin(query: QueryJobDto) {
    const { page = 1, limit = 20, search } = query;
    const qb = this.jobsRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.category', 'category')
      .leftJoinAndSelect('job.createdBy', 'createdBy');

    if (search) {
      qb.where('(job.title ILIKE :s OR job.company ILIKE :s OR createdBy.companyName ILIKE :s)', { s: `%${search}%` });
    }
    qb.orderBy('job.createdAt', 'DESC').skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    // Ẩn password của createdBy
    const safeData = data.map(job => {
      if (job.createdBy) {
        const { password, ...safeUser } = job.createdBy as any;
        return { ...job, createdBy: safeUser };
      }
      return job;
    });
    return { data: safeData, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const job = await this.jobsRepo.findOne({ where: { id }, relations: ['category'] });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobsRepo.increment({ id }, 'viewCount', 1);
    return job;
  }

  async create(dto: CreateJobDto, file?: Express.Multer.File) {
    const job = this.jobsRepo.create(dto);
    if (file) job.image = await this.saveFile(file);
    return this.jobsRepo.save(job);
  }

  async update(id: string, dto: UpdateJobDto, file?: Express.Multer.File) {
    const job = await this.findOneRaw(id);
    Object.assign(job, dto);
    if (file) job.image = await this.saveFile(file);
    return this.jobsRepo.save(job);
  }

  async remove(id: string) {
    const job = await this.findOneRaw(id);
    await this.jobsRepo.remove(job);
    return { message: 'Job deleted successfully' };
  }

  // ── Employer methods ──────────────────────────────────
  async findByEmployer(employerId: string, query: QueryJobDto) {
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

  async createByEmployer(dto: CreateJobDto, employerId: string, file?: Express.Multer.File) {
    const job = this.jobsRepo.create({ ...dto, createdById: employerId, status: JobStatus.PENDING_REVIEW });
    if (file) job.image = await this.saveFile(file);
    return this.jobsRepo.save(job);
  }

  async approveJob(id: string) {
    const job = await this.findOneRaw(id);
    job.status = JobStatus.ACTIVE;
    return this.jobsRepo.save(job);
  }

  async rejectJob(id: string) {
    const job = await this.findOneRaw(id);
    job.status = JobStatus.CLOSED;
    return this.jobsRepo.save(job);
  }

  async getPendingCount() {
    const count = await this.jobsRepo.count({ where: { status: JobStatus.PENDING_REVIEW } });
    return { count };
  }

  async updateByEmployer(id: string, employerId: string, dto: UpdateJobDto, file?: Express.Multer.File) {
    const job = await this.findOneRaw(id);
    if (job.createdById !== employerId) {
      throw new ForbiddenException('You can only edit your own job listings');
    }
    Object.assign(job, dto);
    if (file) job.image = await this.saveFile(file);
    return this.jobsRepo.save(job);
  }

  async deleteByEmployer(id: string, employerId: string) {
    const job = await this.findOneRaw(id);
    if (job.createdById !== employerId) {
      throw new ForbiddenException('You can only delete your own job listings');
    }
    await this.jobsRepo.remove(job);
    return { message: 'Job deleted successfully' };
  }

  async getStats() {
    const [totalJobs, activeJobs, totalUsers] = await Promise.all([
      this.jobsRepo.count(),
      this.jobsRepo.count({ where: { status: JobStatus.ACTIVE } }),
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

  private async findOneRaw(id: string) {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    return this.gcsService.uploadFile(file, 'jobs');
  }
}
