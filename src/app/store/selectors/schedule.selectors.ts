
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ScheduleState, selectAll, selectIds } from '../reducers/schedule.reducers';

export const scheduleFeatureSelector = createFeatureSelector<ScheduleState>('schedules');

export const getAllSchedules = createSelector(
    scheduleFeatureSelector,
    selectAll
);

export const areSchedulesLoaded = createSelector(
    scheduleFeatureSelector,
    state => state.schedulesLoaded
);
