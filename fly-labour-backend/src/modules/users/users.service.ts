import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = query
    const qb = this.usersRepo.createQueryBuilder('user').orderBy('user.createdAt', 'DESC')
    if (search) {
      qb.where('(user.fullName ILIKE :s OR user.email ILIKE :s)', { s: `%${search}%` })
    }
    qb.skip((page - 1) * limit).take(limit)
    const [data, total] = await qb.getManyAndCount()
    // Ẩn password
    const safeData = data.map(u => { const { password, ...rest } = u; return rest })
    return { data: safeData, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Không tìm thấy người dùng')
    const { password, ...rest } = user
    return rest
  }

  async toggleActive(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Không tìm thấy người dùng')
    user.isActive = !user.isActive
    await this.usersRepo.save(user)
    return { message: user.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản', isActive: user.isActive }
  }

  async getStats() {
    const total = await this.usersRepo.count()
    const active = await this.usersRepo.count({ where: { isActive: true } })
    const thisMonth = await this.usersRepo
      .createQueryBuilder('u')
      .where('u.createdAt >= :date', { date: new Date(new Date().getFullYear(), new Date().getMonth(), 1) })
      .getCount()
    return { total, active, thisMonth }
  }

  async updateProfile(id: string, dto: { fullName?: string; phone?: string; address?: string; avatar?: string }) {
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException()
    Object.assign(user, dto)
    await this.usersRepo.save(user)
    const { password, ...rest } = user
    return rest
  }

  async updateByAdmin(id: string, dto: { fullName?: string; phone?: string; role?: string; isActive?: boolean }) {
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Không tìm thấy người dùng')
    Object.assign(user, dto)
    await this.usersRepo.save(user)
    const { password, ...rest } = user
    return rest
  }

  async remove(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Không tìm thấy người dùng')
    await this.usersRepo.remove(user)
    return { message: 'Đã xóa tài khoản' }
  }

  async changePassword(id: string, dto: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    if (dto.newPassword !== dto.confirmPassword) throw new BadRequestException('Mật khẩu xác nhận không khớp')
    if (dto.newPassword.length < 6) throw new BadRequestException('Mật khẩu mới phải có ít nhất 6 ký tự')
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException()
    const valid = await bcrypt.compare(dto.currentPassword, user.password)
    if (!valid) throw new UnauthorizedException('Mật khẩu hiện tại không đúng')
    user.password = await bcrypt.hash(dto.newPassword, 12)
    await this.usersRepo.save(user)
    return { message: 'Đổi mật khẩu thành công' }
  }
}
