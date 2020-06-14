export interface ISchedule {
    _id: number;
    title: string;
    content: string;
    description?: string;
    user: object;
    image?: string;
    category: object;
    isPopular?: boolean;
    keywords?: string;
    tags?: [''];
    address?: string;
    seo: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    images: [''];
}