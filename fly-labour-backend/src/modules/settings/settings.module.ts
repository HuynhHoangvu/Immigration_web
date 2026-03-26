import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Setting } from './settings.entity'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private repo: Repository<Setting>) {}

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.repo.find()
    return rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {} as Record<string, string>)
  }

  async saveAll(data: Record<string, string>) {
    for (const [key, value] of Object.entries(data)) {
      await this.repo.upsert({ key, value: String(value) }, ['key'])
    }
    return this.getAll()
  }
}

@ApiTags('⚙️ Cài đặt')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Lấy cài đặt hệ thống' })
  getAll() {
    return this.settingsService.getAll()
  }

  @Put()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Lưu cài đặt hệ thống' })
  saveAll(@Body() body: Record<string, string>) {
    return this.settingsService.saveAll(body)
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
