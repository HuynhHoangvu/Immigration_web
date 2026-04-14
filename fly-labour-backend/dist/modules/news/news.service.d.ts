import { Repository } from 'typeorm';
import { News } from './news.entity';
import { GcsService } from '../../common/services/gcs.service';
export declare class CreateNewsDto {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    image?: string;
    isPublished?: boolean;
    type?: 'news' | 'handbook';
}
export declare class NewsService {
    private newsRepo;
    private gcsService;
    constructor(newsRepo: Repository<News>, gcsService: GcsService);
    findAll(): Promise<News[]>;
    findAllHandbook(): Promise<News[]>;
    findAllAdmin(): Promise<News[]>;
    findAllHandbookAdmin(): Promise<News[]>;
    findOne(slug: string): Promise<News>;
    create(dto: CreateNewsDto, file?: Express.Multer.File): Promise<News>;
    update(id: string, dto: Partial<CreateNewsDto>, file?: Express.Multer.File): Promise<News>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private parseBoolean;
    private saveFile;
}
