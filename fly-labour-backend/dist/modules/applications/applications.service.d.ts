import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';
export declare class CreateApplicationDto {
    fullName: string;
    email: string;
    phone: string;
    jobId: string;
    dateOfBirth?: string;
    address?: string;
    education?: string;
    experience?: string;
    languageLevel?: string;
    coverLetter?: string;
    cvUrl?: string;
}
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
    adminNote?: string;
}
export declare class ApplicationsService {
    private appsRepo;
    constructor(appsRepo: Repository<Application>);
    create(dto: CreateApplicationDto, userId?: string): Promise<Application>;
    findAll(query: {
        page?: number;
        limit?: number;
        status?: string;
        jobId?: string;
    }): Promise<{
        data: Application[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Application>;
    updateStatus(id: string, dto: UpdateApplicationStatusDto): Promise<Application>;
    getStatsByStatus(): Promise<any[]>;
    findByUser(userId: string): Promise<Application[]>;
    findByEmployer(employerId: string): Promise<Application[]>;
    withdraw(id: string, userId: string): Promise<Application>;
    employerUpdateStatus(id: string, employerId: string, status: ApplicationStatus): Promise<Application>;
}
