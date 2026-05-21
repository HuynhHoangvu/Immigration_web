import { JobType, JobStatus } from '../job.entity';
export declare class CreateJobDto {
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    requirements?: string;
    requirementsEn?: string;
    benefits?: string;
    benefitsEn?: string;
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
    images?: string[];
    isHot?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
    forceRetranslate?: boolean;
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
    isFeatured?: boolean;
    sort?: string;
    status?: string;
}
