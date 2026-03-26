import { NewsService, CreateNewsDto } from './news.service';
import { News } from './news.entity';
export declare class NewsController {
    private newsService;
    constructor(newsService: NewsService);
    findAll(): Promise<News[]>;
    findAllAdmin(): Promise<News[]>;
    findOne(slug: string): Promise<News>;
    create(dto: CreateNewsDto, file?: Express.Multer.File): Promise<News>;
    update(id: string, dto: Partial<CreateNewsDto>, file?: Express.Multer.File): Promise<News>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export declare class NewsModule {
}
