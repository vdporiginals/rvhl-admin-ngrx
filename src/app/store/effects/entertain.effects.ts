
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { entertainActionTypes } from '../actions/entertain.actions';
import { EntertainService } from 'src/app/pages/entertain/entertain.service';

@Injectable()
export class EntertainEffects {

    loadEntertains$ = createEffect(() =>
        this.actions$.pipe(
            ofType(entertainActionTypes.loadEntertains),
            concatMap((actions) => this.entertainService.getDatas('entertains', actions.params)),
            map((entertains: any) => entertainActionTypes.entertainsLoaded({ entertains: entertains.data }))
        )
    );

    createEntertain$ = createEffect(() =>
        this.actions$.pipe(
            ofType(entertainActionTypes.createEntertain),
            concatMap((action) => this.entertainService.create('entertains', action.entertain)),
            tap(() => this.router.navigateByUrl('/entertains'))
        ),
        { dispatch: false }
    );

    deleteEntertain$ = createEffect(() =>
        this.actions$.pipe(
            ofType(entertainActionTypes.deleteEntertain),
            concatMap((action) => this.entertainService.delete('entertains', action.entertainId))
        ),
        { dispatch: false }
    );

    updateEntertain$ = createEffect(() =>
        this.actions$.pipe(
            ofType(entertainActionTypes.updateEntertain),
            concatMap((action) => this.entertainService.update('entertains', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private entertainService: EntertainService, private actions$: Actions, private router: Router) { }
}
