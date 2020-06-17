export interface ICategory {
    _id: string;
    name: string;
    description: string;
    keywords: string;
    position?: Position;
    createdAt: Date;
    updatedAt: Date;
}

enum Position {
    'slider', 'video', 'HomepageAdvertise', 'AdvertisePage', 'Hotel', 'Villa', 'Homestay'
}