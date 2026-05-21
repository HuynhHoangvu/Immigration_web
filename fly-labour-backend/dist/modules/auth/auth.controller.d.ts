import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            avatar: string;
            address: string;
            role: import("../users/user.entity").UserRole;
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
            role: import("../users/user.entity").UserRole;
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
    googleLogin(body: {
        idToken: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            avatar: string;
            address: string;
            role: import("../users/user.entity").UserRole;
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
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: import("../users/user.entity").UserRole;
        isActive: boolean;
        cvUrl: string;
        companyName: string;
        companyDescription: string;
        website: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
