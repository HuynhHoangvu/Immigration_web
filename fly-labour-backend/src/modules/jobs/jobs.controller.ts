import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  UseInterceptors, UploadedFile, BadRequestException, HttpCode
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { JobsService } from './jobs.service'
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'
import { EmployerGuard } from '../../common/guards/employer.guard'
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

@ApiTags('💼 Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // ── PUBLIC ──────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'List jobs (filter + pagination)' })
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query)
  }

  @Get('filters/available')
  @ApiOperation({ summary: 'Get available filter options (countries, categories)' })
  getAvailableFilters() {
    return this.jobsService.getAvailableFilters()
  }

  @Get('hot')
  @ApiOperation({ summary: 'Hot / Featured jobs' })
  findHot() {
    return this.jobsService.findHot()
  }

  // ── EMPLOYER ─────────────────────────────────────────
  @Get('employer/my')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Employer] My job listings' })
  findEmployerJobs(@Request() req: any, @Query() query: QueryJobDto) {
    return this.jobsService.findByEmployer(req.user.id, query)
  }

  @Get('employer/performance')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Employer] Job performance (views, apps, conversion)' })
  getEmployerPerformance(@Request() req: any) {
    return this.jobsService.getEmployerPerformance(req.user.id)
  }

  @Post('employer')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @HttpCode(201)
  @ApiOperation({ summary: '[Employer] Create job listing' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor)
  createByEmployer(@Body() dto: CreateJobDto, @Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.jobsService.createByEmployer(dto, req.user.id, file)
  }

  @Patch('employer/:id')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Employer] Update own job listing' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor)
  updateByEmployer(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.jobsService.updateByEmployer(id, req.user.id, dto, file)
  }

  @Delete('employer/:id')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @HttpCode(200)
  @ApiOperation({ summary: '[Employer] Delete own job listing' })
  deleteByEmployer(@Param('id') id: string, @Request() req: any) {
    return this.jobsService.deleteByEmployer(id, req.user.id)
  }

  // ── ADMIN ────────────────────────────────────────────
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] All job listings including drafts' })
  findAllAdmin(@Query() query: QueryJobDto) {
    return this.jobsService.findAllAdmin(query)
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Dashboard stats' })
  getStats() {
    return this.jobsService.getStats()
  }

  @Get('admin/pending-count')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Count pending review jobs' })
  getPendingCount() {
    return this.jobsService.getPendingCount()
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Approve employer job listing' })
  approveJob(@Param('id') id: string) {
    return this.jobsService.approveJob(id)
  }

  @Patch('admin/:id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Reject employer job listing' })
  rejectJob(@Param('id') id: string) {
    return this.jobsService.rejectJob(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @HttpCode(201)
  @ApiOperation({ summary: '[Admin] Create job listing' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor)
  create(@Body() dto: CreateJobDto, @UploadedFile() file?: Express.Multer.File) {
    return this.jobsService.create(dto, file)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Update job listing' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor)
  update(@Param('id') id: string, @Body() dto: UpdateJobDto, @UploadedFile() file?: Express.Multer.File) {
    return this.jobsService.update(id, dto, file)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Delete job listing' })
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id)
  }

  // ── PUBLIC detail (must be last) ─────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Job detail' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id)
  }
}
