import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    updateMe(req: any, dto: {
        fullName?: string;
        phone?: string;
        address?: string;
        cvUrl?: string;
        companyName?: string;
        companyDescription?: string;
        website?: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        cvUrl: string;
        companyName: string;
        companyDescription: string;
        website: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: any, dto: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<{
        message: string;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            avatar: string;
            address: string;
            role: import("./user.entity").UserRole;
            isActive: boolean;
            cvUrl: string;
            companyName: string;
            companyDescription: string;
            website: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        total: number;
        active: number;
        thisMonth: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        cvUrl: string;
        companyName: string;
        companyDescription: string;
        website: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleActive(id: string): Promise<{
        message: string;
        isActive: boolean;
    }>;
    updateByAdmin(id: string, dto: {
        fullName?: string;
        phone?: string;
        role?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        cvUrl: string;
        companyName: string;
        companyDescription: string;
        website: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
