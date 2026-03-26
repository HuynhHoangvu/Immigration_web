import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ApplicationsService, CreateApplicationDto, UpdateApplicationStatusDto } from './applications.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'
import { EmployerGuard } from '../../common/guards/employer.guard'

@ApiTags('📋 Đơn ứng tuyển')
@Controller('applications')
export class ApplicationsController {
  constructor(private appsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Nộp đơn ứng tuyển (không cần đăng nhập)' })
  create(@Body() dto: CreateApplicationDto, @Request() req: any) {
    return this.appsService.create(dto, req.user?.id)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'My applications' })
  myApplications(@Request() req: any) {
    return this.appsService.findByUser(req.user.id)
  }

  @Get('employer')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Employer] Applications received for my job listings' })
  getEmployerApplications(@Request() req: any) {
    return this.appsService.findByEmployer(req.user.id)
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tất cả đơn ứng tuyển' })
  findAll(@Query() query: { page?: number; limit?: number; status?: string; jobId?: string }) {
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
  updateStatus(@Param('id') id: string, @Body() dto: UpdateApplicationStatusDto) {
    return this.appsService.updateStatus(id, dto)
  }

  @Patch(':id/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[User] Rút đơn ứng tuyển' })
  withdraw(@Param('id') id: string, @Request() req: any) {
    return this.appsService.withdraw(id, req.user.id)
  }

  @Patch(':id/employer-status')
  @UseGuards(JwtAuthGuard, EmployerGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Employer] Cập nhật trạng thái đơn của ứng viên' })
  employerUpdateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req: any) {
    return this.appsService.employerUpdateStatus(id, req.user.id, body.status as any)
  }
}
