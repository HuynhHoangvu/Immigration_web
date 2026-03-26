import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { Module } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

@ApiTags('📎 Upload')
@Controller('upload')
export class UploadController {
  @Post('cv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Upload CV (PDF/DOC)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
      const allowed = ['.pdf', '.doc', '.docx']
      const ext = extname(file.originalname).toLowerCase()
      if (allowed.includes(ext)) cb(null, true)
      else cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX'), false)
    },
  }))
  uploadCv(@UploadedFile() file: Express.Multer.File) {
    const uploadDir = join(__dirname, '..', '..', '..', 'uploads', 'cv')
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })
    const filename = `${randomUUID()}${extname(file.originalname)}`
    writeFileSync(join(uploadDir, filename), file.buffer)
    return { url: `/uploads/cv/${filename}`, filename: file.originalname }
  }
}

@Module({
  controllers: [UploadController],
})
export class UploadModule {}
