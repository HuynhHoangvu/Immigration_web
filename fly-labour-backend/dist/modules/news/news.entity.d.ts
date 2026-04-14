export declare class News {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    type: 'news' | 'handbook';
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
