export declare class News {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    type: 'news' | 'handbook' | 'study' | 'travel';
    country: string;
    studyType: string;
    registerUrl: string;
    priceFrom: number;
    priceTo: number;
    priceCurrency: string;
    itinerary: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
