export interface IEntertain {
    _id: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    name: string;
    price: number;
    content: string;
    address?: string;
    images: string;
    seo?: string;
    video?: string;
    category: string;
    phone: string;
    isPopular: boolean;
    keywords?: string;
}
