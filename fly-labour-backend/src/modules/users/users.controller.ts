import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@ApiTags('👥 Người dùng')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // User tự cập nhật profile
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cập nhật hồ sơ bản thân' })
  updateMe(@Request() req: any, @Body() dto: { fullName?: string; phone?: string; address?: string }) {
    return this.usersService.updateProfile(req.user.id, dto)
  }

  @Patch('me/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  changePassword(@Request() req: any, @Body() dto: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    return this.usersService.changePassword(req.user.id, dto)
  }

  // Admin routes
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Danh sách người dùng' })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    return this.usersService.findAll(query)
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Thống kê người dùng' })
  getStats() { return this.usersService.getStats() }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Chi tiết người dùng' })
  findOne(@Param('id') id: string) { return this.usersService.findOne(id) }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Khóa / Mở khóa tài khoản' })
  toggleActive(@Param('id') id: string) { return this.usersService.toggleActive(id) }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Sửa thông tin người dùng' })
  updateByAdmin(@Param('id') id: string, @Body() dto: { fullName?: string; phone?: string; role?: string; isActive?: boolean }) {
    return this.usersService.updateByAdmin(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Xóa tài khoản' })
  remove(@Param('id') id: string) { return this.usersService.remove(id) }
}
