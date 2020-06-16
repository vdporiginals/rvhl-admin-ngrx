
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ISchedule } from 'src/app/models/schedule.interface';
import { IImage } from 'src/app/models/image.interface';


export const loadImages = createAction(
    '[Images List] Load Images via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
            size?: string;
        },
    }>()
);

export const imagesLoaded = createAction(
    '[Images Effect] Images Loaded Successfully',
    props<{ images: IImage[] }>()
);

// export const galleriesLoaded = createAction('[Gallery Effect] Gallery loaded Successfully',)

// export const imageLoaded = createAction(
//     '[image Effect] image Loaded Successfully',
//     props<{ image: Iimage }>()
// );

export const createImage = createAction(
    '[Create Image Component] Create Image',
    props<{ image: IImage }>()
);

export const deleteImage = createAction(
    '[Images List Operations] Delete Image',
    props<{ imageId: string }>()
);

export const updateImage = createAction(
    '[Images List Operations] Update Image',
    props<{ update: Update<IImage> }>()
);

export const imageActionTypes = {
    loadImages,
    imagesLoaded,
    createImage,
    deleteImage,
    updateImage
};
