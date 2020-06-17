export interface ITour {
    _id: number;
    title: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    keywords: string;
    schedule: [{
        timeStart: Date;
        timeEnd: Date;
        location: string;
        service: string;
    }];
    content: string;
    isPopular: boolean;
    video: string;
    phone: string;
    customerNum: number;
    time: string;
    price: number;
    seo: string;
    position: tourPosition;
    category: string;
    address: string;
    user: string;
    images: [string];
}

enum tourPosition { 'TourCruise', 'TourAll', 'TourHaLong' }