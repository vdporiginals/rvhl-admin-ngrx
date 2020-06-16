
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CuisineState, selectAll, selectIds } from '../reducers/cuisine.reducers';

export const cuisineFeatureSelector = createFeatureSelector<CuisineState>('cuisines');

export const getAllCuisines = createSelector(
    cuisineFeatureSelector,
    selectAll
);

export const areCuisinesLoaded = createSelector(
    cuisineFeatureSelector,
    state => state.cuisinesLoaded
);
