import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IsString, IsEmail, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from './contact.entity'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

export class CreateContactDto {
  @ApiProperty() @IsString() name: string
  @ApiProperty() @IsEmail() email: string
  @ApiProperty({ required: false }) @IsOptional() phone?: string
  @ApiProperty() @IsString() message: string
}

@Injectable()
export class ContactService {
  constructor(@InjectRepository(Contact) private repo: Repository<Contact>) {}

  create(dto: CreateContactDto) {
    const contact = this.repo.create(dto)
    return this.repo.save(contact)
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async markRead(id: string) {
    const c = await this.repo.findOne({ where: { id } })
    if (!c) throw new NotFoundException()
    c.isRead = true
    return this.repo.save(c)
  }

  async remove(id: string) {
    const c = await this.repo.findOne({ where: { id } })
    if (!c) throw new NotFoundException()
    await this.repo.remove(c)
    return { message: 'Đã xóa' }
  }
}

@ApiTags('📩 Liên hệ')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Gửi liên hệ' })
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Danh sách liên hệ' })
  findAll() {
    return this.contactService.findAll()
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Đánh dấu đã đọc' })
  markRead(@Param('id') id: string) {
    return this.contactService.markRead(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Xóa liên hệ' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(id)
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
