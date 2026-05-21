import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { NewsService, CreateNewsDto } from './news.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { News } from './news.entity'

@ApiTags('📰 Tin tức')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Tin tức đã publish (type=news)' })
  findAll() { return this.newsService.findAll() }

  @Get('handbook')
  @ApiOperation({ summary: 'Cẩm nang đã publish (type=handbook)' })
  findAllHandbook() { return this.newsService.findAllHandbook() }

  @Get('study')
  @ApiOperation({ summary: 'Du học đã publish (type=study)' })
  findAllStudy(@Query('country') country?: string, @Query('studyType') studyType?: string) {
    return this.newsService.findAllStudy(country, studyType)
  }

  @Get('travel')
  @ApiOperation({ summary: 'Gói du lịch đã publish (type=travel)' })
  findAllTravel() { return this.newsService.findAllTravel() }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  findAllAdmin() { return this.newsService.findAllAdmin() }

  @Get('admin/handbook')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  findAllHandbookAdmin() { return this.newsService.findAllHandbookAdmin() }

  @Get('admin/study')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  findAllStudyAdmin() { return this.newsService.findAllStudyAdmin() }

  @Get('admin/travel')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  findAllTravelAdmin() { return this.newsService.findAllTravelAdmin() }

  @Get(':slug')
  @ApiOperation({ summary: 'Chi tiết bài viết theo slug' })
  findOne(@Param('slug') slug: string) { return this.newsService.findOne(slug) }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tạo bài viết' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(@Body() dto: CreateNewsDto, @UploadedFile() file?: Express.Multer.File) {
    return this.newsService.create(dto, file)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Cập nhật bài viết' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(@Param('id') id: string, @Body() dto: Partial<CreateNewsDto>, @UploadedFile() file?: Express.Multer.File) {
    return this.newsService.update(id, dto, file)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Xóa bài viết' })
  remove(@Param('id') id: string) { return this.newsService.remove(id) }
}

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
