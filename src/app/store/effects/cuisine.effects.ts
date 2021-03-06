
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { cuisineActionTypes } from '../actions/cuisine.actions';
import { CuisineService } from 'src/app/pages/cuisine/cuisine.service';

@Injectable()
export class CuisineEffects {

    loadCuisines$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cuisineActionTypes.loadCuisines),
            concatMap((actions) => this.cuisineService.getDatas('restaurants', actions.params)),
            map((cuisines: any) => cuisineActionTypes.cuisinesLoaded({
                cuisines: cuisines.data,
                count: cuisines.count,
                pageNum: cuisines.pageNum || 1,
            }))
        )
    );

    createCuisine$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cuisineActionTypes.createCuisine),
            concatMap((action) => this.cuisineService.create('restaurants', action.cuisine)),
            // tap(() => this.router.navigateByUrl('/restaurants'))
        ),
        { dispatch: false }
    );

    deleteCuisine$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cuisineActionTypes.deleteCuisine),
            concatMap((action) => this.cuisineService.delete('restaurants', action.cuisineId))
        ),
        { dispatch: false }
    );

    updateCuisine$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cuisineActionTypes.updateCuisine),
            concatMap((action) => this.cuisineService.update('restaurants', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private cuisineService: CuisineService, private actions$: Actions, private router: Router) { }
}
