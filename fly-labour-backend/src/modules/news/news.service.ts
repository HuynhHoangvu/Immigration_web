import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { News } from './news.entity'
import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GcsService } from '../../common/services/gcs.service'

export class CreateNewsDto {
  @ApiProperty() @IsString() title: string
  @ApiProperty() @IsString() slug: string
  @ApiProperty({ required: false }) @IsOptional() excerpt?: string
  @ApiProperty({ required: false }) @IsOptional() content?: string
  @ApiProperty({ required: false }) @IsOptional() image?: string
  @ApiProperty({ required: false }) @IsOptional() isPublished?: boolean
  @ApiProperty({ required: false, enum: ['news', 'handbook', 'study', 'travel'] }) @IsOptional() type?: 'news' | 'handbook' | 'study' | 'travel'
  @ApiProperty({ required: false }) @IsOptional() country?: string
  @ApiProperty({ required: false }) @IsOptional() registerUrl?: string
  @ApiProperty({ required: false }) @IsOptional() priceFrom?: number
  @ApiProperty({ required: false }) @IsOptional() priceTo?: number
  @ApiProperty({ required: false }) @IsOptional() priceCurrency?: string
  @ApiProperty({ required: false }) @IsOptional() itinerary?: string
  @ApiProperty({ required: false }) @IsOptional() studyType?: string
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepo: Repository<News>,
    private gcsService: GcsService,
  ) {}

  // ── Public ────────────────────────────────────────────────────────────────
  findAll() {
    return this.newsRepo.find({ where: { isPublished: true, type: 'news' }, order: { createdAt: 'DESC' }, take: 20 })
  }

  findAllHandbook() {
    return this.newsRepo.find({ where: { isPublished: true, type: 'handbook' }, order: { createdAt: 'DESC' }, take: 50 })
  }

  findAllStudy(country?: string, studyType?: string) {
    const where: any = { isPublished: true, type: 'study' }
    if (country) where.country = country
    if (studyType) where.studyType = studyType
    return this.newsRepo.find({ where, order: { createdAt: 'DESC' }, take: 100 })
  }

  findAllTravel() {
    return this.newsRepo.find({ where: { isPublished: true, type: 'travel' }, order: { createdAt: 'DESC' }, take: 100 })
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  findAllAdmin() {
    return this.newsRepo.find({ where: { type: 'news' }, order: { createdAt: 'DESC' } })
  }

  findAllHandbookAdmin() {
    return this.newsRepo.find({ where: { type: 'handbook' }, order: { createdAt: 'DESC' } })
  }

  findAllStudyAdmin() {
    return this.newsRepo.find({ where: { type: 'study' }, order: { createdAt: 'DESC' } })
  }

  findAllTravelAdmin() {
    return this.newsRepo.find({ where: { type: 'travel' }, order: { createdAt: 'DESC' } })
  }

  async findOne(slug: string) {
    const n = await this.newsRepo.findOne({ where: { slug } })
    if (!n) throw new NotFoundException('Không tìm thấy bài viết')
    return n
  }

  async create(dto: CreateNewsDto, file?: Express.Multer.File) {
    const n = this.newsRepo.create({
      ...dto,
      type: dto.type ?? 'news',
      isPublished: this.parseBoolean(dto.isPublished),
    })
    if (file) n.image = await this.saveFile(file, dto.type ?? 'news')
    return this.newsRepo.save(n)
  }

  async update(id: string, dto: Partial<CreateNewsDto>, file?: Express.Multer.File) {
    const n = await this.newsRepo.findOne({ where: { id } })
    if (!n) throw new NotFoundException()
    Object.assign(n, {
      ...dto,
      isPublished: dto.isPublished !== undefined ? this.parseBoolean(dto.isPublished) : n.isPublished,
    })
    if (file) n.image = await this.saveFile(file, n.type)
    return this.newsRepo.save(n)
  }

  async remove(id: string) {
    const n = await this.newsRepo.findOne({ where: { id } })
    if (!n) throw new NotFoundException()
    await this.newsRepo.remove(n)
    return { message: 'Đã xóa bài viết' }
  }

  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return value === 'true' || value === '1'
    return !!value
  }

  private async saveFile(file: Express.Multer.File, type: string): Promise<string> {
    const folder =
      type === 'handbook' ? 'handbook'
      : type === 'study' ? 'study'
      : type === 'travel' ? 'travel'
      : 'news'
    return this.gcsService.uploadFile(file, folder)
  }
}
