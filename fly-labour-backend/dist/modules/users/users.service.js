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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./user.entity");
const constants_1 = require("../../common/constants");
let UsersService = class UsersService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async findAll(query) {
        const { page = 1, search } = query;
        const limit = Math.min(query.limit ?? constants_1.PAGINATION.DEFAULT_LIMIT, constants_1.PAGINATION.MAX_LIMIT);
        const qb = this.usersRepo.createQueryBuilder('user').orderBy('user.createdAt', 'DESC');
        if (search) {
            qb.where('(user.fullName ILIKE :s OR user.email ILIKE :s)', { s: `%${search}%` });
        }
        qb.skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        const safeData = data.map(u => { const { password, ...rest } = u; return rest; });
        return { data: safeData, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        const { password, ...rest } = user;
        return rest;
    }
    async toggleActive(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        user.isActive = !user.isActive;
        await this.usersRepo.save(user);
        return { message: user.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản', isActive: user.isActive };
    }
    async getStats() {
        const total = await this.usersRepo.count();
        const active = await this.usersRepo.count({ where: { isActive: true } });
        const thisMonth = await this.usersRepo
            .createQueryBuilder('u')
            .where('u.createdAt >= :date', { date: new Date(new Date().getFullYear(), new Date().getMonth(), 1) })
            .getCount();
        return { total, active, thisMonth };
    }
    async updateProfile(id, dto) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException();
        Object.assign(user, dto);
        await this.usersRepo.save(user);
        const { password, ...rest } = user;
        return rest;
    }
    async updateByAdmin(id, dto) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        Object.assign(user, dto);
        await this.usersRepo.save(user);
        const { password, ...rest } = user;
        return rest;
    }
    async remove(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        await this.usersRepo.remove(user);
        return { message: 'Đã xóa tài khoản' };
    }
    async changePassword(id, dto) {
        if (dto.newPassword !== dto.confirmPassword)
            throw new common_1.BadRequestException('Mật khẩu xác nhận không khớp');
        if (dto.newPassword.length < 6)
            throw new common_1.BadRequestException('Mật khẩu mới phải có ít nhất 6 ký tự');
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException();
        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Mật khẩu hiện tại không đúng');
        user.password = await bcrypt.hash(dto.newPassword, 12);
        await this.usersRepo.save(user);
        return { message: 'Đổi mật khẩu thành công' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map