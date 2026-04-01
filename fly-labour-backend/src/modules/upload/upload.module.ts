import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { Module } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
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
}

@Module({
  controllers: [UploadController],
})
export class UploadModule {}
