import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';
export declare class JobsService {
    private jobsRepo;
    constructor(jobsRepo: Repository<Job>);
    findAll(query: QueryJobDto): Promise<{
        data: Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findHot(): Promise<Job[]>;
    findAllAdmin(query: QueryJobDto): Promise<{
        data: Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Job>;
    create(dto: CreateJobDto, file?: Express.Multer.File): Promise<Job>;
    update(id: string, dto: UpdateJobDto, file?: Express.Multer.File): Promise<Job>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByEmployer(employerId: string, query: QueryJobDto): Promise<{
        data: Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createByEmployer(dto: CreateJobDto, employerId: string, file?: Express.Multer.File): Promise<Job>;
    updateByEmployer(id: string, employerId: string, dto: UpdateJobDto, file?: Express.Multer.File): Promise<Job>;
    deleteByEmployer(id: string, employerId: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalJobs: number;
        activeJobs: number;
        totalUsers: number;
        totalViews: number;
        byCountry: any[];
    }>;
    private findOneRaw;
    private saveFile;
}
