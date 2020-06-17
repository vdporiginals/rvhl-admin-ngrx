export interface IAccommodation {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    seo?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    isPopular: boolean;
    price: number;
    content?: string;
    roomNum?: number;
    address: string;
    services?: [''];
    images: [''];
    views: string;
    phone: string;
    facilities: {
        bed: string;
        restaurant: boolean;
        bbqArea: boolean;
        meetingRoom: boolean;
        square: number;
        pool: boolean;
        oceanViews: boolean;
        kitchen: boolean;
        other: [''];
    };
    showHomepage: string;
    category: string;
    keywords: string;
}