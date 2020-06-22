
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ImageState, selectAll, selectIds } from '../reducers/image.reducers';
import { state } from '@angular/animations';

export const imageFeatureSelector = createFeatureSelector<ImageState>('images');
export const getAllImages = createSelector(
    imageFeatureSelector,
    selectAll,
);

export const areImagesLoaded = createSelector(
    imageFeatureSelector,
    state => state.imagesLoaded
);

export const getPagination = createSelector(
    imageFeatureSelector,
    state => {
        return {
            count: state.count,
            totalPages: state.totalPages,
            pageSize: state.pageSize,
            pageNum: state.pageNum
        };
    }
);
