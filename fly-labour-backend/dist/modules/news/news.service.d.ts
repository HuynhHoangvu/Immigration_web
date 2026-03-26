import { Repository } from 'typeorm';
import { News } from './news.entity';
export declare class CreateNewsDto {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    image?: string;
    isPublished?: boolean;
}
export declare class NewsService {
    private newsRepo;
    constructor(newsRepo: Repository<News>);
    findAll(): Promise<News[]>;
    findAllAdmin(): Promise<News[]>;
    findOne(slug: string): Promise<News>;
    create(dto: CreateNewsDto, file?: Express.Multer.File): Promise<News>;
    update(id: string, dto: Partial<CreateNewsDto>, file?: Express.Multer.File): Promise<News>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private saveFile;
}
