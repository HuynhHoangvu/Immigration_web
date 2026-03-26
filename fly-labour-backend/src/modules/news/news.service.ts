import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { News } from './news.entity'
import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export class CreateNewsDto {
  @ApiProperty() @IsString() title: string
  @ApiProperty() @IsString() slug: string
  @ApiProperty({ required: false }) @IsOptional() excerpt?: string
  @ApiProperty({ required: false }) @IsOptional() content?: string
  @ApiProperty({ required: false }) @IsOptional() image?: string
  @ApiProperty({ required: false }) @IsOptional() isPublished?: boolean
}

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private newsRepo: Repository<News>) {}

  findAll() {
    return this.newsRepo.find({ where: { isPublished: true }, order: { createdAt: 'DESC' }, take: 10 })
  }

  findAllAdmin() {
    return this.newsRepo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(slug: string) {
    const n = await this.newsRepo.findOne({ where: { slug } })
    if (!n) throw new NotFoundException('Không tìm thấy bài viết')
    return n
  }

  async create(dto: CreateNewsDto, file?: Express.Multer.File) {
    const n = this.newsRepo.create(dto)
    if (file) n.image = await this.saveFile(file)
    return this.newsRepo.save(n)
  }

  async update(id: string, dto: Partial<CreateNewsDto>, file?: Express.Multer.File) {
    const n = await this.newsRepo.findOne({ where: { id } })
    if (!n) throw new NotFoundException()
    Object.assign(n, dto)
    if (file) n.image = await this.saveFile(file)
    return this.newsRepo.save(n)
  }

  async remove(id: string) {
    const n = await this.newsRepo.findOne({ where: { id } })
    if (!n) throw new NotFoundException()
    await this.newsRepo.remove(n)
    return { message: 'Đã xóa bài viết' }
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads', 'news')
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })
    const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`
    writeFileSync(join(uploadDir, filename), file.buffer)
    return `/uploads/news/${filename}`
  }
}
