
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AccommodationState, selectAll, selectIds } from '../reducers/accommodation.reducers';

export const accommodationFeatureSelector = createFeatureSelector<AccommodationState>('accommodations');

export const getAllAccommodations = createSelector(
    accommodationFeatureSelector,
    selectAll
);

export const areAccommodationsLoaded = createSelector(
    accommodationFeatureSelector,
    state => state.accommodationsLoaded
);
