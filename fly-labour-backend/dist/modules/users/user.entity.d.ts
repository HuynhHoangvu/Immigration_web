export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    EMPLOYER = "employer"
}
export declare class User {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    avatar: string;
    address: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    companyName: string;
    companyDescription: string;
    website: string;
    createdAt: Date;
    updatedAt: Date;
}
