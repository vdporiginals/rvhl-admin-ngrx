import { IImage } from 'src/app/models/image.interface';

export interface ImageState {
    items: IImage[];
    currentItem: IImage;
    status: 'idle' | 'loading' | 'error';
    error?: string;
    // sort: 'asc' | 'desc' | null;
}
