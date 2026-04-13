import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from './category.entity'
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type, Transform } from 'class-transformer'
import { GcsService } from '../../common/services/gcs.service'

export class CreateCategoryDto {
  @ApiProperty() @IsString() name: string
  @ApiProperty({ required: false }) @IsOptional() nameEn?: string
  @ApiProperty({ required: false }) @IsOptional() icon?: string
  @ApiProperty({ required: false }) @IsOptional() description?: string
  @ApiProperty({ required: false }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) isActive?: boolean
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) sortOrder?: number
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private catsRepo: Repository<Category>,
    private gcsService: GcsService,
  ) {}

  findAll() {
    return this.catsRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC', name: 'ASC' } })
  }

  findAllAdmin() {
    return this.catsRepo.find({ order: { sortOrder: 'ASC' } })
  }

  async findOne(id: string) {
    const cat = await this.catsRepo.findOne({ where: { id } })
    if (!cat) throw new NotFoundException('Không tìm thấy danh mục')
    return cat
  }

  async create(dto: CreateCategoryDto, file?: Express.Multer.File) {
    const exists = await this.catsRepo.findOne({ where: { name: dto.name } })
    if (exists) throw new ConflictException('Tên danh mục đã tồn tại')
    const cat = this.catsRepo.create(dto)
    if (file) {
      const url = await this.gcsService.uploadFile(file, 'categories')
      cat.icon = url
    }
    return this.catsRepo.save(cat)
  }

  async update(id: string, dto: Partial<CreateCategoryDto>, file?: Express.Multer.File) {
    const cat = await this.findOne(id)
    Object.assign(cat, dto)
    if (file) {
      const url = await this.gcsService.uploadFile(file, 'categories')
      cat.icon = url
    }
    return this.catsRepo.save(cat)
  }

  async remove(id: string) {
    const cat = await this.findOne(id)
    await this.catsRepo.remove(cat)
    return { message: 'Đã xóa danh mục' }
  }
}
