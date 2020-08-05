
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AdvertiseState, selectAll, selectIds } from '../reducers/advertise.reducers';

export const advertiseFeatureSelector = createFeatureSelector<AuthState>('auth');
