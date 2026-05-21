import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { Module } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'
import { extname } from 'path'
import { GcsService } from '../../common/services/gcs.service'

@ApiTags('📎 Upload')
@Controller('upload')
export class UploadController {
  constructor(private gcsService: GcsService) {}

  @Post('cv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Upload CV (PDF/DOC)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (_req, file, cb) => {
      const allowed = ['.pdf', '.doc', '.docx']
      const ext = extname(file.originalname).toLowerCase()
      if (allowed.includes(ext)) cb(null, true)
      else cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX'), false)
    },
  }))
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    const url = await this.gcsService.uploadFile(file, 'cv')
    return { url, filename: file.originalname }
  }

  @Post('image')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Upload ảnh (JPG/PNG/WebP/GIF) — dùng cho soạn thảo bài viết' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
      const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
      const ext = extname(file.originalname).toLowerCase()
      if (allowed.includes(ext)) cb(null, true)
      else cb(new Error('Chỉ chấp nhận file JPG, PNG, WebP, GIF'), false)
    },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.gcsService.uploadFile(file, 'images')
    return { url, filename: file.originalname }
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Upload ảnh đại diện (JPG/PNG/WebP/GIF)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
      const ext = extname(file.originalname).toLowerCase()
      if (allowed.includes(ext)) cb(null, true)
      else cb(new Error('Chỉ chấp nhận file JPG, PNG, WebP, GIF'), false)
    },
  }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const url = await this.gcsService.uploadFile(file, 'avatars')
    return { url, filename: file.originalname }
  }
}

@Module({
  controllers: [UploadController],
})
export class UploadModule {}
