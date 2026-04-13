import { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    role?: UserRole;
    companyName?: string;
    website?: string;
}
