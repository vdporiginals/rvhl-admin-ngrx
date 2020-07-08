
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { advertiseActionTypes } from '../actions/advertise.actions';
import { AdvertiseService } from 'src/app/pages/advertise/advertise.service';

@Injectable()
export class AdvertiseEffects {

    loadAdvertises$ = createEffect(() =>
        this.actions$.pipe(
            ofType(advertiseActionTypes.loadAdvertises),
            concatMap((actions) => this.advertiseService.getDatas('advertises', actions.params)),
            map((advertises: any) => advertiseActionTypes.advertisesLoaded({
                advertises: advertises.data,
                count: advertises.count,
                pageNum: advertises.pageNum || 1,
            }))
        )
    );

    createAdvertise$ = createEffect(() =>
        this.actions$.pipe(
            ofType(advertiseActionTypes.createAdvertise),
            concatMap((action) => this.advertiseService.create('advertises', action.advertise)),
            tap(() => this.router.navigateByUrl('/advertises'))
        ),
        { dispatch: false }
    );

    deleteAdvertise$ = createEffect(() =>
        this.actions$.pipe(
            ofType(advertiseActionTypes.deleteAdvertise),
            concatMap((action) => this.advertiseService.delete('advertises', action.advertiseId))
        ),
        { dispatch: false }
    );

    updateAdvertise$ = createEffect(() =>
        this.actions$.pipe(
            ofType(advertiseActionTypes.updateAdvertise),
            concatMap((action) => this.advertiseService.update('advertises', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private advertiseService: AdvertiseService, private actions$: Actions, private router: Router) { }
}
