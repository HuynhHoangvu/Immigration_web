import { Injectable, NotFoundException, ConflictException, OnModuleInit, Logger } from '@nestjs/common'
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
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name)
  constructor(
    @InjectRepository(Category) private catsRepo: Repository<Category>,
    private gcsService: GcsService,
  ) {}

  async onModuleInit() {
    // Tự động chuyển đổi icon emoji sang icon số (1-11) nếu phát hiện
    const mapping: Record<string, string> = {
      'Nông nghiệp': '1',
      'Chăm sóc sắc đẹp': '2',
      'Nail & Spa': '2',
      'Kỹ thuật': '3',
      'Xây dựng': '4',
      'Nhà hàng': '5',
      'Dịch Vụ - Nhà hàng - Khách sạn': '5',
      'Y tế': '6',
      'Logistics': '7',
      'Công nghệ': '8',
      'Lao động phổ thông': '9',
      'Giáo dục': '10',
      'Dịch vụ': '11',
    }

    try {
      const categories = await this.catsRepo.find()
      let updatedCount = 0
      
      for (const cat of categories) {
        // Nếu icon là emoji (không phải số và không phải URL)
        const isEmoji = cat.icon && !cat.icon.match(/^\d+$/) && !cat.icon.startsWith('http') && !cat.icon.startsWith('/')
        
        if (isEmoji) {
          const newIcon = mapping[cat.name]
          if (newIcon) {
            cat.icon = newIcon
            await this.catsRepo.save(cat)
            updatedCount++
          }
        }
      }
      
      if (updatedCount > 0) {
        this.logger.log(`✅ Tự động cập nhật ${updatedCount} icon danh mục sang định dạng PNG mới.`)
      }
    } catch (err) {
      this.logger.error('❌ Lỗi khi tự động cập nhật icon danh mục:', err.message)
    }
  }

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
