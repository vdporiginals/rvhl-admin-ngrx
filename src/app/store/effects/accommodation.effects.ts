
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
            concatMap((actions) => this.accommodationService.getDatas('accommodations', actions.params)),
            map((accommodations: any) => accommodationActionTypes.accommodationsLoaded({ accommodations: accommodations.data }))
        )
    );

    createAccommodation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.createAccommodation),
            concatMap((action) => this.accommodationService.create('accommodations', action.accommodation)),
            tap(() => this.router.navigateByUrl('/accommodations'))
        ),
        { dispatch: false }
    );

    deleteAccommodation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.deleteAccommodation),
            concatMap((action) => this.accommodationService.delete('accommodations', action.accommodationId))
        ),
        { dispatch: false }
    );

    updateAccommodation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(accommodationActionTypes.updateAccommodation),
            concatMap((action) => this.accommodationService.update('accommodations', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private accommodationService: AccommodationService, private actions$: Actions, private router: Router) { }
}
