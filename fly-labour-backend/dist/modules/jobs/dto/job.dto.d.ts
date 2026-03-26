import { JobType, JobStatus } from '../job.entity';
export declare class CreateJobDto {
    title: string;
    description: string;
    requirements?: string;
    benefits?: string;
    company?: string;
    location?: string;
    country: string;
    jobType?: JobType;
    status?: JobStatus;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    slots?: number;
    deadline?: string;
    image?: string;
    isHot?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
}
export declare class UpdateJobDto extends CreateJobDto {
}
export declare class QueryJobDto {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    categoryId?: string;
    jobType?: string;
    isHot?: boolean;
}
