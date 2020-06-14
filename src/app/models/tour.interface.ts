export interface ITour {
    _id: number;
    title: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
}