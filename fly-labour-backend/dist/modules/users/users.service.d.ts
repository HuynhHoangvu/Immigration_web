import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepo;
    constructor(usersRepo: Repository<User>);
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
    findOne(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: import("./user.entity").UserRole;
        isActive: boolean;
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
    getStats(): Promise<{
        total: number;
        active: number;
        thisMonth: number;
    }>;
    updateProfile(id: string, dto: {
        fullName?: string;
        phone?: string;
        address?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        address: string;
        role: import("./user.entity").UserRole;
        isActive: boolean;
        companyName: string;
        companyDescription: string;
        website: string;
        createdAt: Date;
        updatedAt: Date;
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
