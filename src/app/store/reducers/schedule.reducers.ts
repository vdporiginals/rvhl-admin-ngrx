import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { scheduleActionTypes, schedulesLoaded } from '../actions/schedule.actions';
import { ISchedule } from 'src/app/models/schedule.interface';

export interface ScheduleState extends EntityState<ISchedule> {
    schedulesLoaded: boolean;
}

export const adapter: EntityAdapter<ISchedule> = createEntityAdapter<ISchedule>();

export const initialState = adapter.getInitialState({
    schedulesLoaded: false
});

export const scheduleReducer = createReducer(
    initialState,

    on(scheduleActionTypes.schedulesLoaded, (state, action) => {
        return adapter.setAll(
            action.schedules,
            { ...state, schedulesLoaded: true }
        );
    }),

    on(scheduleActionTypes.createSchedule, (state, action) => {
        return adapter.addOne(action.schedule, state);
    }),

    on(scheduleActionTypes.deleteSchedule, (state, action) => {
        return adapter.removeOne(action.scheduleId, state);
    }),

    on(scheduleActionTypes.updateSchedule, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();