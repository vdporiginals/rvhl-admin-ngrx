export interface ICuisine {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    content: string;
    address: string;
    views: string;
    seo?: string;
    price: number;
    menu: [{
        name: string,
        price: number,
        description: string,
        image: string
    }];
    gallery: [string];
    category: string;
    phone: string;
    isPopular: boolean;
    keywords: string;
}