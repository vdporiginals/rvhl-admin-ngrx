
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EntertainState, selectAll, selectIds } from '../reducers/entertain.reducers';

export const entertainFeatureSelector = createFeatureSelector<EntertainState>('entertains');

export const getAllEntertains = createSelector(
    entertainFeatureSelector,
    selectAll
);

export const areEntertainsLoaded = createSelector(
    entertainFeatureSelector,
    state => state.entertainsLoaded
);
