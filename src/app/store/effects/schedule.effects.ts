
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { scheduleActionTypes } from '../actions/schedule.actions';
import { ScheduleService } from 'src/app/pages/schedule/schedule.service';

@Injectable()
export class ScheduleEffects {

    loadSchedules$ = createEffect(() =>
        this.actions$.pipe(
            ofType(scheduleActionTypes.loadSchedules),
            concatMap((actions) => this.scheduleService.getDatas('blogs', actions.params)),
            map((schedules: any) => scheduleActionTypes.schedulesLoaded({
                schedules: schedules.data, count: schedules.count,
                pageNum: schedules.pageNum || 1,
            }))
        )
    );

    createSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(scheduleActionTypes.createSchedule),
            concatMap((action) => this.scheduleService.create('blogs', action.schedule)),
            tap(() => this.router.navigateByUrl('/schedules'))
        ),
        { dispatch: false }
    );

    deleteSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(scheduleActionTypes.deleteSchedule),
            concatMap((action) => this.scheduleService.delete('blogs', action.scheduleId))
        ),
        { dispatch: false }
    );

    updateSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(scheduleActionTypes.updateSchedule),
            concatMap((action) => this.scheduleService.update('blogs', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private scheduleService: ScheduleService, private actions$: Actions, private router: Router) { }
}