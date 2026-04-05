import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';
export declare class JobsController {
    private jobsService;
    constructor(jobsService: JobsService);
    findAll(query: QueryJobDto): Promise<{
        data: import("./job.entity").Job[];
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
    findHot(): Promise<import("./job.entity").Job[]>;
    findEmployerJobs(req: any, query: QueryJobDto): Promise<{
        data: import("./job.entity").Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createByEmployer(dto: CreateJobDto, req: any, file?: Express.Multer.File): Promise<import("./job.entity").Job>;
    updateByEmployer(id: string, dto: UpdateJobDto, req: any, file?: Express.Multer.File): Promise<import("./job.entity").Job>;
    deleteByEmployer(id: string, req: any): Promise<{
        message: string;
    }>;
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
            status: import("./job.entity").JobStatus;
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
    getStats(): Promise<{
        totalJobs: number;
        activeJobs: number;
        totalUsers: number;
        totalViews: number;
        byCountry: any[];
    }>;
    getPendingCount(): Promise<{
        count: number;
    }>;
    approveJob(id: string): Promise<import("./job.entity").Job>;
    rejectJob(id: string): Promise<import("./job.entity").Job>;
    create(dto: CreateJobDto, file?: Express.Multer.File): Promise<import("./job.entity").Job>;
    update(id: string, dto: UpdateJobDto, file?: Express.Multer.File): Promise<import("./job.entity").Job>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./job.entity").Job>;
}
