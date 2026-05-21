import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { User, UserRole } from '../users/user.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email này đã được sử dụng')

    const hashed = await bcrypt.hash(dto.password, 12)
    
    const user = this.usersRepo.create({
      ...dto,
      password: hashed,
      role: dto.role ?? UserRole.USER,
    })
    
    await this.usersRepo.save(user)

    const { password, ...result } = user
    return {
      message: 'Đăng ký thành công!',
      user: result,
      token: this.signToken(user),
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    if (!user.isActive) throw new UnauthorizedException('Tài khoản đã bị khóa, vui lòng liên hệ admin')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Email hoặc mật khẩu không đúng')

    const { password, ...result } = user
    return {
      message: 'Đăng nhập thành công!',
      user: result,
      token: this.signToken(user),
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } })
    if (!user) throw new UnauthorizedException()
    const { password, ...result } = user
    return result
  }

  async loginWithGoogle(idToken: string) {
    if (!idToken) throw new UnauthorizedException('Thiếu Google token')
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('GOOGLE_CLIENT_ID chưa được cấu hình')
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload?.email) throw new UnauthorizedException('Token Google không hợp lệ')

    let user = await this.usersRepo.findOne({ where: { email: payload.email } })
    if (!user) {
      const randomPassword = await bcrypt.hash(`google-${payload.sub}-${Date.now()}`, 12)
      user = this.usersRepo.create({
        email: payload.email,
        fullName: payload.name || payload.email.split('@')[0],
        avatar: payload.picture,
        password: randomPassword,
        role: UserRole.USER,
      })
      await this.usersRepo.save(user)
    } else if (!user.avatar && payload.picture) {
      user.avatar = payload.picture
      await this.usersRepo.save(user)
    }

    if (!user.isActive) throw new UnauthorizedException('Tài khoản đã bị khóa, vui lòng liên hệ admin')
    const { password, ...result } = user
    return {
      message: 'Đăng nhập Google thành công!',
      user: result,
      token: this.signToken(user),
    }
  }

  private signToken(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
  }
}