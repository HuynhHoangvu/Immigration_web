import { User } from '../users/user.entity';
import { Job } from '../jobs/job.entity';
export declare enum ApplicationStatus {
    PENDING = "pending",
    REVIEWING = "reviewing",
    APPROVED = "approved",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn"
}
export declare class Application {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    education: string;
    experience: string;
    languageLevel: string;
    cvUrl: string;
    coverLetter: string;
    adminNote: string;
    employerNote: string;
    status: ApplicationStatus;
    user: User;
    userId: string;
    job: Job;
    jobId: string;
    createdAt: Date;
    updatedAt: Date;
}
