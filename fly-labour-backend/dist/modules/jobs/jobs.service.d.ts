import { Repository } from 'typeorm';
import { Job, JobStatus } from './job.entity';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';
import { GcsService } from '../../common/services/gcs.service';
export declare class JobsService {
    private jobsRepo;
    private gcsService;
    constructor(jobsRepo: Repository<Job>, gcsService: GcsService);
    findAll(query: QueryJobDto): Promise<{
        data: Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAvailableFilters(): Promise<{
        countries: string[];
        categoryIds: string[];
    }>;
    findHot(): Promise<Job[]>;
    findAllAdmin(query: QueryJobDto): Promise<{
        data: {
            createdBy: any;
            id: string;
            title: string;
            description: string;
            requirements: string;
            benefits: string;
            company: string;
            location: string;
            country: string;
            jobType: import("./job.entity").JobType;
            status: JobStatus;
            salaryMin: number;
            salaryMax: number;
            salaryCurrency: string;
            slots: number;
            deadline: string;
            image: string;
            images: string[];
            isHot: boolean;
            isFeatured: boolean;
            viewCount: number;
            category: import("../categories/category.entity").Category;
            categoryId: string;
            createdById: string;
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
    approveJob(id: string): Promise<Job>;
    rejectJob(id: string): Promise<Job>;
    getPendingCount(): Promise<{
        count: number;
    }>;
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
