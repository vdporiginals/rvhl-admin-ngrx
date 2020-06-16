
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AdvertiseState, selectAll, selectIds } from '../reducers/advertise.reducers';

export const advertiseFeatureSelector = createFeatureSelector<AdvertiseState>('advertises');

export const getAllAdvertises = createSelector(
    advertiseFeatureSelector,
    selectAll
);

export const areAdvertisesLoaded = createSelector(
    advertiseFeatureSelector,
    state => state.advertisesLoaded
);
