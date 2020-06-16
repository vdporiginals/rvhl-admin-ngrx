import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { imageActionTypes, imagesLoaded } from '../actions/image.actions';
import { IImage } from 'src/app/models/image.interface';

export interface ImageState extends EntityState<IImage> {
    imagesLoaded: boolean;
}

export const adapter: EntityAdapter<IImage> = createEntityAdapter<IImage>();

export const initialState = adapter.getInitialState({
    imagesLoaded: false
});

export const imageReducer = createReducer(
    initialState,

    on(imageActionTypes.imagesLoaded, (state, action) => {
        return adapter.setAll(
            action.images,
            { ...state, imagesLoaded: true }
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