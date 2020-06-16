
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ImageState, selectAll, selectIds } from '../reducers/image.reducers';

export const imageFeatureSelector = createFeatureSelector<ImageState>('images');

export const getAllImages = createSelector(
    imageFeatureSelector,
    selectAll
);

export const areImagesLoaded = createSelector(
    imageFeatureSelector,
    state => state.imagesLoaded
);
