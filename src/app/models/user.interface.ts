export interface IUser {
    _id: number;
    name: string;
    email: string;
    avatar: string;
    authorizeId: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}