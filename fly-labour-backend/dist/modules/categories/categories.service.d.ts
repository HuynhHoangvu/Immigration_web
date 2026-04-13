import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { GcsService } from '../../common/services/gcs.service';
export declare class CreateCategoryDto {
    name: string;
    nameEn?: string;
    icon?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class CategoriesService implements OnModuleInit {
    private catsRepo;
    private gcsService;
    private readonly logger;
    constructor(catsRepo: Repository<Category>, gcsService: GcsService);
    onModuleInit(): Promise<void>;
    findAll(): Promise<Category[]>;
    findAllAdmin(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(dto: CreateCategoryDto, file?: Express.Multer.File): Promise<Category>;
    update(id: string, dto: Partial<CreateCategoryDto>, file?: Express.Multer.File): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
