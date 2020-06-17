export interface ITransfer {
    _id: number;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    name: string;
    locationStart?: string;
    locationEnd?: string;
    timeStart?: string
    timePerTrip?: string;
    content: string;
    chairNum: string;
    price: number;
    keywords: string;
    category: string;
    schedule: string;
    images: [string];
    phone: string;
    seo: string;
    isPopular: boolean;
}