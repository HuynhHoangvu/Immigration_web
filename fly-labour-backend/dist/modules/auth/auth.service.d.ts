import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            avatar: string;
            address: string;
            role: UserRole;
            isActive: boolean;
            cvUrl: string;
            companyName: string;
            companyDescription: string;
            website: string;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            avatar: string;
            address: string;
            role: UserRole;
            isActive: boolean;
            cvUrl: string;
            companyName: string;
            companyDescription: string;
            website: string;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: UserRole;
        isActive: boolean;
        cvUrl: string;
        companyName: string;
        companyDescription: string;
        website: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private signToken;
}
