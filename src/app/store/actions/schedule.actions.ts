
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ISchedule } from 'src/app/models/schedule.interface';


export const loadSchedules = createAction(
    '[Schedules List] Load Schedules via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const schedulesLoaded = createAction(
    '[Schedules Effect] Schedules Loaded Successfully',
    props<{ schedules: ISchedule[] }>()
);

// export const scheduleLoaded = createAction(
//     '[Schedule Effect] Schedule Loaded Successfully',
//     props<{ schedule: ISchedule }>()
// );

export const createSchedule = createAction(
    '[Create Schedule Component] Create Schedule',
    props<{ schedule: ISchedule }>()
);

export const deleteSchedule = createAction(
    '[Schedules List Operations] Delete Schedule',
    props<{ scheduleId: string }>()
);

export const updateSchedule = createAction(
    '[Schedules List Operations] Update Schedule',
    props<{ update: Update<ISchedule> }>()
);

export const scheduleActionTypes = {
    loadSchedules,
    schedulesLoaded,
    createSchedule,
    deleteSchedule,
    updateSchedule
};
