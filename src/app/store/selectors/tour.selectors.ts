
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TourState, selectAll, selectIds } from '../reducers/tour.reducers';

export const tourFeatureSelector = createFeatureSelector<TourState>('tours');

export const getAllTours = createSelector(
    tourFeatureSelector,
    selectAll
);

export const areToursLoaded = createSelector(
    tourFeatureSelector,
    state => state.toursLoaded
);
