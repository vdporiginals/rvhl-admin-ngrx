
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReviewState, selectAll, selectIds } from '../reducers/reviews.reducers';

export const reviewFeatureSelector = createFeatureSelector<ReviewState>('reviews');

export const getAllReviews = createSelector(
    reviewFeatureSelector,
    selectAll
);

export const areReviewsLoaded = createSelector(
    reviewFeatureSelector,
    state => state.reviewsLoaded
);
