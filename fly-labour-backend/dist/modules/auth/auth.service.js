"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    constructor(usersRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Email này đã được sử dụng');
        const hashed = await bcrypt.hash(dto.password, 12);
        const user = this.usersRepo.create({
            ...dto,
            password: hashed,
            role: dto.role ?? user_entity_1.UserRole.USER,
        });
        await this.usersRepo.save(user);
        const { password, ...result } = user;
        return {
            message: 'Đăng ký thành công!',
            user: result,
            token: this.signToken(user),
        };
    }
    async login(dto) {
        const user = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Tài khoản đã bị khóa, vui lòng liên hệ admin');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        const { password, ...result } = user;
        return {
            message: 'Đăng nhập thành công!',
            user: result,
            token: this.signToken(user),
        };
    }
    async getProfile(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException();
        const { password, ...result } = user;
        return result;
    }
    signToken(user) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map