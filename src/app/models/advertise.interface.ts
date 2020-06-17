export interface IAdvertise {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    keywords?: string;
    link?: string;
    pagePosition: PagePosition;
    video?: string;
    typeAdvertise: TypeAdvertise;
    category: string;
    isPopular: boolean;
}

enum TypeAdvertise {
    'BannerPage',
    'Advertise',
}

enum PagePosition {
    'Homepage',
    'TourCruisePage',
    'TourAllPage',
    'TransferPage',
    'TourHalongPage',
    'SchedulePage',
    'EntertainPage',
    'ReviewPage',
    'FoodPage',
    'HotelPage',
    'HomestayPage',
    'VillaPage',
}