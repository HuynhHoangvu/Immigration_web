import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { StudyApplicationsService, CreateStudyApplicationDto, UpdateStudyApplicationStatusDto } from './study-applications.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@ApiTags('🎓 Đơn Du học')
@Controller('study-applications')
export class StudyApplicationsController {
  constructor(private appsService: StudyApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Nộp đơn du học (không cần đăng nhập)' })
  create(@Body() dto: CreateStudyApplicationDto, @Request() req: any) {
    return this.appsService.create(dto, req.user?.id)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'My study applications' })
  myApplications(@Request() req: any) {
    return this.appsService.findByUser(req.user.id)
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tất cả đơn du học' })
  findAll(@Query() query: { page?: number; limit?: number; status?: string; targetCountry?: string }) {
    return this.appsService.findAll(query)
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Thống kê theo trạng thái' })
  getStats() {
    return this.appsService.getStatsByStatus()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Chi tiết đơn' })
  findOne(@Param('id') id: string) {
    return this.appsService.findOne(id)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái đơn' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStudyApplicationStatusDto) {
    return this.appsService.updateStatus(id, dto)
  }

@Patch(':id/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[User] Rút đơn du học' })
  withdraw(@Param('id') id: string, @Request() req: any) {
    return this.appsService.withdraw(id, req.user.id)
  }

  @Get('public')
  @ApiOperation({ summary: '[Public] Đơn du học đã duyệt (hiển thị công khai)' })
  findApproved(@Query() query: { page?: number; limit?: number; targetCountry?: string }) {
    return this.appsService.findApproved(query)
  }
}
