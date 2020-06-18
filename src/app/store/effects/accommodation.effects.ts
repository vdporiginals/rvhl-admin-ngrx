
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { accommodationActionTypes } from '../actions/accommodation.actions';
import { AccommodationService } from 'src/app/pages/accommodation/accommodation.service';

@Injectable()
export class AccommodationEffects {

    loadAccommodations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.loadAccommodations),
            concatMap((actions) => this.accommodationService.getDatas(actions.apiName, actions.params).pipe(map((res) => {
                return {
                    apiName: actions.apiName,
                    data: res
                };
            }))),
            map((accommodations: any) => {
                return accommodationActionTypes.accommodationsLoaded({
                    apiName: accommodations.apiName,
                    accommodations: accommodations.data.data
                });
            })
        )
    );

    createAccommodation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.createAccommodation),
            concatMap((action) => this.accommodationService.create(action.apiName, action.accommodation)),
            tap(() => this.router.navigate(['accommodations']))
        ),
        { dispatch: false }
    );

    deleteAccommodation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.deleteAccommodation),
            concatMap((action) => this.accommodationService.delete(action.apiName, action.accommodationId))
        ),
        { dispatch: false }
    );

    updateAccommodation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.updateAccommodation),
            concatMap((action) => this.accommodationService.update(action.apiName, action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private accommodationService: AccommodationService, private actions$: Actions, private router: Router) { }
}
