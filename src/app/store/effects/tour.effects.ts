
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tourActionTypes } from '../actions/tour.actions';
import { TourService } from 'src/app/pages/tour/tour.service';

@Injectable()
export class TourEffects {

    loadTours$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tourActionTypes.loadTours),
            concatMap((actions) => this.tourService.getDatas('tours', actions.params)),
            map((tours: any) => tourActionTypes.toursLoaded({ tours: tours.data }))
        )
    );

    createTour$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tourActionTypes.createTour),
            concatMap((action) => this.tourService.create('tours', action.tour)),
            tap(() => this.router.navigateByUrl('/tours'))
        ),
        { dispatch: false }
    );

    deleteTour$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tourActionTypes.deleteTour),
            concatMap((action) => this.tourService.delete('tours', action.tourId))
        ),
        { dispatch: false }
    );

    updateTour$ = createEffect(() =>
        this.actions$.pipe(
            ofType(tourActionTypes.updateTour),
            concatMap((action) => this.tourService.update('tours', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private tourService: TourService, private actions$: Actions, private router: Router) { }
}
