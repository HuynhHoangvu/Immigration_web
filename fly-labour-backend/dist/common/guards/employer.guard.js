"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerGuard = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../modules/users/user.entity");
let EmployerGuard = class EmployerGuard {
    canActivate(context) {
        const { user } = context.switchToHttp().getRequest();
        if (user?.role !== user_entity_1.UserRole.EMPLOYER && user?.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only employer accounts can perform this action');
        }
        return true;
    }
};
exports.EmployerGuard = EmployerGuard;
exports.EmployerGuard = EmployerGuard = __decorate([
    (0, common_1.Injectable)()
], EmployerGuard);
//# sourceMappingURL=employer.guard.js.map