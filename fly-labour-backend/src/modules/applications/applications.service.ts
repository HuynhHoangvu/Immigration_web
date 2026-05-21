import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Application, ApplicationStatus } from './application.entity'
import { IsString, IsEmail, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PAGINATION } from '../../common/constants'

export class CreateApplicationDto {
  @ApiProperty() @IsString() fullName: string
  @ApiProperty() @IsEmail() email: string
  @ApiProperty() @IsString() phone: string
  @ApiProperty() @IsString() jobId: string
  @ApiProperty({ required: false }) @IsOptional() dateOfBirth?: string
  @ApiProperty({ required: false }) @IsOptional() address?: string
  @ApiProperty({ required: false }) @IsOptional() education?: string
  @ApiProperty({ required: false }) @IsOptional() experience?: string
  @ApiProperty({ required: false }) @IsOptional() languageLevel?: string
  @ApiProperty({ required: false }) @IsOptional() coverLetter?: string
  @ApiProperty({ required: false }) @IsOptional() cvUrl?: string
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus

  @ApiProperty({ required: false })
  @IsOptional() adminNote?: string
}

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private appsRepo: Repository<Application>,
  ) {}

  async create(dto: CreateApplicationDto, userId?: string) {
    const app = this.appsRepo.create({ ...dto, userId })
    return this.appsRepo.save(app)
  }

  async findAll(query: { page?: number; limit?: number; status?: string; jobId?: string }) {
    const { page = 1, status, jobId } = query
    const limit = Math.min(query.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const qb = this.appsRepo.createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('app.user', 'user')
      .orderBy('app.createdAt', 'DESC')

    if (status) qb.where('app.status = :status', { status })
    if (jobId) qb.andWhere('app.jobId = :jobId', { jobId })

    qb.skip((page - 1) * limit).take(limit)
    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: string) {
    const app = await this.appsRepo.findOne({ where: { id }, relations: ['job', 'user'] })
    if (!app) throw new NotFoundException('Không tìm thấy đơn ứng tuyển')
    return app
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto) {
    const app = await this.findOne(id)
    app.status = dto.status
    if (dto.adminNote) app.adminNote = dto.adminNote
    return this.appsRepo.save(app)
  }

  async getStatsByStatus() {
    return this.appsRepo.createQueryBuilder('app')
      .select('app.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('app.status')
      .getRawMany()
  }

  async findByUser(userId: string) {
    return this.appsRepo.find({
      where: { userId },
      relations: ['job'],
      order: { createdAt: 'DESC' },
    })
  }

  async findByEmployer(employerId: string, query?: { status?: string; jobId?: string; search?: string }) {
    const qb = this.appsRepo.createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('app.user', 'user')
      .where('job.createdById = :employerId', { employerId })
      .orderBy('app.createdAt', 'DESC')
    if (query?.status) qb.andWhere('app.status = :status', { status: query.status })
    if (query?.jobId) qb.andWhere('app.jobId = :jobId', { jobId: query.jobId })
    if (query?.search) {
      qb.andWhere('(app.fullName ILIKE :s OR app.email ILIKE :s OR job.title ILIKE :s)', { s: `%${query.search}%` })
    }
    return qb.getMany()
  }

  async withdraw(id: string, userId: string) {
    const app = await this.appsRepo.findOne({ where: { id }, relations: ['job'] })
    if (!app) throw new NotFoundException('Không tìm thấy đơn ứng tuyển')
    if (app.userId !== userId) throw new ForbiddenException('Bạn không có quyền rút đơn này')
    if (app.status === ApplicationStatus.WITHDRAWN) throw new ForbiddenException('Đơn đã được rút trước đó')
    app.status = ApplicationStatus.WITHDRAWN
    return this.appsRepo.save(app)
  }

  async employerUpdateStatus(id: string, employerId: string, status: ApplicationStatus, employerNote?: string) {
    const app = await this.appsRepo.findOne({ where: { id }, relations: ['job'] })
    if (!app) throw new NotFoundException('Không tìm thấy đơn ứng tuyển')
    if (app.job?.createdById !== employerId) throw new ForbiddenException('Bạn không có quyền cập nhật đơn này')
    const allowed = [ApplicationStatus.REVIEWING, ApplicationStatus.APPROVED, ApplicationStatus.REJECTED]
    const isStatusUnchanged = status === app.status
    if (!allowed.includes(status) && !isStatusUnchanged) {
      throw new ForbiddenException('Trạng thái không hợp lệ cho nhà tuyển dụng')
    }
    app.status = status
    if (employerNote !== undefined) app.employerNote = employerNote
    return this.appsRepo.save(app)
  }
}
