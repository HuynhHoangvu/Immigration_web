import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
export declare enum JobType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    SEASONAL = "seasonal"
}
export declare enum JobStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    CLOSED = "closed",
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review"
}
export declare class Job {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    requirements: string;
    requirementsEn: string;
    benefits: string;
    benefitsEn: string;
    company: string;
    location: string;
    country: string;
    jobType: JobType;
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
    category: Category;
    categoryId: string;
    createdBy: User;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
}
