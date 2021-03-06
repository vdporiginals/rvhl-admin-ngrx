
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
export const getPagination = createSelector(
    scheduleFeatureSelector,
    state => {
        return {
            count: state.count,
            pageNum: state.pageNum
        };
    }
);