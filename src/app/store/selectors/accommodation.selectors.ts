
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AccommodationState, selectAll, selectIds } from '../reducers/accommodation.reducers';
import { accommodationsLoaded } from '../actions/accommodation.actions';

export const accommodationFeatureSelector = createFeatureSelector<AccommodationState>('accommodations');

export const getAllAccommodations = createSelector(
    accommodationFeatureSelector,
    selectAll
);

export const areAccommodationsLoaded = createSelector(
    accommodationFeatureSelector,
    state => {
        return {
            apiName: state.apiName,
            accommodationsLoaded: state.accommodationsLoaded
        }
    },
);
