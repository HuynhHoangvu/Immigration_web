import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { CategoriesService, CreateCategoryDto } from './categories.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'
import { FILE_UPLOAD } from '../../common/constants'

const imageUploadInterceptor = FileInterceptor('image', {
  storage: memoryStorage(),
  limits: { fileSize: FILE_UPLOAD.MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      return cb(new BadRequestException(`Chỉ chấp nhận file ảnh (${FILE_UPLOAD.ALLOWED_MIME_TYPES.join(', ')})`), false)
    }
    cb(null, true)
  },
})

@ApiTags('🏷️ Danh mục')
@Controller('categories')
export class CategoriesController {
  constructor(private catsService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục (public)' })
  findAll() { return this.catsService.findAll() }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  findAllAdmin() { return this.catsService.findAllAdmin() }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tạo danh mục' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor)
  create(@Body() dto: CreateCategoryDto, @UploadedFile() file?: Express.Multer.File) {
    return this.catsService.create(dto, file)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Cập nhật danh mục' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCategoryDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.catsService.update(id, dto, file)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Xóa danh mục' })
  remove(@Param('id') id: string) { return this.catsService.remove(id) }
}
