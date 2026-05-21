import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudyApplication, StudyApplicationStatus } from './study-application.entity'
import { IsString, IsEmail, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PAGINATION } from '../../common/constants'

export class CreateStudyApplicationDto {
  @ApiProperty() @IsString() fullName: string
  @ApiProperty() @IsEmail() email: string
  @ApiProperty() @IsString() phone: string
  @ApiProperty({ required: false }) @IsOptional() dateOfBirth?: string
  @ApiProperty({ required: false }) @IsOptional() address?: string
  @ApiProperty({ required: false }) @IsOptional() education?: string
  @ApiProperty({ required: false }) @IsOptional() experience?: string
  @ApiProperty({ required: false }) @IsOptional() languageLevel?: string
  @ApiProperty({ required: false }) @IsOptional() coverLetter?: string
  @ApiProperty({ required: false }) @IsOptional() cvUrl?: string
  @ApiProperty({ required: false }) @IsOptional() targetCountry?: string
  @ApiProperty({ required: false }) @IsOptional() university?: string
  @ApiProperty({ required: false }) @IsOptional() major?: string
  @ApiProperty({ required: false }) @IsOptional() degreeLevel?: string
  @ApiProperty({ required: false }) @IsOptional() intake?: string
  @ApiProperty({ required: false }) @IsOptional() budget?: string
}

export class UpdateStudyApplicationStatusDto {
  @ApiProperty({ enum: StudyApplicationStatus })
  status: StudyApplicationStatus

  @ApiProperty({ required: false })
  @IsOptional() adminNote?: string
}

@Injectable()
export class StudyApplicationsService {
  constructor(
    @InjectRepository(StudyApplication) private appsRepo: Repository<StudyApplication>,
  ) {}

  async create(dto: CreateStudyApplicationDto, userId?: string) {
    const app = this.appsRepo.create({ ...dto, userId })
    return this.appsRepo.save(app)
  }

  async findAll(query: { page?: number; limit?: number; status?: string; targetCountry?: string }) {
    const { page = 1, status, targetCountry } = query
    const limit = Math.min(query.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const qb = this.appsRepo.createQueryBuilder('app')
      .orderBy('app.createdAt', 'DESC')

    if (status) qb.where('app.status = :status', { status })
    if (targetCountry) qb.andWhere('app.targetCountry = :targetCountry', { targetCountry })

    qb.skip((page - 1) * limit).take(limit)
    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: string) {
    const app = await this.appsRepo.findOne({ where: { id } })
    if (!app) throw new NotFoundException('Không tìm thấy đơn du học')
    return app
  }

  async updateStatus(id: string, dto: UpdateStudyApplicationStatusDto) {
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
      order: { createdAt: 'DESC' },
    })
  }

async withdraw(id: string, userId: string) {
    const app = await this.appsRepo.findOne({ where: { id } })
    if (!app) throw new NotFoundException('Không tìm thấy đơn du học')
    if (app.userId !== userId) throw new NotFoundException('Bạn không có quyền rút đơn này')
    if (app.status === StudyApplicationStatus.WITHDRAWN) throw new NotFoundException('Đơn đã được rút trước đó')
    app.status = StudyApplicationStatus.WITHDRAWN
    return this.appsRepo.save(app)
  }

  // Public endpoint: lấy đơn đã duyệt để hiển thị công khai
  async findApproved(query: { page?: number; limit?: number; targetCountry?: string }) {
    const { page = 1, targetCountry } = query
    const limit = Math.min(query.limit ?? 20, 50)
    const qb = this.appsRepo.createQueryBuilder('app')
      .where('app.status = :status', { status: StudyApplicationStatus.APPROVED })
      .orderBy('app.createdAt', 'DESC')

    if (targetCountry) qb.andWhere('app.targetCountry = :targetCountry', { targetCountry })

    qb.skip((page - 1) * limit).take(limit)
    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } }
  }
}
