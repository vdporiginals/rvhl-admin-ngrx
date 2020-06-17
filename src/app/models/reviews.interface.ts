export interface IReviews {
    _id: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    title: string;
    content: string;
    user: string;
    category: string;
    images: string;
    isPopular: boolean;
    keywords: string;
    tags: [string];
    address: string;
    seo?: string;
}
