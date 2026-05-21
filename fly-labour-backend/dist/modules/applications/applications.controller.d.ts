import { ApplicationsService, CreateApplicationDto, UpdateApplicationStatusDto } from './applications.service';
export declare class ApplicationsController {
    private appsService;
    constructor(appsService: ApplicationsService);
    create(dto: CreateApplicationDto, req: any): Promise<import("./application.entity").Application>;
    myApplications(req: any): Promise<import("./application.entity").Application[]>;
    getEmployerApplications(req: any, query: {
        status?: string;
        jobId?: string;
        search?: string;
    }): Promise<import("./application.entity").Application[]>;
    findAll(query: {
        page?: number;
        limit?: number;
        status?: string;
        jobId?: string;
    }): Promise<{
        data: import("./application.entity").Application[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<any[]>;
    findOne(id: string): Promise<import("./application.entity").Application>;
    updateStatus(id: string, dto: UpdateApplicationStatusDto): Promise<import("./application.entity").Application>;
    withdraw(id: string, req: any): Promise<import("./application.entity").Application>;
    employerUpdateStatus(id: string, body: {
        status: string;
        employerNote?: string;
    }, req: any): Promise<import("./application.entity").Application>;
}
