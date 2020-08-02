import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { imageActionTypes, imagesLoaded } from '../actions/image.actions';
import { IImage } from 'src/app/models/image.interface';

export interface ImageState extends EntityState<IImage> {
    count: number;
    pageNum: number;
    pageSize: number;
    totalPages: number;
    imagesLoaded: boolean;
}

export const adapter: EntityAdapter<IImage> = createEntityAdapter<IImage>({
    // selectId: images => images.data.id
});

export const initialState = adapter.getInitialState({
    pageNum: 0,
    count: 0,
    pageSize: 0,
    totalPages: 0,
    imagesLoaded: false
});

export const imageReducer = createReducer(
    initialState,

    on(imageActionTypes.imagesLoaded, (state, action) => {
        console.log(action)
        return adapter.setAll(
            action.images,
            {
                ...state,
                count: action.count,
                pageNum: action.pageNum,
                pageSize: action.pageSize,
                totalPages: action.totalPages,
                imagesLoaded: true
            }
        );
    }),

    on(imageActionTypes.createImage, (state, action) => {
        return adapter.addOne(action.image, state);
    }),

    on(imageActionTypes.deleteImage, (state, action) => {
        return adapter.removeOne(action.imageId, state);
    }),

    on(imageActionTypes.updateImage, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
